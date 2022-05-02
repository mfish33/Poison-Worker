"use strict";
var jspb = require('google-protobuf');
var goog = jspb;
var global = (function () { return this || global || Function('return this')(); }).call(null);
goog.exportSymbol('proto.storage.ServiceWorkerNavigationPreloadState', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerOriginTrialFeature', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerOriginTrialInfo', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerRegistrationData', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValue', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerRegistrationData.ServiceWorkerScriptType', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheType', null, global);
goog.exportSymbol('proto.storage.ServiceWorkerResourceRecord', null, global);
proto.storage.ServiceWorkerOriginTrialFeature = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.storage.ServiceWorkerOriginTrialFeature.repeatedFields_, null);
};
goog.inherits(proto.storage.ServiceWorkerOriginTrialFeature, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.storage.ServiceWorkerOriginTrialFeature.displayName = 'proto.storage.ServiceWorkerOriginTrialFeature';
}
proto.storage.ServiceWorkerOriginTrialInfo = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.storage.ServiceWorkerOriginTrialInfo.repeatedFields_, null);
};
goog.inherits(proto.storage.ServiceWorkerOriginTrialInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.storage.ServiceWorkerOriginTrialInfo.displayName = 'proto.storage.ServiceWorkerOriginTrialInfo';
}
proto.storage.ServiceWorkerNavigationPreloadState = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.storage.ServiceWorkerNavigationPreloadState, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.storage.ServiceWorkerNavigationPreloadState.displayName = 'proto.storage.ServiceWorkerNavigationPreloadState';
}
proto.storage.ServiceWorkerRegistrationData = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, proto.storage.ServiceWorkerRegistrationData.repeatedFields_, null);
};
goog.inherits(proto.storage.ServiceWorkerRegistrationData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.storage.ServiceWorkerRegistrationData.displayName = 'proto.storage.ServiceWorkerRegistrationData';
}
proto.storage.ServiceWorkerResourceRecord = function (opt_data) {
    jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.storage.ServiceWorkerResourceRecord, jspb.Message);
if (goog.DEBUG && !COMPILED) {
    proto.storage.ServiceWorkerResourceRecord.displayName = 'proto.storage.ServiceWorkerResourceRecord';
}
proto.storage.ServiceWorkerOriginTrialFeature.repeatedFields_ = [2];
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.storage.ServiceWorkerOriginTrialFeature.prototype.toObject = function (opt_includeInstance) {
        return proto.storage.ServiceWorkerOriginTrialFeature.toObject(opt_includeInstance, this);
    };
    proto.storage.ServiceWorkerOriginTrialFeature.toObject = function (includeInstance, msg) {
        var f, obj = {
            name: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
            tokensList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.storage.ServiceWorkerOriginTrialFeature.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.storage.ServiceWorkerOriginTrialFeature;
    return proto.storage.ServiceWorkerOriginTrialFeature.deserializeBinaryFromReader(msg, reader);
};
proto.storage.ServiceWorkerOriginTrialFeature.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readString());
                msg.setName(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.addTokens(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.storage.ServiceWorkerOriginTrialFeature.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.storage.ServiceWorkerOriginTrialFeature.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = (jspb.Message.getField(message, 1));
    if (f != null) {
        writer.writeString(1, f);
    }
    f = message.getTokensList();
    if (f.length > 0) {
        writer.writeRepeatedString(2, f);
    }
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.getName = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, ""));
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.setName = function (value) {
    return jspb.Message.setField(this, 1, value);
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.clearName = function () {
    return jspb.Message.setField(this, 1, undefined);
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.hasName = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.getTokensList = function () {
    return (jspb.Message.getRepeatedField(this, 2));
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.setTokensList = function (value) {
    return jspb.Message.setField(this, 2, value || []);
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.addTokens = function (value, opt_index) {
    return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};
proto.storage.ServiceWorkerOriginTrialFeature.prototype.clearTokensList = function () {
    return this.setTokensList([]);
};
proto.storage.ServiceWorkerOriginTrialInfo.repeatedFields_ = [1];
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.storage.ServiceWorkerOriginTrialInfo.prototype.toObject = function (opt_includeInstance) {
        return proto.storage.ServiceWorkerOriginTrialInfo.toObject(opt_includeInstance, this);
    };
    proto.storage.ServiceWorkerOriginTrialInfo.toObject = function (includeInstance, msg) {
        var f, obj = {
            featuresList: jspb.Message.toObjectList(msg.getFeaturesList(), proto.storage.ServiceWorkerOriginTrialFeature.toObject, includeInstance)
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.storage.ServiceWorkerOriginTrialInfo.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.storage.ServiceWorkerOriginTrialInfo;
    return proto.storage.ServiceWorkerOriginTrialInfo.deserializeBinaryFromReader(msg, reader);
};
proto.storage.ServiceWorkerOriginTrialInfo.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = new proto.storage.ServiceWorkerOriginTrialFeature;
                reader.readMessage(value, proto.storage.ServiceWorkerOriginTrialFeature.deserializeBinaryFromReader);
                msg.addFeatures(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.storage.ServiceWorkerOriginTrialInfo.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.storage.ServiceWorkerOriginTrialInfo.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.storage.ServiceWorkerOriginTrialInfo.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = message.getFeaturesList();
    if (f.length > 0) {
        writer.writeRepeatedMessage(1, f, proto.storage.ServiceWorkerOriginTrialFeature.serializeBinaryToWriter);
    }
};
proto.storage.ServiceWorkerOriginTrialInfo.prototype.getFeaturesList = function () {
    return (jspb.Message.getRepeatedWrapperField(this, proto.storage.ServiceWorkerOriginTrialFeature, 1));
};
proto.storage.ServiceWorkerOriginTrialInfo.prototype.setFeaturesList = function (value) {
    return jspb.Message.setRepeatedWrapperField(this, 1, value);
};
proto.storage.ServiceWorkerOriginTrialInfo.prototype.addFeatures = function (opt_value, opt_index) {
    return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.storage.ServiceWorkerOriginTrialFeature, opt_index);
};
proto.storage.ServiceWorkerOriginTrialInfo.prototype.clearFeaturesList = function () {
    return this.setFeaturesList([]);
};
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.storage.ServiceWorkerNavigationPreloadState.prototype.toObject = function (opt_includeInstance) {
        return proto.storage.ServiceWorkerNavigationPreloadState.toObject(opt_includeInstance, this);
    };
    proto.storage.ServiceWorkerNavigationPreloadState.toObject = function (includeInstance, msg) {
        var f, obj = {
            enabled: (f = jspb.Message.getBooleanField(msg, 1)) == null ? undefined : f,
            header: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.storage.ServiceWorkerNavigationPreloadState.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.storage.ServiceWorkerNavigationPreloadState;
    return proto.storage.ServiceWorkerNavigationPreloadState.deserializeBinaryFromReader(msg, reader);
};
proto.storage.ServiceWorkerNavigationPreloadState.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readBool());
                msg.setEnabled(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.setHeader(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.storage.ServiceWorkerNavigationPreloadState.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.storage.ServiceWorkerNavigationPreloadState.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = (jspb.Message.getField(message, 1));
    if (f != null) {
        writer.writeBool(1, f);
    }
    f = (jspb.Message.getField(message, 2));
    if (f != null) {
        writer.writeString(2, f);
    }
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.getEnabled = function () {
    return (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.setEnabled = function (value) {
    return jspb.Message.setField(this, 1, value);
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.clearEnabled = function () {
    return jspb.Message.setField(this, 1, undefined);
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.hasEnabled = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.getHeader = function () {
    return (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.setHeader = function (value) {
    return jspb.Message.setField(this, 2, value);
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.clearHeader = function () {
    return jspb.Message.setField(this, 2, undefined);
};
proto.storage.ServiceWorkerNavigationPreloadState.prototype.hasHeader = function () {
    return jspb.Message.getField(this, 2) != null;
};
proto.storage.ServiceWorkerRegistrationData.repeatedFields_ = [13];
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.storage.ServiceWorkerRegistrationData.prototype.toObject = function (opt_includeInstance) {
        return proto.storage.ServiceWorkerRegistrationData.toObject(opt_includeInstance, this);
    };
    proto.storage.ServiceWorkerRegistrationData.toObject = function (includeInstance, msg) {
        var f, obj = {
            registrationId: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
            scopeUrl: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
            scriptUrl: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
            versionId: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
            isActive: (f = jspb.Message.getBooleanField(msg, 5)) == null ? undefined : f,
            hasFetchHandler: (f = jspb.Message.getBooleanField(msg, 6)) == null ? undefined : f,
            lastUpdateCheckTime: (f = jspb.Message.getField(msg, 7)) == null ? undefined : f,
            resourcesTotalSizeBytes: (f = jspb.Message.getField(msg, 8)) == null ? undefined : f,
            originTrialTokens: (f = msg.getOriginTrialTokens()) && proto.storage.ServiceWorkerOriginTrialInfo.toObject(includeInstance, f),
            navigationPreloadState: (f = msg.getNavigationPreloadState()) && proto.storage.ServiceWorkerNavigationPreloadState.toObject(includeInstance, f),
            usedFeaturesList: (f = jspb.Message.getRepeatedField(msg, 13)) == null ? undefined : f,
            updateViaCache: jspb.Message.getFieldWithDefault(msg, 14, 0),
            scriptType: jspb.Message.getFieldWithDefault(msg, 15, 0),
            scriptResponseTime: (f = jspb.Message.getField(msg, 16)) == null ? undefined : f,
            crossOriginEmbedderPolicyValue: jspb.Message.getFieldWithDefault(msg, 17, 0),
            crossOriginEmbedderPolicyReportingEndpoint: (f = jspb.Message.getField(msg, 18)) == null ? undefined : f,
            crossOriginEmbedderPolicyReportOnlyValue: jspb.Message.getFieldWithDefault(msg, 19, 0),
            crossOriginEmbedderPolicyReportOnlyReportingEndpoint: (f = jspb.Message.getField(msg, 20)) == null ? undefined : f
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.storage.ServiceWorkerRegistrationData.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.storage.ServiceWorkerRegistrationData;
    return proto.storage.ServiceWorkerRegistrationData.deserializeBinaryFromReader(msg, reader);
};
proto.storage.ServiceWorkerRegistrationData.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readInt64());
                msg.setRegistrationId(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.setScopeUrl(value);
                break;
            case 3:
                var value = (reader.readString());
                msg.setScriptUrl(value);
                break;
            case 4:
                var value = (reader.readInt64());
                msg.setVersionId(value);
                break;
            case 5:
                var value = (reader.readBool());
                msg.setIsActive(value);
                break;
            case 6:
                var value = (reader.readBool());
                msg.setHasFetchHandler(value);
                break;
            case 7:
                var value = (reader.readInt64());
                msg.setLastUpdateCheckTime(value);
                break;
            case 8:
                var value = (reader.readUint64());
                msg.setResourcesTotalSizeBytes(value);
                break;
            case 11:
                var value = new proto.storage.ServiceWorkerOriginTrialInfo;
                reader.readMessage(value, proto.storage.ServiceWorkerOriginTrialInfo.deserializeBinaryFromReader);
                msg.setOriginTrialTokens(value);
                break;
            case 12:
                var value = new proto.storage.ServiceWorkerNavigationPreloadState;
                reader.readMessage(value, proto.storage.ServiceWorkerNavigationPreloadState.deserializeBinaryFromReader);
                msg.setNavigationPreloadState(value);
                break;
            case 13:
                var values = (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
                for (var i = 0; i < values.length; i++) {
                    msg.addUsedFeatures(values[i]);
                }
                break;
            case 14:
                var value = (reader.readEnum());
                msg.setUpdateViaCache(value);
                break;
            case 15:
                var value = (reader.readEnum());
                msg.setScriptType(value);
                break;
            case 16:
                var value = (reader.readInt64());
                msg.setScriptResponseTime(value);
                break;
            case 17:
                var value = (reader.readEnum());
                msg.setCrossOriginEmbedderPolicyValue(value);
                break;
            case 18:
                var value = (reader.readString());
                msg.setCrossOriginEmbedderPolicyReportingEndpoint(value);
                break;
            case 19:
                var value = (reader.readEnum());
                msg.setCrossOriginEmbedderPolicyReportOnlyValue(value);
                break;
            case 20:
                var value = (reader.readString());
                msg.setCrossOriginEmbedderPolicyReportOnlyReportingEndpoint(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.storage.ServiceWorkerRegistrationData.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.storage.ServiceWorkerRegistrationData.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.storage.ServiceWorkerRegistrationData.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = (jspb.Message.getField(message, 1));
    if (f != null) {
        writer.writeInt64(1, f);
    }
    f = (jspb.Message.getField(message, 2));
    if (f != null) {
        writer.writeString(2, f);
    }
    f = (jspb.Message.getField(message, 3));
    if (f != null) {
        writer.writeString(3, f);
    }
    f = (jspb.Message.getField(message, 4));
    if (f != null) {
        writer.writeInt64(4, f);
    }
    f = (jspb.Message.getField(message, 5));
    if (f != null) {
        writer.writeBool(5, f);
    }
    f = (jspb.Message.getField(message, 6));
    if (f != null) {
        writer.writeBool(6, f);
    }
    f = (jspb.Message.getField(message, 7));
    if (f != null) {
        writer.writeInt64(7, f);
    }
    f = (jspb.Message.getField(message, 8));
    if (f != null) {
        writer.writeUint64(8, f);
    }
    f = message.getOriginTrialTokens();
    if (f != null) {
        writer.writeMessage(11, f, proto.storage.ServiceWorkerOriginTrialInfo.serializeBinaryToWriter);
    }
    f = message.getNavigationPreloadState();
    if (f != null) {
        writer.writeMessage(12, f, proto.storage.ServiceWorkerNavigationPreloadState.serializeBinaryToWriter);
    }
    f = message.getUsedFeaturesList();
    if (f.length > 0) {
        writer.writeRepeatedUint32(13, f);
    }
    f = (jspb.Message.getField(message, 14));
    if (f != null) {
        writer.writeEnum(14, f);
    }
    f = (jspb.Message.getField(message, 15));
    if (f != null) {
        writer.writeEnum(15, f);
    }
    f = (jspb.Message.getField(message, 16));
    if (f != null) {
        writer.writeInt64(16, f);
    }
    f = (jspb.Message.getField(message, 17));
    if (f != null) {
        writer.writeEnum(17, f);
    }
    f = (jspb.Message.getField(message, 18));
    if (f != null) {
        writer.writeString(18, f);
    }
    f = (jspb.Message.getField(message, 19));
    if (f != null) {
        writer.writeEnum(19, f);
    }
    f = (jspb.Message.getField(message, 20));
    if (f != null) {
        writer.writeString(20, f);
    }
};
proto.storage.ServiceWorkerRegistrationData.ServiceWorkerScriptType = {
    CLASSIC: 0,
    MODULE: 1
};
proto.storage.ServiceWorkerRegistrationData.ServiceWorkerUpdateViaCacheType = {
    IMPORTS: 0,
    ALL: 1,
    NONE: 2
};
proto.storage.ServiceWorkerRegistrationData.CrossOriginEmbedderPolicyValue = {
    NONE_OR_NOT_EXIST: 0,
    REQUIRE_CORP: 1,
    CREDENTIALLESS: 2
};
proto.storage.ServiceWorkerRegistrationData.prototype.getRegistrationId = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setRegistrationId = function (value) {
    return jspb.Message.setField(this, 1, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearRegistrationId = function () {
    return jspb.Message.setField(this, 1, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasRegistrationId = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getScopeUrl = function () {
    return (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setScopeUrl = function (value) {
    return jspb.Message.setField(this, 2, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearScopeUrl = function () {
    return jspb.Message.setField(this, 2, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasScopeUrl = function () {
    return jspb.Message.getField(this, 2) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getScriptUrl = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, ""));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setScriptUrl = function (value) {
    return jspb.Message.setField(this, 3, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearScriptUrl = function () {
    return jspb.Message.setField(this, 3, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasScriptUrl = function () {
    return jspb.Message.getField(this, 3) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getVersionId = function () {
    return (jspb.Message.getFieldWithDefault(this, 4, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setVersionId = function (value) {
    return jspb.Message.setField(this, 4, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearVersionId = function () {
    return jspb.Message.setField(this, 4, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasVersionId = function () {
    return jspb.Message.getField(this, 4) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getIsActive = function () {
    return (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setIsActive = function (value) {
    return jspb.Message.setField(this, 5, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearIsActive = function () {
    return jspb.Message.setField(this, 5, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasIsActive = function () {
    return jspb.Message.getField(this, 5) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getHasFetchHandler = function () {
    return (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setHasFetchHandler = function (value) {
    return jspb.Message.setField(this, 6, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearHasFetchHandler = function () {
    return jspb.Message.setField(this, 6, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasHasFetchHandler = function () {
    return jspb.Message.getField(this, 6) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getLastUpdateCheckTime = function () {
    return (jspb.Message.getFieldWithDefault(this, 7, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setLastUpdateCheckTime = function (value) {
    return jspb.Message.setField(this, 7, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearLastUpdateCheckTime = function () {
    return jspb.Message.setField(this, 7, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasLastUpdateCheckTime = function () {
    return jspb.Message.getField(this, 7) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getResourcesTotalSizeBytes = function () {
    return (jspb.Message.getFieldWithDefault(this, 8, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setResourcesTotalSizeBytes = function (value) {
    return jspb.Message.setField(this, 8, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearResourcesTotalSizeBytes = function () {
    return jspb.Message.setField(this, 8, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasResourcesTotalSizeBytes = function () {
    return jspb.Message.getField(this, 8) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getOriginTrialTokens = function () {
    return (jspb.Message.getWrapperField(this, proto.storage.ServiceWorkerOriginTrialInfo, 11));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setOriginTrialTokens = function (value) {
    return jspb.Message.setWrapperField(this, 11, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearOriginTrialTokens = function () {
    return this.setOriginTrialTokens(undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasOriginTrialTokens = function () {
    return jspb.Message.getField(this, 11) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getNavigationPreloadState = function () {
    return (jspb.Message.getWrapperField(this, proto.storage.ServiceWorkerNavigationPreloadState, 12));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setNavigationPreloadState = function (value) {
    return jspb.Message.setWrapperField(this, 12, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearNavigationPreloadState = function () {
    return this.setNavigationPreloadState(undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasNavigationPreloadState = function () {
    return jspb.Message.getField(this, 12) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getUsedFeaturesList = function () {
    return (jspb.Message.getRepeatedField(this, 13));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setUsedFeaturesList = function (value) {
    return jspb.Message.setField(this, 13, value || []);
};
proto.storage.ServiceWorkerRegistrationData.prototype.addUsedFeatures = function (value, opt_index) {
    return jspb.Message.addToRepeatedField(this, 13, value, opt_index);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearUsedFeaturesList = function () {
    return this.setUsedFeaturesList([]);
};
proto.storage.ServiceWorkerRegistrationData.prototype.getUpdateViaCache = function () {
    return (jspb.Message.getFieldWithDefault(this, 14, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setUpdateViaCache = function (value) {
    return jspb.Message.setField(this, 14, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearUpdateViaCache = function () {
    return jspb.Message.setField(this, 14, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasUpdateViaCache = function () {
    return jspb.Message.getField(this, 14) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getScriptType = function () {
    return (jspb.Message.getFieldWithDefault(this, 15, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setScriptType = function (value) {
    return jspb.Message.setField(this, 15, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearScriptType = function () {
    return jspb.Message.setField(this, 15, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasScriptType = function () {
    return jspb.Message.getField(this, 15) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getScriptResponseTime = function () {
    return (jspb.Message.getFieldWithDefault(this, 16, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setScriptResponseTime = function (value) {
    return jspb.Message.setField(this, 16, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearScriptResponseTime = function () {
    return jspb.Message.setField(this, 16, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasScriptResponseTime = function () {
    return jspb.Message.getField(this, 16) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getCrossOriginEmbedderPolicyValue = function () {
    return (jspb.Message.getFieldWithDefault(this, 17, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setCrossOriginEmbedderPolicyValue = function (value) {
    return jspb.Message.setField(this, 17, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearCrossOriginEmbedderPolicyValue = function () {
    return jspb.Message.setField(this, 17, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasCrossOriginEmbedderPolicyValue = function () {
    return jspb.Message.getField(this, 17) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getCrossOriginEmbedderPolicyReportingEndpoint = function () {
    return (jspb.Message.getFieldWithDefault(this, 18, ""));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setCrossOriginEmbedderPolicyReportingEndpoint = function (value) {
    return jspb.Message.setField(this, 18, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearCrossOriginEmbedderPolicyReportingEndpoint = function () {
    return jspb.Message.setField(this, 18, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasCrossOriginEmbedderPolicyReportingEndpoint = function () {
    return jspb.Message.getField(this, 18) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getCrossOriginEmbedderPolicyReportOnlyValue = function () {
    return (jspb.Message.getFieldWithDefault(this, 19, 0));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setCrossOriginEmbedderPolicyReportOnlyValue = function (value) {
    return jspb.Message.setField(this, 19, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearCrossOriginEmbedderPolicyReportOnlyValue = function () {
    return jspb.Message.setField(this, 19, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasCrossOriginEmbedderPolicyReportOnlyValue = function () {
    return jspb.Message.getField(this, 19) != null;
};
proto.storage.ServiceWorkerRegistrationData.prototype.getCrossOriginEmbedderPolicyReportOnlyReportingEndpoint = function () {
    return (jspb.Message.getFieldWithDefault(this, 20, ""));
};
proto.storage.ServiceWorkerRegistrationData.prototype.setCrossOriginEmbedderPolicyReportOnlyReportingEndpoint = function (value) {
    return jspb.Message.setField(this, 20, value);
};
proto.storage.ServiceWorkerRegistrationData.prototype.clearCrossOriginEmbedderPolicyReportOnlyReportingEndpoint = function () {
    return jspb.Message.setField(this, 20, undefined);
};
proto.storage.ServiceWorkerRegistrationData.prototype.hasCrossOriginEmbedderPolicyReportOnlyReportingEndpoint = function () {
    return jspb.Message.getField(this, 20) != null;
};
if (jspb.Message.GENERATE_TO_OBJECT) {
    proto.storage.ServiceWorkerResourceRecord.prototype.toObject = function (opt_includeInstance) {
        return proto.storage.ServiceWorkerResourceRecord.toObject(opt_includeInstance, this);
    };
    proto.storage.ServiceWorkerResourceRecord.toObject = function (includeInstance, msg) {
        var f, obj = {
            resourceId: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
            url: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
            sizeBytes: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f
        };
        if (includeInstance) {
            obj.$jspbMessageInstance = msg;
        }
        return obj;
    };
}
proto.storage.ServiceWorkerResourceRecord.deserializeBinary = function (bytes) {
    var reader = new jspb.BinaryReader(bytes);
    var msg = new proto.storage.ServiceWorkerResourceRecord;
    return proto.storage.ServiceWorkerResourceRecord.deserializeBinaryFromReader(msg, reader);
};
proto.storage.ServiceWorkerResourceRecord.deserializeBinaryFromReader = function (msg, reader) {
    while (reader.nextField()) {
        if (reader.isEndGroup()) {
            break;
        }
        var field = reader.getFieldNumber();
        switch (field) {
            case 1:
                var value = (reader.readInt64());
                msg.setResourceId(value);
                break;
            case 2:
                var value = (reader.readString());
                msg.setUrl(value);
                break;
            case 3:
                var value = (reader.readUint64());
                msg.setSizeBytes(value);
                break;
            default:
                reader.skipField();
                break;
        }
    }
    return msg;
};
proto.storage.ServiceWorkerResourceRecord.prototype.serializeBinary = function () {
    var writer = new jspb.BinaryWriter();
    proto.storage.ServiceWorkerResourceRecord.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
};
proto.storage.ServiceWorkerResourceRecord.serializeBinaryToWriter = function (message, writer) {
    var f = undefined;
    f = (jspb.Message.getField(message, 1));
    if (f != null) {
        writer.writeInt64(1, f);
    }
    f = (jspb.Message.getField(message, 2));
    if (f != null) {
        writer.writeString(2, f);
    }
    f = (jspb.Message.getField(message, 3));
    if (f != null) {
        writer.writeUint64(3, f);
    }
};
proto.storage.ServiceWorkerResourceRecord.prototype.getResourceId = function () {
    return (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.storage.ServiceWorkerResourceRecord.prototype.setResourceId = function (value) {
    return jspb.Message.setField(this, 1, value);
};
proto.storage.ServiceWorkerResourceRecord.prototype.clearResourceId = function () {
    return jspb.Message.setField(this, 1, undefined);
};
proto.storage.ServiceWorkerResourceRecord.prototype.hasResourceId = function () {
    return jspb.Message.getField(this, 1) != null;
};
proto.storage.ServiceWorkerResourceRecord.prototype.getUrl = function () {
    return (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.storage.ServiceWorkerResourceRecord.prototype.setUrl = function (value) {
    return jspb.Message.setField(this, 2, value);
};
proto.storage.ServiceWorkerResourceRecord.prototype.clearUrl = function () {
    return jspb.Message.setField(this, 2, undefined);
};
proto.storage.ServiceWorkerResourceRecord.prototype.hasUrl = function () {
    return jspb.Message.getField(this, 2) != null;
};
proto.storage.ServiceWorkerResourceRecord.prototype.getSizeBytes = function () {
    return (jspb.Message.getFieldWithDefault(this, 3, 0));
};
proto.storage.ServiceWorkerResourceRecord.prototype.setSizeBytes = function (value) {
    return jspb.Message.setField(this, 3, value);
};
proto.storage.ServiceWorkerResourceRecord.prototype.clearSizeBytes = function () {
    return jspb.Message.setField(this, 3, undefined);
};
proto.storage.ServiceWorkerResourceRecord.prototype.hasSizeBytes = function () {
    return jspb.Message.getField(this, 3) != null;
};
goog.object.extend(exports, proto.storage);
