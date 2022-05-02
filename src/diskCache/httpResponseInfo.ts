import { staticImplements } from "../utils";
import { DeSerializableObject, SerializableObject } from "./diskCacheApi";
import * as crypto from 'crypto'
import * as assert from "assert"
import { PickleReader } from "./pickle";

// The version of the response info used when persisting response info.
const RESPONSE_INFO_VERSION = 3,

// The minimum version supported for deserializing response info.
RESPONSE_INFO_MINIMUM_VERSION = 3,

// We reserve up to 8 bits for the version number.
RESPONSE_INFO_VERSION_MASK = 0xFF,

// This bit is set if the response info has a cert at the end.
// Version 1 serialized only the end-entity certificate, while subsequent
// versions include the available certificate chain.
RESPONSE_INFO_HAS_CERT = 1 << 8,

// This bit was historically set if the response info had a security-bits
// field (security strength, in bits, of the SSL connection) at the end.
RESPONSE_INFO_HAS_SECURITY_BITS = 1 << 9,

// This bit is set if the response info has a cert status at the end.
RESPONSE_INFO_HAS_CERT_STATUS = 1 << 10,

// This bit is set if the response info has vary header data.
RESPONSE_INFO_HAS_VARY_DATA = 1 << 11,

// This bit is set if the request was cancelled before completion.
RESPONSE_INFO_TRUNCATED = 1 << 12,

// This bit is set if the response was received via SPDY.
RESPONSE_INFO_WAS_SPDY = 1 << 13,

// This bit is set if the request has ALPN negotiated.
RESPONSE_INFO_WAS_ALPN = 1 << 14,

// This bit is set if the request was fetched via an explicit proxy.
RESPONSE_INFO_WAS_PROXY = 1 << 15,

// This bit is set if the response info has an SSL connection status field.
// This contains the ciphersuite used to fetch the resource as well as the
// protocol version, compression method and whether SSLv3 fallback was used.
RESPONSE_INFO_HAS_SSL_CONNECTION_STATUS = 1 << 16,

// This bit is set if the response info has protocol version.
RESPONSE_INFO_HAS_ALPN_NEGOTIATED_PROTOCOL = 1 << 17,

// This bit is set if the response info has connection info.
RESPONSE_INFO_HAS_CONNECTION_INFO = 1 << 18,

// This bit is set if the request has http authentication.
RESPONSE_INFO_USE_HTTP_AUTHENTICATION = 1 << 19,

// This bit is set if ssl_info has SCTs.
RESPONSE_INFO_HAS_SIGNED_CERTIFICATE_TIMESTAMPS = 1 << 20,

RESPONSE_INFO_UNUSED_SINCE_PREFETCH = 1 << 21,

// This bit is set if the response has a key exchange group.
RESPONSE_INFO_HAS_KEY_EXCHANGE_GROUP = 1 << 22,

// This bit is set if ssl_info recorded that PKP was bypassed due to a local
// trust anchor.
RESPONSE_INFO_PKP_BYPASSED = 1 << 23,

// This bit is set if stale_revalidate_time is stored.
RESPONSE_INFO_HAS_STALENESS = 1 << 24,

// This bit is set if the response has a peer signature algorithm.
RESPONSE_INFO_HAS_PEER_SIGNATURE_ALGORITHM = 1 << 25,

// This bit is set if the response is a prefetch whose reuse should be
// restricted in some way.
RESPONSE_INFO_RESTRICTED_PREFETCH = 1 << 26,

// This bit is set if the response has a nonempty `dns_aliases` entry.
RESPONSE_INFO_HAS_DNS_ALIASES = 1 << 27;

class HttpResponseHeaders {

    public httpVersion:string
    public headers:Record<string, string>

    constructor(pickle: PickleReader) {
        const headersRaw = pickle.readString()
        // remove trailing \x00\x00 with slice
        const [httpVersion, ...headersStringified] = headersRaw.slice(0,-2).split("\x00")
        this.httpVersion = httpVersion
        this.headers = Object.fromEntries(headersStringified.map(header => header.split(/:(.*)/s).slice(0,2)))
    }

    serialize() {
        throw new Error("Unimplemented")
    }
}

@staticImplements<DeSerializableObject<HttpResponseInfo>>()
class HttpResponseInfo implements SerializableObject {
    constructor(
        public requestTime:bigint,
        public responseTime:bigint,
        public headers:HttpResponseHeaders,
        public certChain: crypto.X509Certificate[],
        public certStatus: number | undefined,
        public connectionStatus: number | undefined,
        public remoteEndpoint:{host: string, port:number},
        public alpnNegotiatedProtocol: string | undefined,
        public connectionInfo: number | undefined,
        public keyExchangeGroup: number | undefined,
        public staleRevalidateTimeout: bigint | undefined,
        public peerSignatureAlgorithm: number | undefined,
        public dnsAliases: string[]
    ) {}
    
    static read(buffer: Buffer) {
        const { pickle, leftover } = PickleReader.new(buffer)
        const flags = pickle.readInt()
        const version = flags & RESPONSE_INFO_VERSION_MASK;
        assert(!(version < RESPONSE_INFO_MINIMUM_VERSION), "HttpResponseInfo version to low")
        assert(!(version > RESPONSE_INFO_VERSION), "HttpResponseInfo version to high")

        const requestTime = pickle.readInt64()
        const responseTime = pickle.readInt64()

        const headers = new HttpResponseHeaders(pickle)

        const certChain:crypto.X509Certificate[] = []
        if (flags & RESPONSE_INFO_HAS_CERT) {
            const chainLength = pickle.readInt()
            for(let i = 0; i < chainLength; i++) {
                const certBuffer = pickle.readData()
                const cert = new crypto.X509Certificate(certBuffer)
                certChain.push(cert)
            }
        }

        let certStatus
        if (flags & RESPONSE_INFO_HAS_CERT_STATUS) {
            certStatus = pickle.readUInt32();
        }

        let connectionStatus
        if (flags & RESPONSE_INFO_HAS_SSL_CONNECTION_STATUS) {
            connectionStatus = pickle.readInt()
        }

        if (flags & RESPONSE_INFO_HAS_VARY_DATA) {
            console.log("If this gets tripped go implement vary data reading")
            process.exit(1)
        }

        const socketAddressHost = pickle.readString()
        const socketAddressPort = pickle.readUInt16()

        let alpnNegotiatedProtocol
        // Read protocol-version.
        if (flags & RESPONSE_INFO_HAS_ALPN_NEGOTIATED_PROTOCOL) {
            alpnNegotiatedProtocol = pickle.readString()
        }

        let connectionInfo
        if(flags & RESPONSE_INFO_HAS_CONNECTION_INFO) {
            connectionInfo = pickle.readInt()
        }

        let keyExchangeGroup;
        if (flags & RESPONSE_INFO_HAS_KEY_EXCHANGE_GROUP) {
            keyExchangeGroup = pickle.readInt()
        }

        let staleRevalidateTimeout
        if (flags & RESPONSE_INFO_HAS_STALENESS) {
            staleRevalidateTimeout = pickle.readInt64()
        }

        let peerSignatureAlgorithm
        if (flags & RESPONSE_INFO_HAS_PEER_SIGNATURE_ALGORITHM) {
            peerSignatureAlgorithm = pickle.readInt()
        }


        const dnsAliases:string[] = []
        if (flags & RESPONSE_INFO_HAS_DNS_ALIASES) {
            const numAliases = pickle.readInt()
            for(let i = 0; i < numAliases; i++) {
                dnsAliases.push(pickle.readString())
            }
        }

        return {
            result: new HttpResponseInfo(
                requestTime,
                responseTime,
                headers,
                certChain,
                certStatus,
                connectionStatus,
                {host: socketAddressHost, port: socketAddressPort},
                alpnNegotiatedProtocol,
                connectionInfo,
                keyExchangeGroup,
                staleRevalidateTimeout,
                peerSignatureAlgorithm,
                dnsAliases
            ),
            leftover: leftover
        }
    }

    serialize(): Buffer {
        throw new Error("Unimplemented")
    }
}
