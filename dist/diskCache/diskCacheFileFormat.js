"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SimpleFileHeader_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimpleFileFooter = exports.SimpleFileHeader = void 0;
const utils_1 = require("../utils");
const assert = require("assert");
const SIMPLE_DISK_CACHE_VERSION = 5;
let SimpleFileHeader = SimpleFileHeader_1 = class SimpleFileHeader {
    constructor(headerMagicNumber, version, keyLength, keyHash, key) {
        this.headerMagicNumber = headerMagicNumber;
        this.version = version;
        this.keyLength = keyLength;
        this.keyHash = keyHash;
        this.key = key;
    }
    static read(buffer) {
        const headerMagicNumber = buffer.readBigUInt64LE(0);
        assert.equal(headerMagicNumber, SimpleFileHeader_1.CORRECT_MAGIC_NUMBER, "Received Invalid Header Magic Number");
        const version = buffer.readUInt32LE(8);
        assert.equal(version, SIMPLE_DISK_CACHE_VERSION, "Opened disk cache file with unexpected version");
        const keyLength = buffer.readUInt32LE(12);
        const keyHash = buffer.readUInt32LE(16);
        const key = buffer.slice(SimpleFileHeader_1.SimpleFileHeaderSize, SimpleFileHeader_1.SimpleFileHeaderSize + keyLength).toString();
        const header = new SimpleFileHeader_1(headerMagicNumber, version, keyLength, keyHash, key);
        return {
            leftover: buffer.slice(SimpleFileHeader_1.SimpleFileHeaderSize + keyLength),
            result: header
        };
    }
    serialize() {
        const headerBuffer = Buffer.alloc(SimpleFileHeader_1.SimpleFileHeaderSize + this.keyLength, 0);
        headerBuffer.writeBigUInt64LE(this.headerMagicNumber, 0);
        headerBuffer.writeUInt32LE(this.version, 8);
        headerBuffer.writeUInt32LE(this.keyLength, 12);
        headerBuffer.writeUInt32LE(this.keyHash, 16);
        headerBuffer.write(this.key, SimpleFileHeader_1.SimpleFileHeaderSize, 'utf-8');
        const { result: headerCheck } = SimpleFileHeader_1.read(headerBuffer);
        assert.deepEqual(headerCheck, this);
        return headerBuffer;
    }
};
SimpleFileHeader.CORRECT_MAGIC_NUMBER = 0xfcfb6d1ba7725c30n;
SimpleFileHeader.SimpleFileHeaderSize = 24;
SimpleFileHeader = SimpleFileHeader_1 = __decorate([
    (0, utils_1.staticImplements)()
], SimpleFileHeader);
exports.SimpleFileHeader = SimpleFileHeader;
function createSimpleFileFooter(body) {
    var SimpleFileFooter_1;
    let SimpleFileFooter = SimpleFileFooter_1 = class SimpleFileFooter {
        constructor(footerMagicNumber, sha256, bodyCrc32, bodySize, body) {
            this.footerMagicNumber = footerMagicNumber;
            this.sha256 = sha256;
            this.bodyCrc32 = bodyCrc32;
            this.bodySize = bodySize;
            this.body = body;
        }
        static read(buffer) {
            let bufferIterator = 0;
            while (bufferIterator < buffer.length - 8) {
                if (buffer.readBigUInt64LE(bufferIterator) == SimpleFileFooter_1.CORRECT_MAGIC_NUMBER) {
                    break;
                }
                bufferIterator++;
            }
            if (bufferIterator == buffer.length - 8) {
                throw new Error("Attempted to read body for simple file footer but ran out of the buffer");
            }
            const footerMagicNumber = buffer.readBigUInt64LE(bufferIterator + 0);
            assert.equal(footerMagicNumber, SimpleFileFooter_1.CORRECT_MAGIC_NUMBER, "Received Invalid Header Magic Number");
            const footerFlags = buffer.readUInt32LE(bufferIterator + 8);
            let bodyCrc32 = null;
            if (SimpleFileFooter_1.FLAG_HAS_CRC32 & footerFlags) {
                bodyCrc32 = buffer.readUInt32LE(bufferIterator + 12);
            }
            let sha256 = null;
            if (footerFlags & SimpleFileFooter_1.FLAG_HAS_KEY_SHA256) {
                sha256 = buffer.slice(bufferIterator - 32, bufferIterator);
            }
            const bodySize = buffer.readUInt32LE(bufferIterator + 16);
            const bodyBuffer = buffer.slice(0, bodySize);
            if (bodyCrc32) {
                const calculatedCrc32 = (0, utils_1.crc32)(bodyBuffer);
                assert.equal(calculatedCrc32, bodyCrc32, `Crc32 of body does not match expected. Expected: ${bodyCrc32}. Got: ${calculatedCrc32}`);
            }
            const { result: deserializedBody, leftover } = body.read(bodyBuffer);
            assert.equal(leftover.length, 0, "Body should consume entire stream");
            const footer = new SimpleFileFooter_1(footerMagicNumber, sha256, bodyCrc32, bodySize, deserializedBody);
            return {
                leftover: buffer.slice(SimpleFileFooter_1.SimpleFileFooterSize + bodySize + (sha256?.length ?? 0)),
                result: footer
            };
        }
        serialize() {
            const serializedBody = this.body.serialize();
            const footerBuffer = Buffer.alloc(SimpleFileFooter_1.SimpleFileFooterSize, 0);
            assert.equal(this.footerMagicNumber, SimpleFileFooter_1.CORRECT_MAGIC_NUMBER);
            footerBuffer.writeBigUInt64LE(this.footerMagicNumber);
            const footerFlags = (this.bodyCrc32 ? SimpleFileFooter_1.FLAG_HAS_CRC32 : 0) + (this.sha256 ? SimpleFileFooter_1.FLAG_HAS_KEY_SHA256 : 0);
            footerBuffer.writeUInt32LE(footerFlags, 8);
            if (this.bodyCrc32) {
                const calculatedCrc32 = (0, utils_1.crc32)(serializedBody);
                footerBuffer.writeUInt32LE(calculatedCrc32, 12);
            }
            footerBuffer.writeUInt32LE(serializedBody.length, 16);
            return this.sha256 ? Buffer.concat([serializedBody, this.sha256, footerBuffer]) : Buffer.concat([serializedBody, footerBuffer]);
        }
    };
    SimpleFileFooter.FLAG_HAS_CRC32 = 1;
    SimpleFileFooter.FLAG_HAS_KEY_SHA256 = 2;
    SimpleFileFooter.CORRECT_MAGIC_NUMBER = 0xf4fa6f45970d41d8n;
    SimpleFileFooter.SimpleFileFooterSize = 24;
    SimpleFileFooter = SimpleFileFooter_1 = __decorate([
        (0, utils_1.staticImplements)()
    ], SimpleFileFooter);
    return SimpleFileFooter;
}
exports.createSimpleFileFooter = createSimpleFileFooter;
