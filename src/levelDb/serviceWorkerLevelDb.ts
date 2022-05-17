import { Level } from "level"
import { ServiceWorkerNavigationPreloadState, ServiceWorkerOriginTrialInfo, ServiceWorkerRegistrationData, ServiceWorkerResourceRecord } from './generated'

// TODO: See if the write buffer size if important or not

let _dbPath: string | undefined
export function getDbPath(): string {
    if(!_dbPath) {
        throw new Error("Please set a file base in order to use leveldb")
    }
    return _dbPath
}

export function setDbPath(fileBase: string) {
    _dbPath = fileBase
}

let _db:Level<Buffer, Buffer> | undefined
function getDb(): Level<Buffer, Buffer> {
    if(!_db) {
        _db = new Level(getDbPath(), { keyEncoding:"binary", valueEncoding:"binary", writeBufferSize:524288 })
    }
    return _db
}

export async function closeDb() {
    await _db?.close()
    _db = undefined
}

export async function addRegistration(url: URL) : Promise<number> {
    const allEntries = await getLevelDbData()

    const nextRegistrationIdEntry = allEntries.find(entry => entry.key.toString() === "INITDATA_NEXT_REGISTRATION_ID")!
    const nextRegistrationId = Number(nextRegistrationIdEntry.value.toString())
    nextRegistrationIdEntry.value = Buffer.from((nextRegistrationId + 1).toString())

    const nextResourceIdEntry = allEntries.find(entry => entry.key.toString() === "INITDATA_NEXT_RESOURCE_ID")!
    const nextResourceId = Number(nextResourceIdEntry.value.toString())
    nextResourceIdEntry.value = Buffer.from((nextResourceId + 1).toString())

    const nextVersionIdEntry = allEntries.find(entry => entry.key.toString() === "INITDATA_NEXT_VERSION_ID")!
    const nextVersionId = Number(nextVersionIdEntry.value.toString())
    nextVersionIdEntry.value = Buffer.from((nextVersionId + 1).toString())

    const uniqueOriginEntry = {key: Buffer.from(`INITDATA_UNIQUE_ORIGIN:${url.origin}/`), value: Buffer.from("")}

    const registrationData = new ServiceWorkerRegistrationData()
    registrationData.setRegistrationId(Number(nextRegistrationId))
    registrationData.setScopeUrl(`${url.origin}/`)
    registrationData.setScriptUrl(`${url.origin}/invalid.js`)
    registrationData.setVersionId(Number(nextVersionId))
    registrationData.setIsActive(true)
    registrationData.setHasFetchHandler(true)
    // TODO: Figure out a better way to set the date
    registrationData.setLastUpdateCheckTime(13325671046262602)
    // This number does not seem to be important
    registrationData.setResourcesTotalSizeBytes(55000)
    const originTrialTokens = new ServiceWorkerOriginTrialInfo()
    originTrialTokens.setFeaturesList([])
    registrationData.setOriginTrialTokens(originTrialTokens)
    const navigationPreloadState = new ServiceWorkerNavigationPreloadState()
    navigationPreloadState.setEnabled(false)
    navigationPreloadState.setHeader("true")
    registrationData.setNavigationPreloadState(navigationPreloadState)
    // TODO: Investigate these values further
    registrationData.setUsedFeaturesList([15,  593,  780, 1067, 1075, 1076, 1441, 2236, 2238, 2663, 3266])
    // Set as a classic service worker file
    registrationData.setScriptType(0)
    // TODO: Investigate these values further
    registrationData.setScriptResponseTime(13297128029669592)
    registrationData.setCrossOriginEmbedderPolicyValue(0)
    // No clue what this value does
    registrationData.setCrossOriginEmbedderPolicyReportOnlyValue(0)

    console.log(registrationData.toObject())

    const registrationEntry = {
        key: Buffer.concat([Buffer.from(`REG:${url.origin}/`), Buffer.from([0]), Buffer.from(`${nextRegistrationId}`)]),
        value: Buffer.from(registrationData.serializeBinary())
    }

    const resourceData = new ServiceWorkerResourceRecord()
    resourceData.setResourceId(Number(nextResourceId))
    resourceData.setUrl(`${url.origin}/invalid.js`)
    // The size does not seem to matter to functionality
    resourceData.setSizeBytes(55000)

    console.log(resourceData.toObject())

    const resourceEntry = {
        key: Buffer.concat([Buffer.from(`RES:${nextVersionId}`), Buffer.from([0]), Buffer.from(`${nextResourceId}`)]),
        value: Buffer.from(resourceData.serializeBinary())
    }

    const batchArgument = [
        nextRegistrationIdEntry, 
        nextResourceIdEntry, 
        nextVersionIdEntry,
        uniqueOriginEntry,
        registrationEntry,
        resourceEntry
    ]
        .map(({key, value: deserializedValue}) => {
            return {type: "put" as const, key, value: Buffer.from(deserializedValue)}
        })
    const db = getDb()    
    await db.batch(batchArgument)

    return nextResourceId
}

async function getLevelDbData(): Promise<IndexDbRecord<Buffer>[]> {
    const db = getDb()
    const data = []
    for await (const [key, value] of db.iterator()) {
        data.push({key, value})
    }

    return data
}

type IndexDbRecord<T> = { key: Buffer, value: T }

export interface RegistrationInfo {
    registration: IndexDbRecord<ServiceWorkerRegistrationData>,
    resourceRecords: IndexDbRecord<ServiceWorkerResourceRecord>[]
}

export async function getRegistrations(url: URL): Promise<RegistrationInfo[]> {
    const allEntries = await getLevelDbData()
    return allEntries
        .filter(({key}) => key.toString().startsWith(`REG:${url.origin}`))
        .map(({key: regKey, value: regBuffer}) => {
            const registration = ServiceWorkerRegistrationData.deserializeBinary(regBuffer)
            const resourceRecords = allEntries
                .filter(({key}) => key.toString().startsWith(`RES:${registration.getVersionId()}`))
                .map(({key, value}) => ({ key, value:ServiceWorkerResourceRecord.deserializeBinary(value) }))
            return {
                registration: { key: regKey, value: registration },
                resourceRecords
            }
        })
}

export async function hasRegistration(url: URL): Promise<boolean> {
    return !!(await getRegistrations(url)).length
}

export async function saveRegistrationEntries(...entries: IndexDbRecord<ServiceWorkerRegistrationData | ServiceWorkerResourceRecord>[]) {
    const db = getDb()
    const batchArgument = entries.map(({key, value: deserializedValue}) => {
        return {type: "put" as const, key, value: Buffer.from(deserializedValue.serializeBinary())}
    })
    
    await db.batch(batchArgument)
}

export async function printAllKeys() {
    const allEntries = await getLevelDbData()
    for(let entry of allEntries) {
        console.log(entry.key.toString())
    }
}
