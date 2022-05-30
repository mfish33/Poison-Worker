import { Level } from "level";
import { windows10YearsFromNow } from "src/utils";
import {
    ServiceWorkerNavigationPreloadState,
    ServiceWorkerOriginTrialInfo,
    ServiceWorkerRegistrationData,
    ServiceWorkerResourceRecord,
} from "./generated";

type IndexDbRecord<T> = { key: Buffer; value: T };

export interface RegistrationInfo {
    registration: IndexDbRecord<ServiceWorkerRegistrationData>;
    resourceRecords: IndexDbRecord<ServiceWorkerResourceRecord>[];
}

export class SwRegistrationHandler {
    private db: Level<Buffer, Buffer>;

    constructor(dbPath: string) {
        // TODO: See if the write buffer size if important or not
        this.db = new Level(dbPath, {
            keyEncoding: "binary",
            valueEncoding: "binary",
            writeBufferSize: 524288,
        });
    }

    async closeConnection() {
        this.db.close();
    }

    async addRegistration(url: URL): Promise<number> {
        const allEntries = await this.getLevelDbData();

        const nextRegistrationIdEntry = allEntries.find(
            (entry) => entry.key.toString() === "INITDATA_NEXT_REGISTRATION_ID",
        );
        if (!nextRegistrationIdEntry)
            throw new Error("Could not find INITDATA_NEXT_REGISTRATION_ID");
        const nextRegistrationId = Number(nextRegistrationIdEntry.value.toString());
        nextRegistrationIdEntry.value = Buffer.from((nextRegistrationId + 1).toString());

        const nextResourceIdEntry = allEntries.find(
            (entry) => entry.key.toString() === "INITDATA_NEXT_RESOURCE_ID",
        );
        if (!nextResourceIdEntry) throw new Error("Could not find INITDATA_NEXT_RESOURCE_ID");
        const nextResourceId = Number(nextResourceIdEntry.value.toString());
        nextResourceIdEntry.value = Buffer.from((nextResourceId + 1).toString());

        const nextVersionIdEntry = allEntries.find(
            (entry) => entry.key.toString() === "INITDATA_NEXT_VERSION_ID",
        );
        if (!nextVersionIdEntry) throw new Error("Could not find INITDATA_NEXT_VERSION_ID");
        const nextVersionId = Number(nextVersionIdEntry.value.toString());
        nextVersionIdEntry.value = Buffer.from((nextVersionId + 1).toString());

        const uniqueOriginEntry = {
            key: Buffer.from(`INITDATA_UNIQUE_ORIGIN:${url.origin}/`),
            value: Buffer.from(""),
        };

        const registrationData = new ServiceWorkerRegistrationData();
        registrationData.setRegistrationId(Number(nextRegistrationId));
        registrationData.setScopeUrl(`${url.origin}/`);
        registrationData.setScriptUrl(`${url.origin}/invalid.js`);
        registrationData.setVersionId(Number(nextVersionId));
        registrationData.setIsActive(true);
        registrationData.setHasFetchHandler(true);
        registrationData.setLastUpdateCheckTime(windows10YearsFromNow);
        // This number does not seem to be important
        registrationData.setResourcesTotalSizeBytes(55000);
        const originTrialTokens = new ServiceWorkerOriginTrialInfo();
        originTrialTokens.setFeaturesList([]);
        registrationData.setOriginTrialTokens(originTrialTokens);
        const navigationPreloadState = new ServiceWorkerNavigationPreloadState();
        navigationPreloadState.setEnabled(false);
        navigationPreloadState.setHeader("true");
        registrationData.setNavigationPreloadState(navigationPreloadState);
        // TODO: Investigate these values further
        registrationData.setUsedFeaturesList([
            15, 593, 780, 1067, 1075, 1076, 1441, 2236, 2238, 2663, 3266,
        ]);
        // Set as a classic service worker file
        registrationData.setScriptType(0);
        // TODO: Investigate these values further
        registrationData.setScriptResponseTime(13297128029669592);
        registrationData.setCrossOriginEmbedderPolicyValue(0);
        // No clue what this value does
        registrationData.setCrossOriginEmbedderPolicyReportOnlyValue(0);

        console.log("Created Registration Object:\n", registrationData.toObject());

        const registrationEntry = {
            key: Buffer.concat([
                Buffer.from(`REG:${url.origin}/`),
                Buffer.from([0]),
                Buffer.from(`${nextRegistrationId}`),
            ]),
            value: Buffer.from(registrationData.serializeBinary()),
        };

        const resourceData = new ServiceWorkerResourceRecord();
        resourceData.setResourceId(Number(nextResourceId));
        resourceData.setUrl(`${url.origin}/invalid.js`);
        // The size does not seem to matter to functionality
        resourceData.setSizeBytes(55000);

        console.log("Created Resource Object:\n", resourceData.toObject());

        const resourceEntry = {
            key: Buffer.concat([
                Buffer.from(`RES:${nextVersionId}`),
                Buffer.from([0]),
                Buffer.from(`${nextResourceId}`),
            ]),
            value: Buffer.from(resourceData.serializeBinary()),
        };

        const batchArgument = [
            nextRegistrationIdEntry,
            nextResourceIdEntry,
            nextVersionIdEntry,
            uniqueOriginEntry,
            registrationEntry,
            resourceEntry,
        ].map(({ key, value: deserializedValue }) => ({
            type: "put" as const,
            key,
            value: Buffer.from(deserializedValue),
        }));

        await this.db.batch(batchArgument);

        return nextResourceId;
    }

    private async getLevelDbData(): Promise<IndexDbRecord<Buffer>[]> {
        const data = [];
        for await (const [key, value] of this.db.iterator()) {
            data.push({ key, value });
        }

        return data;
    }

    async getRegistrations(url: URL): Promise<RegistrationInfo[]> {
        const allEntries = await this.getLevelDbData();
        return allEntries
            .filter(({ key }) => key.toString().startsWith(`REG:${url.origin}`))
            .map(({ key: regKey, value: regBuffer }) => {
                const registration = ServiceWorkerRegistrationData.deserializeBinary(regBuffer);
                const resourceRecords = allEntries
                    .filter(({ key }) =>
                        key.toString().startsWith(`RES:${registration.getVersionId()}`),
                    )
                    .map(({ key, value }) => ({
                        key,
                        value: ServiceWorkerResourceRecord.deserializeBinary(value),
                    }));
                return {
                    registration: { key: regKey, value: registration },
                    resourceRecords,
                };
            });
    }

    async hasRegistration(url: URL): Promise<boolean> {
        return !!(await this.getRegistrations(url)).length;
    }

    async saveRegistrationEntries(
        ...entries: IndexDbRecord<ServiceWorkerRegistrationData | ServiceWorkerResourceRecord>[]
    ) {
        const batchArgument = entries.map(({ key, value: deserializedValue }) => ({
            type: "put" as const,
            key,
            value: Buffer.from(deserializedValue.serializeBinary()),
        }));

        await this.db.batch(batchArgument);
    }

    async printAllKeys() {
        const allEntries = await this.getLevelDbData();
        for (const entry of allEntries) {
            console.log(entry.key.toString());
        }
    }
}
