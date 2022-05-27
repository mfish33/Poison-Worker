import * as CRC32 from "crc-32"

export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}

export interface Constructs<T> {
    new (...args: any[]): T
}

/**
 * Unsigned integer crc32
 */
export function crc32(buffer: Buffer) {
    const signedCrc32 = CRC32.buf(buffer)
    return (new Uint32Array([signedCrc32]))[0]
}

const windowsTimeOffset = 11644473600000000
const tenYearsMicroseconds = 3.154e+14
const currentMicroSeconds = Date.now() * 1000
export const windows10YearsFromNow = windowsTimeOffset + tenYearsMicroseconds + currentMicroSeconds