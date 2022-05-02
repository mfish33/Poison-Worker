import { crc32, staticImplements } from "../utils";
import { DeSerializableObject, SerializableObject } from "./diskCacheApi";
import * as assert from "assert"

const SIMPLE_DISK_CACHE_VERSION = 5

@staticImplements<DeSerializableObject<SimpleFileHeader>>()
export class SimpleFileHeader implements SerializableObject {
    private static CORRECT_MAGIC_NUMBER = 0xfcfb6d1ba7725c30n
    // total size + 4 bytes for padding
    static SimpleFileHeaderSize = 24
    
    constructor(
        // uint64_t
        public readonly headerMagicNumber: bigint,
        // uint32_t
        public readonly version: number,
        // uint32_t
        public readonly keyLength: number,
        // uint32_t
        public readonly keyHash: number,
        // String
        public readonly key: string
    ) {}

    static read(buffer: Buffer) {
        const headerMagicNumber = buffer.readBigUInt64LE(0)
        assert.equal(headerMagicNumber, SimpleFileHeader.CORRECT_MAGIC_NUMBER, "Received Invalid Header Magic Number")
        const version = buffer.readUInt32LE(8)
        assert.equal(version, SIMPLE_DISK_CACHE_VERSION, "Opened disk cache file with unexpected version")
        const keyLength = buffer.readUInt32LE(12)
        const keyHash = buffer.readUInt32LE(16)
        const key = buffer.slice(SimpleFileHeader.SimpleFileHeaderSize, SimpleFileHeader.SimpleFileHeaderSize + keyLength).toString()
        const header = new SimpleFileHeader(headerMagicNumber, version, keyLength, keyHash, key)

        return {
            leftover: buffer.slice(SimpleFileHeader.SimpleFileHeaderSize + keyLength),
            result: header
        }

    }

    serialize(): Buffer {
        const headerBuffer = Buffer.alloc(SimpleFileHeader.SimpleFileHeaderSize + this.keyLength, 0)
        headerBuffer.writeBigUInt64LE(this.headerMagicNumber, 0)
        headerBuffer.writeUInt32LE(this.version, 8)
        headerBuffer.writeUInt32LE(this.keyLength, 12)
        headerBuffer.writeUInt32LE(this.keyHash, 16)
        headerBuffer.write(this.key, SimpleFileHeader.SimpleFileHeaderSize, 'utf-8')

        // Test that the produced buffer is correct
        const { result: headerCheck } = SimpleFileHeader.read(headerBuffer)
        assert.deepEqual(headerCheck, this)
        
        return headerBuffer
    }
}

export function createSimpleFileFooter<T extends SerializableObject>(body: DeSerializableObject<T>) {
    @staticImplements<DeSerializableObject<SimpleFileFooter>>()
    class SimpleFileFooter implements SerializableObject {
        private static readonly FLAG_HAS_CRC32 = 1
        private static readonly FLAG_HAS_KEY_SHA256 = 2
        private static readonly CORRECT_MAGIC_NUMBER = 0xf4fa6f45970d41d8n
        // Size of explicit footer + 4 bytes for padding
        static SimpleFileFooterSize = 24
        
        constructor(
            // uint64_t
            public readonly footerMagicNumber: bigint,
            // uint32_t
            public readonly sha256: Buffer | null,
            // uint32_t
            public readonly bodyCrc32: number | null,
            // uint32_t
            public readonly bodySize: number,
            // String
            public readonly body: T
        ) {}

        static read(buffer: Buffer) {
            // Find magic number by iterating until it is found.
            let bufferIterator = 0
            while(bufferIterator < buffer.length - 8) {
                if(buffer.readBigUInt64LE(bufferIterator) == SimpleFileFooter.CORRECT_MAGIC_NUMBER) {
                    break;
                }
                bufferIterator++
            }
            if(bufferIterator == buffer.length - 8) {
                throw new Error("Attempted to read body for simple file footer but ran out of the buffer")
            }

            const footerMagicNumber = buffer.readBigUInt64LE(bufferIterator + 0)
            assert.equal(footerMagicNumber, SimpleFileFooter.CORRECT_MAGIC_NUMBER, "Received Invalid Header Magic Number")

            const footerFlags = buffer.readUInt32LE(bufferIterator + 8)
            let bodyCrc32 = null
            if(SimpleFileFooter.FLAG_HAS_CRC32 & footerFlags) {
                bodyCrc32 = buffer.readUInt32LE(bufferIterator + 12)
            }
            let sha256 = null
            if(footerFlags & SimpleFileFooter.FLAG_HAS_KEY_SHA256) {
                sha256 = buffer.slice(bufferIterator - 32, bufferIterator)
            }

            const bodySize = buffer.readUInt32LE(bufferIterator + 16)

            const bodyBuffer = buffer.slice(0, bodySize)
            if(bodyCrc32) {
                const calculatedCrc32 = crc32(bodyBuffer)
                assert.equal(calculatedCrc32, bodyCrc32, `Crc32 of body does not match expected. Expected: ${bodyCrc32}. Got: ${calculatedCrc32}`)
            }

            const {result: deserializedBody, leftover} = body.read(bodyBuffer)
            assert.equal(leftover.length, 0, "Body should consume entire stream")

            const footer = new SimpleFileFooter(footerMagicNumber, sha256, bodyCrc32, bodySize, deserializedBody)

            return {
                leftover: buffer.slice(SimpleFileFooter.SimpleFileFooterSize + bodySize + (sha256?.length ?? 0)),
                result: footer
            }
        }

        serialize(): Buffer {
            const serializedBody = this.body.serialize()
            const footerBuffer = Buffer.alloc(SimpleFileFooter.SimpleFileFooterSize, 0)
            assert.equal(this.footerMagicNumber, SimpleFileFooter.CORRECT_MAGIC_NUMBER)
            footerBuffer.writeBigUInt64LE(this.footerMagicNumber)
            // TODO: FIX THIS. It should be a bitwise operation
            const footerFlags = (this.bodyCrc32 ? SimpleFileFooter.FLAG_HAS_CRC32 : 0) + (this.sha256 ? SimpleFileFooter.FLAG_HAS_KEY_SHA256 : 0)
            footerBuffer.writeUInt32LE(footerFlags, 8)
            if(this.bodyCrc32) {
                const calculatedCrc32 = crc32(serializedBody)
                footerBuffer.writeUInt32LE(calculatedCrc32, 12)
            }
            footerBuffer.writeUInt32LE(serializedBody.length, 16)
            return this.sha256 ? Buffer.concat([serializedBody, this.sha256, footerBuffer]) : Buffer.concat([serializedBody, footerBuffer])
        }
    }

    return SimpleFileFooter
}
