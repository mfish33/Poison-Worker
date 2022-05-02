import { Level } from "level"
import { ServiceWorkerRegistrationData, ServiceWorkerResourceRecord } from './generated'

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

export function addRegistration(url: string) {
    throw new Error("TODO")
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

export async function getRegistrations(url: string): Promise<RegistrationInfo[]> {
    const allEntries = await getLevelDbData()
    return allEntries
        .filter(({key}) => key.toString().startsWith(`REG:${url}`))
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

export async function saveRegistrationEntries(...entries: IndexDbRecord<ServiceWorkerRegistrationData | ServiceWorkerResourceRecord>[]) {
    const db = getDb()
    const batchArgument = entries.map(({key, value: deserializedValue}) => {
        return {type: "put" as const, key, value: Buffer.from(deserializedValue.serializeBinary())}
    })
    
    await db.batch(batchArgument)
}

