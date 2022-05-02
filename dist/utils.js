"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc32 = exports.staticImplements = void 0;
const CRC32 = require("crc-32");
function staticImplements() {
    return (constructor) => { constructor; };
}
exports.staticImplements = staticImplements;
function crc32(buffer) {
    const signedCrc32 = CRC32.buf(buffer);
    return (new Uint32Array([signedCrc32]))[0];
}
exports.crc32 = crc32;
