"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpResponseInfo_1;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const crypto = require("crypto");
const assert = require("assert");
const pickle_1 = require("./pickle");
const RESPONSE_INFO_VERSION = 3, RESPONSE_INFO_MINIMUM_VERSION = 3, RESPONSE_INFO_VERSION_MASK = 0xFF, RESPONSE_INFO_HAS_CERT = 1 << 8, RESPONSE_INFO_HAS_SECURITY_BITS = 1 << 9, RESPONSE_INFO_HAS_CERT_STATUS = 1 << 10, RESPONSE_INFO_HAS_VARY_DATA = 1 << 11, RESPONSE_INFO_TRUNCATED = 1 << 12, RESPONSE_INFO_WAS_SPDY = 1 << 13, RESPONSE_INFO_WAS_ALPN = 1 << 14, RESPONSE_INFO_WAS_PROXY = 1 << 15, RESPONSE_INFO_HAS_SSL_CONNECTION_STATUS = 1 << 16, RESPONSE_INFO_HAS_ALPN_NEGOTIATED_PROTOCOL = 1 << 17, RESPONSE_INFO_HAS_CONNECTION_INFO = 1 << 18, RESPONSE_INFO_USE_HTTP_AUTHENTICATION = 1 << 19, RESPONSE_INFO_HAS_SIGNED_CERTIFICATE_TIMESTAMPS = 1 << 20, RESPONSE_INFO_UNUSED_SINCE_PREFETCH = 1 << 21, RESPONSE_INFO_HAS_KEY_EXCHANGE_GROUP = 1 << 22, RESPONSE_INFO_PKP_BYPASSED = 1 << 23, RESPONSE_INFO_HAS_STALENESS = 1 << 24, RESPONSE_INFO_HAS_PEER_SIGNATURE_ALGORITHM = 1 << 25, RESPONSE_INFO_RESTRICTED_PREFETCH = 1 << 26, RESPONSE_INFO_HAS_DNS_ALIASES = 1 << 27;
class HttpResponseHeaders {
    constructor(pickle) {
        const headersRaw = pickle.readString();
        const [httpVersion, ...headersStringified] = headersRaw.slice(0, -2).split("\x00");
        this.httpVersion = httpVersion;
        this.headers = Object.fromEntries(headersStringified.map(header => header.split(/:(.*)/s).slice(0, 2)));
    }
    serialize() {
        throw new Error("Unimplemented");
    }
}
let HttpResponseInfo = HttpResponseInfo_1 = class HttpResponseInfo {
    constructor(requestTime, responseTime, headers, certChain, certStatus, connectionStatus, remoteEndpoint, alpnNegotiatedProtocol, connectionInfo, keyExchangeGroup, staleRevalidateTimeout, peerSignatureAlgorithm, dnsAliases) {
        this.requestTime = requestTime;
        this.responseTime = responseTime;
        this.headers = headers;
        this.certChain = certChain;
        this.certStatus = certStatus;
        this.connectionStatus = connectionStatus;
        this.remoteEndpoint = remoteEndpoint;
        this.alpnNegotiatedProtocol = alpnNegotiatedProtocol;
        this.connectionInfo = connectionInfo;
        this.keyExchangeGroup = keyExchangeGroup;
        this.staleRevalidateTimeout = staleRevalidateTimeout;
        this.peerSignatureAlgorithm = peerSignatureAlgorithm;
        this.dnsAliases = dnsAliases;
    }
    static read(buffer) {
        const { pickle, leftover } = pickle_1.PickleReader.new(buffer);
        const flags = pickle.readInt();
        const version = flags & RESPONSE_INFO_VERSION_MASK;
        assert(!(version < RESPONSE_INFO_MINIMUM_VERSION), "HttpResponseInfo version to low");
        assert(!(version > RESPONSE_INFO_VERSION), "HttpResponseInfo version to high");
        const requestTime = pickle.readInt64();
        const responseTime = pickle.readInt64();
        const headers = new HttpResponseHeaders(pickle);
        const certChain = [];
        if (flags & RESPONSE_INFO_HAS_CERT) {
            const chainLength = pickle.readInt();
            for (let i = 0; i < chainLength; i++) {
                const certBuffer = pickle.readData();
                const cert = new crypto.X509Certificate(certBuffer);
                certChain.push(cert);
            }
        }
        let certStatus;
        if (flags & RESPONSE_INFO_HAS_CERT_STATUS) {
            certStatus = pickle.readUInt32();
        }
        let connectionStatus;
        if (flags & RESPONSE_INFO_HAS_SSL_CONNECTION_STATUS) {
            connectionStatus = pickle.readInt();
        }
        if (flags & RESPONSE_INFO_HAS_VARY_DATA) {
            console.log("If this gets tripped go implement vary data reading");
            process.exit(1);
        }
        const socketAddressHost = pickle.readString();
        const socketAddressPort = pickle.readUInt16();
        let alpnNegotiatedProtocol;
        if (flags & RESPONSE_INFO_HAS_ALPN_NEGOTIATED_PROTOCOL) {
            alpnNegotiatedProtocol = pickle.readString();
        }
        let connectionInfo;
        if (flags & RESPONSE_INFO_HAS_CONNECTION_INFO) {
            connectionInfo = pickle.readInt();
        }
        let keyExchangeGroup;
        if (flags & RESPONSE_INFO_HAS_KEY_EXCHANGE_GROUP) {
            keyExchangeGroup = pickle.readInt();
        }
        let staleRevalidateTimeout;
        if (flags & RESPONSE_INFO_HAS_STALENESS) {
            staleRevalidateTimeout = pickle.readInt64();
        }
        let peerSignatureAlgorithm;
        if (flags & RESPONSE_INFO_HAS_PEER_SIGNATURE_ALGORITHM) {
            peerSignatureAlgorithm = pickle.readInt();
        }
        const dnsAliases = [];
        if (flags & RESPONSE_INFO_HAS_DNS_ALIASES) {
            const numAliases = pickle.readInt();
            for (let i = 0; i < numAliases; i++) {
                dnsAliases.push(pickle.readString());
            }
        }
        return {
            result: new HttpResponseInfo_1(requestTime, responseTime, headers, certChain, certStatus, connectionStatus, { host: socketAddressHost, port: socketAddressPort }, alpnNegotiatedProtocol, connectionInfo, keyExchangeGroup, staleRevalidateTimeout, peerSignatureAlgorithm, dnsAliases),
            leftover: leftover
        };
    }
    serialize() {
        throw new Error("Unimplemented");
    }
};
HttpResponseInfo = HttpResponseInfo_1 = __decorate([
    (0, utils_1.staticImplements)()
], HttpResponseInfo);
