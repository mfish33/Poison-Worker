"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickleWriter = exports.PickleReader = void 0;
class PickleReader {
    constructor(internalBuffer) {
        this.internalBuffer = internalBuffer;
        this.pointer = 0;
    }
    static new(buffer) {
        const pickleSize = buffer.readUInt32LE(0);
        const pickleBody = buffer.slice(4, pickleSize + 4);
        const pickle = new PickleReader(pickleBody);
        return { leftover: buffer.slice(pickleSize + 4), pickle };
    }
    readBool() {
        const value = this.internalBuffer.readUint8(this.pointer);
        this.advance(1);
        return !!value;
    }
    readUInt16() {
        const value = this.internalBuffer.readUint16LE(this.pointer);
        this.advance(2);
        return value;
    }
    readInt() {
        const value = this.internalBuffer.readInt32LE(this.pointer);
        this.advance(4);
        return value;
    }
    readUInt32() {
        const value = this.internalBuffer.readUInt32LE(this.pointer);
        this.advance(4);
        return value;
    }
    readInt64() {
        const value = this.internalBuffer.readBigInt64LE(this.pointer);
        this.advance(8);
        return value;
    }
    readUInt64() {
        const value = this.internalBuffer.readBigUInt64LE(this.pointer);
        this.advance(8);
        return value;
    }
    readFloat() {
        const value = this.internalBuffer.readFloatLE(this.pointer);
        this.advance(4);
        return value;
    }
    readDouble() {
        const value = this.internalBuffer.readDoubleLE(this.pointer);
        this.advance(8);
        return value;
    }
    readString() {
        return this.readData().toString();
    }
    readData() {
        const bufferLength = this.readInt();
        const buffer = this.internalBuffer.slice(this.pointer, this.pointer + bufferLength);
        this.advance(bufferLength);
        return buffer;
    }
    advance(size) {
        const ALIGNMENT = 4;
        this.pointer += (size + ALIGNMENT - 1) & ~(ALIGNMENT - 1);
    }
}
exports.PickleReader = PickleReader;
class PickleWriter {
    constructor() {
        this.pointer = 0;
        this.internalBuffer = Buffer.alloc(100);
    }
    writeBoolean(bool) {
        this.modify(1, () => this.internalBuffer.writeUint8(Number(bool), this.pointer));
    }
    writeUInt16(num) {
        this.modify(2, () => this.internalBuffer.writeUint16LE(num, this.pointer));
    }
    writeInt(num) {
        this.modify(4, () => this.internalBuffer.writeInt32LE(num, this.pointer));
    }
    writeUInt32(num) {
        this.modify(4, () => this.internalBuffer.writeUint32LE(num, this.pointer));
    }
    writeInt64(num) {
        this.modify(8, () => this.internalBuffer.writeBigInt64LE(num, this.pointer));
    }
    writeUInt64(num) {
        this.modify(8, () => this.internalBuffer.writeBigUInt64LE(num, this.pointer));
    }
    writeFloat(num) {
        this.modify(4, () => this.internalBuffer.writeFloatLE(num, this.pointer));
    }
    writeDouble(num) {
        this.modify(8, () => this.internalBuffer.writeDoubleLE(num, this.pointer));
    }
    writeString(str) {
        return this.writeData(Buffer.from(str));
    }
    writeData(buf) {
        this.writeInt(buf.length);
        this.modify(buf.length, () => buf.copy(this.internalBuffer, this.pointer));
    }
    getBuffer() {
        const out = Buffer.alloc(this.pointer);
        this.internalBuffer.copy(out, 0, 0, this.pointer);
        return out;
    }
    modify(size, modifyCallback) {
        if (this.pointer + size > this.internalBuffer.length) {
            const newBuffer = Buffer.alloc(this.internalBuffer.length * 2);
            this.internalBuffer.copy(newBuffer);
        }
        modifyCallback();
        const ALIGNMENT = 4;
        this.pointer += (size + ALIGNMENT - 1) & ~(ALIGNMENT - 1);
    }
}
exports.PickleWriter = PickleWriter;
