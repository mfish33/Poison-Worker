// package: storage
// file: src/generated/service_worker_database.proto

import * as jspb from "google-protobuf";

export class ServiceWorkerOriginTrialFeature extends jspb.Message {
  hasName(): boolean;
  clearName(): void;
  getName(): string | undefined;
  setName(value: string): void;

  clearTokensList(): void;
  getTokensList(): Array<string>;
  setTokensList(value: Array<string>): void;
  addTokens(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceWorkerOriginTrialFeature.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceWorkerOriginTrialFeature): ServiceWorkerOriginTrialFeature.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceWorkerOriginTrialFeature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceWorkerOriginTrialFeature;
  static deserializeBinaryFromReader(message: ServiceWorkerOriginTrialFeature, reader: jspb.BinaryReader): ServiceWorkerOriginTrialFeature;
}

export namespace ServiceWorkerOriginTrialFeature {
  export type AsObject = {
    name?: string,
    tokensList: Array<string>,
  }
}

export class ServiceWorkerOriginTrialInfo extends jspb.Message {
  clearFeaturesList(): void;
  getFeaturesList(): Array<ServiceWorkerOriginTrialFeature>;
  setFeaturesList(value: Array<ServiceWorkerOriginTrialFeature>): void;
  addFeatures(value?: ServiceWorkerOriginTrialFeature, index?: number): ServiceWorkerOriginTrialFeature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceWorkerOriginTrialInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceWorkerOriginTrialInfo): ServiceWorkerOriginTrialInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceWorkerOriginTrialInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceWorkerOriginTrialInfo;
  static deserializeBinaryFromReader(message: ServiceWorkerOriginTrialInfo, reader: jspb.BinaryReader): ServiceWorkerOriginTrialInfo;
}

export namespace ServiceWorkerOriginTrialInfo {
  export type AsObject = {
    featuresList: Array<ServiceWorkerOriginTrialFeature.AsObject>,
  }
}

export class ServiceWorkerNavigationPreloadState extends jspb.Message {
  hasEnabled(): boolean;
  clearEnabled(): void;
  getEnabled(): boolean | undefined;
  setEnabled(value: boolean): void;

  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): string | undefined;
  setHeader(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceWorkerNavigationPreloadState.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceWorkerNavigationPreloadState): ServiceWorkerNavigationPreloadState.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceWorkerNavigationPreloadState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceWorkerNavigationPreloadState;
  static deserializeBinaryFromReader(message: ServiceWorkerNavigationPreloadState, reader: jspb.BinaryReader): ServiceWorkerNavigationPreloadState;
}

export namespace ServiceWorkerNavigationPreloadState {
  export type AsObject = {
    enabled?: boolean,
    header?: string,
  }
}

export class ServiceWorkerRegistrationData extends jspb.Message {
  hasRegistrationId(): boolean;
  clearRegistrationId(): void;
  getRegistrationId(): number | undefined;
  setRegistrationId(value: number): void;

  hasScopeUrl(): boolean;
  clearScopeUrl(): void;
  getScopeUrl(): string | undefined;
  setScopeUrl(value: string): void;

  hasScriptUrl(): boolean;
  clearScriptUrl(): void;
  getScriptUrl(): string | undefined;
  setScriptUrl(value: string): void;

  hasVersionId(): boolean;
  clearVersionId(): void;
  getVersionId(): number | undefined;
  setVersionId(value: number): void;

  hasIsActive(): boolean;
  clearIsActive(): void;
  getIsActive(): boolean | undefined;
  setIsActive(value: boolean): void;

  hasHasFetchHandler(): boolean;
  clearHasFetchHandler(): void;
  getHasFetchHandler(): boolean | undefined;
  setHasFetchHandler(value: boolean): void;

  hasLastUpdateCheckTime(): boolean;
  clearLastUpdateCheckTime(): void;
  getLastUpdateCheckTime(): number | undefined;
  setLastUpdateCheckTime(value: number): void;

  hasResourcesTotalSizeBytes(): boolean;
  clearResourcesTotalSizeBytes(): void;
  getResourcesTotalSizeBytes(): number | undefined;
  setResourcesTotalSizeBytes(value: number): void;

  hasOriginTrialTokens(): boolean;
  clearOriginTrialTokens(): void;
  getOriginTrialTokens(): ServiceWorkerOriginTrialInfo | undefined;
  setOriginTrialTokens(value?: ServiceWorkerOriginTrialInfo): void;

  hasNavigationPreloadState(): boolean;
  clearNavigationPreloadState(): void;
  getNavigationPreloadState(): ServiceWorkerNavigationPreloadState | undefined;
  setNavigationPreloadState(value?: ServiceWorkerNavigationPreloadState): void;

  clearUsedFeaturesList(): void;
  getUsedFeaturesList(): Array<number>;
  setUsedFeaturesList(value: Array<number>): void;
  addUsedFeatures(value: number, index?: number): number;

  hasUpdateViaCache(): boolean;
  clearUpdateViaCache(): void;
  getUpdateViaCache(): ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap] | undefined;
  setUpdateViaCache(value: ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap]): void;

  hasScriptType(): boolean;
  clearScriptType(): void;
  getScriptType(): ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap] | undefined;
  setScriptType(value: ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap]): void;

  hasScriptResponseTime(): boolean;
  clearScriptResponseTime(): void;
  getScriptResponseTime(): number | undefined;
  setScriptResponseTime(value: number): void;

  hasCrossOriginEmbedderPolicyValue(): boolean;
  clearCrossOriginEmbedderPolicyValue(): void;
  getCrossOriginEmbedderPolicyValue(): ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap] | undefined;
  setCrossOriginEmbedderPolicyValue(value: ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap]): void;

  hasCrossOriginEmbedderPolicyReportingEndpoint(): boolean;
  clearCrossOriginEmbedderPolicyReportingEndpoint(): void;
  getCrossOriginEmbedderPolicyReportingEndpoint(): string | undefined;
  setCrossOriginEmbedderPolicyReportingEndpoint(value: string): void;

  hasCrossOriginEmbedderPolicyReportOnlyValue(): boolean;
  clearCrossOriginEmbedderPolicyReportOnlyValue(): void;
  getCrossOriginEmbedderPolicyReportOnlyValue(): ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap] | undefined;
  setCrossOriginEmbedderPolicyReportOnlyValue(value: ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap]): void;

  hasCrossOriginEmbedderPolicyReportOnlyReportingEndpoint(): boolean;
  clearCrossOriginEmbedderPolicyReportOnlyReportingEndpoint(): void;
  getCrossOriginEmbedderPolicyReportOnlyReportingEndpoint(): string | undefined;
  setCrossOriginEmbedderPolicyReportOnlyReportingEndpoint(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceWorkerRegistrationData.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceWorkerRegistrationData): ServiceWorkerRegistrationData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceWorkerRegistrationData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceWorkerRegistrationData;
  static deserializeBinaryFromReader(message: ServiceWorkerRegistrationData, reader: jspb.BinaryReader): ServiceWorkerRegistrationData;
}

export namespace ServiceWorkerRegistrationData {
  export type AsObject = {
    registrationId?: number,
    scopeUrl?: string,
    scriptUrl?: string,
    versionId?: number,
    isActive?: boolean,
    hasFetchHandler?: boolean,
    lastUpdateCheckTime?: number,
    resourcesTotalSizeBytes?: number,
    originTrialTokens?: ServiceWorkerOriginTrialInfo.AsObject,
    navigationPreloadState?: ServiceWorkerNavigationPreloadState.AsObject,
    usedFeaturesList: Array<number>,
    updateViaCache?: ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheTypeMap],
    scriptType?: ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap[keyof ServiceWorkerRegistrationData.ServiceWorkerScriptTypeMap],
    scriptResponseTime?: number,
    crossOriginEmbedderPolicyValue?: ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap],
    crossOriginEmbedderPolicyReportingEndpoint?: string,
    crossOriginEmbedderPolicyReportOnlyValue?: ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap[keyof ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValueMap],
    crossOriginEmbedderPolicyReportOnlyReportingEndpoint?: string,
  }

  export interface ServiceWorkerScriptTypeMap {
    CLASSIC: 0;
    MODULE: 1;
  }

  export const ServiceWorkerScriptType: ServiceWorkerScriptTypeMap;

  export interface ServiceWorkerUpdateViaCacheTypeMap {
    IMPORTS: 0;
    ALL: 1;
    NONE: 2;
  }

  export const ServiceWorkerUpdateViaCacheType: ServiceWorkerUpdateViaCacheTypeMap;

  export interface CrossOriginEmbedderPolicyValueMap {
    NONE_OR_NOT_EXIST: 0;
    REQUIRE_CORP: 1;
    CREDENTIALLESS: 2;
  }

  export const CrossOriginEmbedderPolicyValue: CrossOriginEmbedderPolicyValueMap;
}

export class ServiceWorkerResourceRecord extends jspb.Message {
  hasResourceId(): boolean;
  clearResourceId(): void;
  getResourceId(): number | undefined;
  setResourceId(value: number): void;

  hasUrl(): boolean;
  clearUrl(): void;
  getUrl(): string | undefined;
  setUrl(value: string): void;

  hasSizeBytes(): boolean;
  clearSizeBytes(): void;
  getSizeBytes(): number | undefined;
  setSizeBytes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceWorkerResourceRecord.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceWorkerResourceRecord): ServiceWorkerResourceRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceWorkerResourceRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceWorkerResourceRecord;
  static deserializeBinaryFromReader(message: ServiceWorkerResourceRecord, reader: jspb.BinaryReader): ServiceWorkerResourceRecord;
}

export namespace ServiceWorkerResourceRecord {
  export type AsObject = {
    resourceId?: number,
    url?: string,
    sizeBytes?: number,
  }
}

