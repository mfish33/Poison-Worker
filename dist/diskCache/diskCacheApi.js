"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StringBody_1, BinaryBody_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.get = exports.setFileBase = exports.getFileBase = exports.Streams = void 0;
const fs = require("fs/promises");
const utils_1 = require("../utils");
const crypto = require("crypto");
const diskCacheFileFormat_1 = require("./diskCacheFileFormat");
let StringBody = StringBody_1 = class StringBody {
    constructor(value) {
        this.value = value;
    }
    static read(buffer) {
        return {
            result: new StringBody_1(buffer.toString()),
            leftover: Buffer.alloc(0)
        };
    }
    serialize() {
        return Buffer.from(this.value);
    }
};
StringBody = StringBody_1 = __decorate([
    (0, utils_1.staticImplements)()
], StringBody);
let BinaryBody = BinaryBody_1 = class BinaryBody {
    constructor(value) {
        this.value = value;
    }
    static read(buffer) {
        return {
            result: new BinaryBody_1(buffer),
            leftover: Buffer.alloc(0)
        };
    }
    serialize() {
        return this.value;
    }
};
BinaryBody = BinaryBody_1 = __decorate([
    (0, utils_1.staticImplements)()
], BinaryBody);
function createFileOneReader(body) {
    var File1Reader_1;
    let File1Reader = File1Reader_1 = class File1Reader {
        constructor(header, footer) {
            this.header = header;
            this.footer = footer;
        }
        static read(buffer) {
            const { result: header, leftover: leftoverAfterHeader } = diskCacheFileFormat_1.SimpleFileHeader.read(buffer);
            const { result: footer, leftover: leftoverAfterFooter } = (0, diskCacheFileFormat_1.createSimpleFileFooter)(body).read(leftoverAfterHeader);
            return {
                result: new File1Reader_1(header, footer),
                leftover: leftoverAfterFooter
            };
        }
        serialize() {
            return Buffer.concat([this.header.serialize(), this.footer.serialize()]);
        }
    };
    File1Reader = File1Reader_1 = __decorate([
        (0, utils_1.staticImplements)()
    ], File1Reader);
    return File1Reader;
}
function createFileZeroReader(body1, body2) {
    var File0Reader_1;
    let File0Reader = File0Reader_1 = class File0Reader {
        constructor(header, footer1, footer2) {
            this.header = header;
            this.footer1 = footer1;
            this.footer2 = footer2;
        }
        static read(buffer) {
            const { result: header, leftover: leftoverAfterHeader } = diskCacheFileFormat_1.SimpleFileHeader.read(buffer);
            const { result: footer1, leftover: leftoverAfterFooter1 } = (0, diskCacheFileFormat_1.createSimpleFileFooter)(body1).read(leftoverAfterHeader);
            const { result: footer2, leftover: leftoverAfterFooter2 } = (0, diskCacheFileFormat_1.createSimpleFileFooter)(body2).read(leftoverAfterFooter1);
            return {
                result: new File0Reader_1(header, footer1, footer2),
                leftover: leftoverAfterFooter2
            };
        }
        serialize() {
            return Buffer.concat([this.header.serialize(), this.footer1.serialize(), this.footer2.serialize()]);
        }
    };
    File0Reader = File0Reader_1 = __decorate([
        (0, utils_1.staticImplements)()
    ], File0Reader);
    return File0Reader;
}
var Streams;
(function (Streams) {
    Streams[Streams["ServiceWorkerScriptContent"] = 0] = "ServiceWorkerScriptContent";
    Streams[Streams["ServiceWorkerRequestInfo"] = 1] = "ServiceWorkerRequestInfo";
    Streams[Streams["ServiceWorkerMetadata"] = 2] = "ServiceWorkerMetadata";
})(Streams = exports.Streams || (exports.Streams = {}));
function getFileName(key, stream) {
    const sha1Buffer = crypto.createHash("sha1").update(key).digest();
    const hashKey = sha1Buffer.readBigUint64LE(0);
    const fileBase = hashKey.toString(16).padStart(16, "0");
    return `${fileBase}_${stream == 2 ? 1 : 0}`;
}
let _fileBase;
function getFileBase() {
    if (!_fileBase) {
        throw new Error("Please set a file base in order to use disk cache");
    }
    return _fileBase;
}
exports.getFileBase = getFileBase;
function setFileBase(fileBase) {
    _fileBase = fileBase;
}
exports.setFileBase = setFileBase;
async function get(key, stream) {
    const fileName = getFileName(key, stream);
    console.log(`Opening disk cache file: ${fileName}`);
    const fileBase = getFileBase();
    const fileContents = await fs.readFile(`${fileBase}/${fileName}`);
    const saveFile = async (buffer) => {
        await fs.writeFile(`${fileBase}/${fileName}`, buffer);
    };
    switch (stream) {
        case Streams.ServiceWorkerScriptContent: {
            const fileHandle = createFileZeroReader(StringBody, BinaryBody).read(fileContents).result;
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer1.body
            };
        }
        case Streams.ServiceWorkerRequestInfo: {
            const fileHandle = createFileZeroReader(StringBody, BinaryBody).read(fileContents).result;
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer2.body
            };
        }
        case Streams.ServiceWorkerMetadata: {
            const fileHandle = createFileOneReader(BinaryBody).read(fileContents).result;
            return {
                save: () => saveFile(fileHandle.serialize()),
                body: fileHandle.footer.body
            };
        }
    }
    throw new Error("This code should be unreachable. In: `diskCacheGet`");
}
exports.get = get;
async function remove(key, stream) {
    const fileName = getFileName(key, stream);
    const fileBase = getFileBase();
    await fs.rm(`${fileBase}/${fileName}`);
}
exports.remove = remove;
