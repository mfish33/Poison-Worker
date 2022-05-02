"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRegistrationEntries = exports.getRegistrations = exports.addRegistration = exports.setDbPath = exports.getDbPath = void 0;
const level_1 = require("level");
const generated_1 = require("./generated");
let _dbPath;
function getDbPath() {
    if (!_dbPath) {
        throw new Error("Please set a file base in order to use leveldb");
    }
    return _dbPath;
}
exports.getDbPath = getDbPath;
function setDbPath(fileBase) {
    _dbPath = fileBase;
}
exports.setDbPath = setDbPath;
let _db;
function getDb() {
    if (!_db) {
        _db = new level_1.Level(getDbPath(), { keyEncoding: "binary", valueEncoding: "binary", writeBufferSize: 524288 });
    }
    return _db;
}
function addRegistration(url) {
    throw new Error("TODO");
}
exports.addRegistration = addRegistration;
async function getLevelDbData() {
    const db = getDb();
    const data = [];
    for await (const [key, value] of db.iterator()) {
        data.push({ key, value });
    }
    return data;
}
async function getRegistrations(url) {
    const allEntries = await getLevelDbData();
    return allEntries
        .filter(({ key }) => key.toString().startsWith(`REG:${url}`))
        .map(({ key: regKey, value: regBuffer }) => {
        const registration = generated_1.ServiceWorkerRegistrationData.deserializeBinary(regBuffer);
        const resourceRecords = allEntries
            .filter(({ key }) => key.toString().startsWith(`RES:${registration.getVersionId()}`))
            .map(({ key, value }) => ({ key, value: generated_1.ServiceWorkerResourceRecord.deserializeBinary(value) }));
        return {
            registration: { key: regKey, value: registration },
            resourceRecords
        };
    });
}
exports.getRegistrations = getRegistrations;
async function saveRegistrationEntries(...entries) {
    const db = getDb();
    const batchArgument = entries.map(({ key, value: deserializedValue }) => {
        return { type: "put", key, value: Buffer.from(deserializedValue.serializeBinary()) };
    });
    await db.batch(batchArgument);
}
exports.saveRegistrationEntries = saveRegistrationEntries;
