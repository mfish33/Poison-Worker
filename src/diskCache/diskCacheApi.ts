import * as fs from 'fs/promises'
import { Constructs, staticImplements } from "../utils"
import * as crypto from "crypto"
import { createSimpleFileFooter, SimpleFileHeader } from "./diskCacheFileFormat"

export interface SerializableObject {
    serialize(): Buffer
}

export interface DeSerializableObject<T> extends Constructs<T> {
    read(buffer: Buffer): { result: T, leftover: Buffer }
}

@staticImplements<DeSerializableObject<StringBody>>()
class StringBody implements SerializableObject {
    constructor(public value:string) {}
    
    static read(buffer: Buffer) {
        return {
            result: new StringBody(buffer.toString()),
            leftover: Buffer.alloc(0)
        }
    }

    serialize(): Buffer {
        return Buffer.from(this.value)
    }
}

@staticImplements<DeSerializableObject<BinaryBody>>()
class BinaryBody implements SerializableObject {
    constructor(public value:Buffer) {}
    
    static read(buffer: Buffer) {
        return {
            result: new BinaryBody(buffer),
            leftover: Buffer.alloc(0)
        }
    }

    serialize(): Buffer {
        return this.value
    }
}

function createFileOneReader<T extends SerializableObject>(body: DeSerializableObject<T>) {
    @staticImplements<DeSerializableObject<File1Reader>>()
    class File1Reader implements SerializableObject {
        constructor(
            public readonly header: SimpleFileHeader,
            // TODO: I hate this type signature. Can we make it better?
            public readonly footer: ReturnType<typeof createSimpleFileFooter<T>>["prototype"],
        ) {}
        
        static read(buffer: Buffer) {
            const { result: header, leftover:leftoverAfterHeader } = SimpleFileHeader.read(buffer)
            const {result: footer, leftover:leftoverAfterFooter } = createSimpleFileFooter(body).read(leftoverAfterHeader)

            return {
                result: new File1Reader(header, footer),
                leftover: leftoverAfterFooter
            }
        }
    
        serialize(): Buffer {
            return Buffer.concat([this.header.serialize(), this.footer.serialize()])
        }

    }

    return File1Reader
}

function createFileZeroReader<T extends SerializableObject, U extends SerializableObject>(body1: DeSerializableObject<T>, body2: DeSerializableObject<U>) {
    @staticImplements<DeSerializableObject<File0Reader>>()
    class File0Reader implements SerializableObject {
        constructor(
            public readonly header: SimpleFileHeader,
            // TODO: I hate this type signature. Can we make it better?
            public readonly footer1: ReturnType<typeof createSimpleFileFooter<T>>["prototype"],

            public readonly footer2: ReturnType<typeof createSimpleFileFooter<U>>["prototype"],
        ) {}
        
        static read(buffer: Buffer) {
            const { result: header, leftover:leftoverAfterHeader } = SimpleFileHeader.read(buffer)
            const {result: footer1, leftover:leftoverAfterFooter1 } = createSimpleFileFooter(body1).read(leftoverAfterHeader)
            const {result: footer2, leftover:leftoverAfterFooter2 } = createSimpleFileFooter(body2).read(leftoverAfterFooter1)

            return {
                result: new File0Reader(header, footer1, footer2),
                leftover: leftoverAfterFooter2
            }
        }
    
        serialize(): Buffer {
            return Buffer.concat([this.header.serialize(), this.footer1.serialize(), this.footer2.serialize()])
        }
    }

    return File0Reader
}

export enum Streams {
    ServiceWorkerScriptContent = 0,
    ServiceWorkerRequestInfo = 1,
    ServiceWorkerMetadata = 2
}

function getFileName(key: string, stream: Streams) {
    const sha1Buffer = crypto.createHash("sha1").update(key).digest()
    const hashKey = sha1Buffer.readBigUint64LE(0)
    const fileBase = hashKey.toString(16).padStart(16, "0")
    return `${fileBase}_${stream == 2 ? 1 : 0}`
}


type DiskCacheReturnType<T extends Streams> = 
    T extends Streams.ServiceWorkerScriptContent ? StringBody :
    T extends Streams.ServiceWorkerRequestInfo ? BinaryBody :
    T extends Streams.ServiceWorkerMetadata ? BinaryBody :
    never

let _fileBase: string | undefined
export function getFileBase(): string {
    if(!_fileBase) {
        throw new Error("Please set a file base in order to use disk cache")
    }
    return _fileBase
}

export function setFileBase(fileBase: string) {
    _fileBase = fileBase
}

export async function get<S extends Streams>(key: string, stream: S): Promise<{save: () => Promise<void>, body: DiskCacheReturnType<S>}> {
    const fileName = getFileName(key, stream)
    console.log(`Opening disk cache file: ${fileName}`)

    const fileBase = getFileBase()
    const fileContents = await fs.readFile(`${fileBase}/${fileName}`)
    const saveFile = async (buffer: Buffer) => {
        await fs.writeFile(`${fileBase}/${fileName}`, buffer)
    }
    switch(stream) {
        case Streams.ServiceWorkerScriptContent: {
            const fileHandle = createFileZeroReader(StringBody, BinaryBody).read(fileContents).result
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer1.body
            }
        }
        case Streams.ServiceWorkerRequestInfo: {
            const fileHandle = createFileZeroReader(StringBody, BinaryBody).read(fileContents).result
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer2.body
            }
        }
        case Streams.ServiceWorkerMetadata: {
            const fileHandle = createFileOneReader(BinaryBody).read(fileContents).result
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer.body
            }
        }
    }

    throw new Error("This code should be unreachable. In: `diskCacheGet`")
}

export async function remove(key: string, stream: Streams) {
    const fileName = getFileName(key, stream)
    const fileBase = getFileBase()
    await fs.rm(`${fileBase}/${fileName}`)
}