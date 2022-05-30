export class PickleReader {
    private pointer = 0;

    private constructor(private internalBuffer: Buffer) {}

    static new(buffer: Buffer) {
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

    readUInt16(): number {
        const value = this.internalBuffer.readUint16LE(this.pointer);
        // advance 4 bytes to round to proper alignment
        this.advance(2);
        return value;
    }

    readInt(): number {
        const value = this.internalBuffer.readInt32LE(this.pointer);
        this.advance(4);
        return value;
    }

    readUInt32(): number {
        const value = this.internalBuffer.readUInt32LE(this.pointer);
        this.advance(4);
        return value;
    }

    readInt64(): bigint {
        const value = this.internalBuffer.readBigInt64LE(this.pointer);
        this.advance(8);
        return value;
    }

    readUInt64(): bigint {
        const value = this.internalBuffer.readBigUInt64LE(this.pointer);
        this.advance(8);
        return value;
    }

    readFloat(): number {
        const value = this.internalBuffer.readFloatLE(this.pointer);
        this.advance(4);
        return value;
    }

    readDouble(): number {
        const value = this.internalBuffer.readDoubleLE(this.pointer);
        this.advance(8);
        return value;
    }

    readString(): string {
        return this.readData().toString();
    }

    readData(): Buffer {
        const bufferLength = this.readInt();
        const buffer = this.internalBuffer.slice(this.pointer, this.pointer + bufferLength);
        this.advance(bufferLength);
        return buffer;
    }

    private advance(size: number) {
        const ALIGNMENT = 4;
        // aligns on a single int
        this.pointer += (size + ALIGNMENT - 1) & ~(ALIGNMENT - 1);
    }
}

export class PickleWriter {
    private pointer = 0;

    private internalBuffer: Buffer = Buffer.alloc(100);

    writeBoolean(bool: boolean) {
        this.modify(1, () => this.internalBuffer.writeUint8(Number(bool), this.pointer));
    }

    writeUInt16(num: number) {
        this.modify(2, () => this.internalBuffer.writeUint16LE(num, this.pointer));
    }

    writeInt(num: number) {
        this.modify(4, () => this.internalBuffer.writeInt32LE(num, this.pointer));
    }

    writeUInt32(num: number) {
        this.modify(4, () => this.internalBuffer.writeUint32LE(num, this.pointer));
    }

    writeInt64(num: bigint) {
        this.modify(8, () => this.internalBuffer.writeBigInt64LE(num, this.pointer));
    }

    writeUInt64(num: bigint) {
        this.modify(8, () => this.internalBuffer.writeBigUInt64LE(num, this.pointer));
    }

    writeFloat(num: number) {
        this.modify(4, () => this.internalBuffer.writeFloatLE(num, this.pointer));
    }

    writeDouble(num: number) {
        this.modify(8, () => this.internalBuffer.writeDoubleLE(num, this.pointer));
    }

    writeString(str: string) {
        return this.writeData(Buffer.from(str));
    }

    writeData(buf: Buffer) {
        this.writeInt(buf.length);
        this.modify(buf.length, () => buf.copy(this.internalBuffer, this.pointer));
    }

    getBuffer(): Buffer {
        const out = Buffer.alloc(this.pointer);
        this.internalBuffer.copy(out, 0, 0, this.pointer);
        return out;
    }

    private modify(size: number, modifyCallback: () => void) {
        if (this.pointer + size > this.internalBuffer.length) {
            const newBuffer = Buffer.alloc(this.internalBuffer.length * 2);
            this.internalBuffer.copy(newBuffer);
        }

        modifyCallback();

        const ALIGNMENT = 4;
        // aligns on a single int
        this.pointer += (size + ALIGNMENT - 1) & ~(ALIGNMENT - 1);
    }
}
