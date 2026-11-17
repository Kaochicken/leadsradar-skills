#!/usr/bin/env node
import { createRequire as __createRequire } from 'node:module';
const require = __createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxBufferedChunks = options.maxBufferedChunks | 0;
        this._maxFragments = options.maxFragments | 0;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._numFragments = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
          cb(
            this.createError(
              RangeError,
              "Too many buffered chunks",
              false,
              1008,
              "WS_ERR_TOO_MANY_BUFFERED_PARTS"
            )
          );
          return;
        }
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
          const error = this.createError(
            RangeError,
            "Too many message fragments",
            false,
            1008,
            "WS_ERR_TOO_MANY_BUFFERED_PARTS"
          );
          cb(error);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._numFragments = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var {
      types: { isUint8Array }
    } = __require("util");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else if (isUint8Array(data)) {
            buf.set(data, 2);
          } else {
            throw new TypeError("Second argument must be a string or a Uint8Array");
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash: createHash2 } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL } = __require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            if (!options || options.protocols === void 0) {
              protocols = [];
            } else if (Array.isArray(options.protocols)) {
              protocols = options.protocols;
            } else {
              protocols = [options.protocols];
            }
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              if (options.protocols === void 0) {
                protocols = [];
              } else if (Array.isArray(options.protocols)) {
                protocols = options.protocols;
              } else {
                protocols = [options.protocols];
              }
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxBufferedChunks=0] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=0] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxBufferedChunks: options.maxBufferedChunks,
          maxFragments: options.maxFragments,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._readyState = _WebSocket.CLOSING;
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxBufferedChunks: 256 * 1024,
        maxFragments: 16 * 1024,
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        protocols: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash2("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxBufferedChunks: opts.maxBufferedChunks,
          maxFragments: opts.maxFragments,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http = __require("http");
    var { Duplex } = __require("stream");
    var { createHash: createHash2 } = __require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
       *     buffered data chunks
       * @param {Number} [options.maxFragments=16384] The maximum number of message
       *     fragments
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxBufferedChunks: 256 * 1024,
          maxFragments: 16 * 1024,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash2("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxBufferedChunks: this.options.maxBufferedChunks,
          maxFragments: this.options.maxFragments,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_extension = __toESM(require_extension(), 1);
var import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_subprotocol = __toESM(require_subprotocol(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// agent/leadsradar-agent.mjs
import {
  generateKeyPairSync,
  sign as edSign,
  createHash,
  createPrivateKey
} from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync, unlinkSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";
import { createServer as createHttpServer } from "node:http";
import { createConnection } from "node:net";
import { execFile, spawn } from "node:child_process";
var __dirname = dirname(fileURLToPath(import.meta.url));
var PORT = Number(process.env.LEADSRADAR_AGENT_PORT) || 17373;
var PROTOCOL_VERSION = "3";
var SKILLS_LATEST = {
  radar: "1.2.75",
  // ⭐R96g1bd 1.2.74→1.2.75：渲染违规黑名单批（WorkBuddy 实收五违例钉死：①【作品详情】禁加粗独行旧结构必须两列标签表且只此三行禁自加行 ②互动行小红书禁🔁 ③【评论展示】禁「分级/数量/样本」计数表必须四列具体评论表 ④四宫格表+A3 统计行缺一不可帽行照抄禁加「指数」 ⑤结尾禁自创钩子【下一步行动】编号行即收尾）｜⭐R96gp 1.2.73→1.2.74：日报转派管家栗批（路由边界补「要日报（栗子日报/今天的日报/获客日报/昨天有什么线索）→管家栗」——用户实报「栗子日报」被情报栗劫持自由发挥旧格式，本栗接到转派禁自己调 get_daily_report 渲染）| ⭐R96gcj 1.2.72→1.2.73：采集默认 50 条提速批（触达 27s→≈15s，A3 集中按👍热门前列；深挖再加 100~200）| ⭐R96gax 唤醒词三层重构（主唤醒词+注册同义词+同语义模糊词 9 组）+关键词四岔口次位默认表+深采领取 A3 富矿分叉 | ⭐R96gaw 1.2.70→1.2.71：下一步行动五维评分批（⭐2026-11-03 用户拍板 6 项——①扫对标·有命中=研究 3.20+触达 3.10 两最高（池/现扫两路径统一，「探一下 <该号>」2.55 垫底退役，代表评论 top_leads 就是现成触达素材）②扫我的号·有命中=触达 3.40+我的线索 3.00（研究 2.95 出局——自己的号不拆自己的爆款）③删对标次位「查对标库」2.05→「栗子加监控」2.95（删除交付刚列完全表再查=重复）④关监控两行动对调：扫对标 3.40 首位·加监控 2.35 次位（刚关完就劝重开语气错位））｜⭐R96eq 1.2.65→1.2.66：命中快扫数据源换 week_hits 批（⭐2026-10-31 用户实报「7 天内命中 1 条（宝宝接电话呀～👍1572），本轮回执未带该篇快扫数据」——命中快扫/补扫双链候选池一直是 latest_notes（buildLatest slice(0,7) 时间降序截断），周发布 >7 条的号命中但发布较早的作品漏出 7 条帽双链都接不到永无 a3，R96df「命中优先补扫保证快扫块有料」在命中被截断时结构性失效，R96en「两轮 6 命中 0 快扫块」观察项的真正根因；修=agent-tasks.ts 新增 summary.week_hits 周命中全量字段双链候选池换源+补扫护栏 6 条/轮+latest_notes 7 条帽不动；SKILL【命中详情】两处数据源 week_hits 优先无字段回退 latest_notes hit 条目；引擎批须重载插件生效） ⭐R96ef ⭐R96ef 1.2.60→1.2.61：7 天外补足排除置顶批（⭐2026-10-31 用户拍板「图解万物 3 条确实是置顶——这是Bug，我们展示的是最新应该」：置顶是作者挑的橱窗位非时间最新，「7 天外最新 3 条」3 条全置顶旧作冒充最新实报是 bug）：三处引擎同款刀（agent-tasks.ts 监控池 query_local_data source=monitor——HitRow 补 is_pinned 声明+olderList→olderPick 排除置顶+items 透出 pinned 与 latest_notes 同款、capture_profile buildLatest olderPick、MonitorTab.tsx pickStripHits 同款）；口径=只从非置顶旧作里取最新补足、非置顶旧作空则不补足（不拿置顶凑数）、近 7 天组内不排除（7 天内发布的置顶=真新作，宿主「（置顶）」尾缀可辨）；SKILL 口径四处同步（监控池口径行/流程 E 照抄口径/自查定版段/【最新动态】置顶规改写「7 天外补足已排除置顶，pinned 尾缀现仅见于近 7 天组」）；引擎批须重载插件生效） ⭐R96ee 1.2.59→1.2.60：长任务开工预告+纯时间降序+置顶标记批（⭐2026-10-31 用户三反馈拍板，引擎 ADAPTER 1.2.134 同批须重载插件）：①开工预告纪律（用户拍板 A 方案「像栗子在吗的更新反馈一样提前给一句」——同步死等型任务宿主全程哑巴数分钟是痛点根因）：栗子仪式段新增 ⭐R96ee 长任务开工预告——预计超 1 分钟的任务（流程 E 现扫扫对标/扫我的、C1 关键词首扫、B 账号速览）开工语同一条消息内追加预告行 `⏳ 预计 X-Y 分钟 · 浏览器自动翻页采集属正常 · 跑完立刻回来汇报`；时长口径：E=每号 1-3 分钟×号数（深扫池未建/未满更久，首扫干满最长约 +40 分钟；刚扫过/池有料会更快，往快说不往慢说）、C1=1-3 分钟（指定条数多按比例加）、B=1-2 分钟；给区间禁精确秒数；预告行随开工语一次发出后即调工具执行中不再插话（tool call 期间宿主无法中途发言，预告的意义=把等多久说在前面）；快任务（<1 分钟：探作品/查库/查设置）不加预告保持轻快；预告行不算过程旁白（旁白砍执行中叙述，预告是开工时一次性预期管理，与零过程旁白不冲突）；流程 E 步骤 3 开头补落点「开扫前按栗子仪式发预告行：N 个号=预计 N×1-3 分钟」；②作品表纯时间降序（用户拍板「已有专门给命中的栏目，在任何情况下都按时间顺序排列」推翻 b18+ 命中置顶）：监控池口径改「近7天优先→时间降序（⭐R96ee 命中不置顶），上限 7 条」+自查定版段 latest_notes 口径同款+【最新动态】条目改「时间降序引擎已排好照抄顺序 ⭐R96ee 命中不置顶——命中与否只看命中列 ✅/—」；③置顶标记（用户问图解万物「不会采集的是三个置顶视频吧？」）：latest_notes 条目带 pinned:true 时标题尾缀「（置顶）」——置顶旧作混在「7 天外最新 3 条」里一眼可辨（图解万物 3 条全置顶实报），禁把置顶当最新误读。⭐R96dx 1.2.58→1.2.59：纯查交付三补批（⭐2026-10-31 用户复测三反馈）：①评论采集开关 emoji 定版——✅ 开（每条上限 N 条）/❌ 关（每条上限 N 条保留）成对，禁 ×/√ 纯文本符号（旧口径「开=√ 每条上限 N 条、关=×」是 SKILL 自己定的，用户实报两边都不对：× 没配对 emoji、√ 也不是 emoji）；②观察窗机制细节补进语义段+纯查说明行（答用户「观察窗口是观察啥呢？补充啥数据呢？」——云端每日扫描发现监控账号新作品入观察池，cron 每 12 小时回查一轮最新互动数据（赞数对照命中线），窗内爬到线=命中通知、到窗尾未达标=转观察完成不再盯；全程云端自动回查 TikHub 互动计数，用户无需补任何数据）；③云端行「web 端雷达页改」附跳转链接 [web 端雷达页改](https://app.leadsradar.cn/radar)（用户实报「应该给到跳转链接」）——纯查表第三列+修改表改后列+纯查纪律③+表格纪律四处同款。⭐R96dw 1.2.57→1.2.58：交付硬化+观察期语义校正批（⭐2026-10-31 用户四连反馈）：①纯查纪律四硬规进第 8 条（小标题【扫描/监控设置】必出/禁出【修改结果】——纯查回执无「上次改动」数据，出现「上次改动已生效」类回顾块=编造/云端监控必须表格最后一行禁表外独立文字行——宿主两次实测都落成散文行用户两报「还是没有成表格呈现」/表头三列固定「项目·当前值·推荐区间」禁合并说明列）；②观察期语义全端校正（代码实查：web monitoring/runner 唯一消费点——新作品观察窗窗内跟踪判命中超窗转观察完成，本机快扫深扫=近 7 天+命中条件即时判定不吃观察期；改口「命中条件对两端生效、观察期仅云端监控生效」——description/第 8 条/纯查模板说明行/表格括注同批）；③修改交付表格纪律补云端行禁令（禁表外文字行，两张表同规）。⭐R96dv 1.2.56→1.2.57：命中规则开窗+修改回执表格批（⭐2026-10-31 用户拍板「命中规则还有两条数据，也要可修改」「（云端监控）这个也要表格呈现」「加一个【修改结果】的小标题」）：①流程 F 第 8 条扩 hitMode/hitValue/observeHours 三参（命中条件+观察期两条，PUT /api/monitoring/settings 与插件「命中观察规则」同源，对两端生效需登录，未登录纯查静默省略/主动改回 LOGIN_REQUIRED）；②纯查【扫描/监控设置】表格补命中条件/观察期两行；③修改交付【修改结果】改前改后表定版（改后加粗+语义括注）+云端监控行固定进表尾+A3 提醒句只在真改评论采集才出；④明确全部非破坏性免确认直接改禁加「确定要改吗」类多问一句。⭐R96dt 1.2.55→1.2.56：扫描/监控设置升级批（⭐2026-10-31 用户拍板「扫描规则要用表格呈现：首次扫描/新增扫描（插件端也统一称呼，复扫都叫新增扫描）/评论采集√/×（X条）+推荐区间（20-500）（5-20）（10-100）+云端监控一起展示，升级为扫描/监控设置」；AskUserQuestion 拍板云端并入方式=「只读回显+指路 web」）：①流程 F 第 8 条查询输出表格化——【扫描/监控设置】三列表 |项目|当前值|推荐区间|：首次扫描 N 条（一次干满）(20-500)/新增扫描 N 条（只追新）(5-20)/评论采集 √ 每条上限 N 条 或 × (10-100)+已登录时云端监控行（频率·起扫时间，改值指路 web 端雷达页）；②称呼全端统一三项映射——首扫→首次扫描、复扫→新增扫描、深扫评论→评论采集（流程 F 触发段/交付段/【下一步行动】示例同步）；③触发词家族扩「栗子监控设置/扫描监控设置」（旧词栗子扫描设置同认）；④配套引擎 executeScanSettings 换词+cloudLine 云端只读回显（ADAPTER 1.2.124 同批）。⭐R96dq 1.2.54→1.2.55：扫描设置开窗+深扫阴阳规则批（⭐2026-10-30 用户三诉求「第一次直接按照全亮的 50 条…第二次采集的就不应该再出重复采集」「本地扫描的设置应该对话就可以操作，这个要开窗」「栗子扫描设置，触发词也加一下」）：①注册「栗子扫描设置」→ leadsradar_scan_settings（查+改 local_scan_settings 四字段：首扫 first 20-500 默认 50/复扫 rescan 5-20 默认 10/深扫评论开关 deepComments/每篇评论上限 deepCommentLimit 10-100 默认 30，与插件监控页「扫描规则」同份同源，不传参数=查看、传哪个改哪项、越界自动夹到边界）；流程 F 新增第 8 条扫描设置路径（免确认轻量交付）+触发词列表/分流表/requires 三处落位；②流程 E 深扫描述同步阴阳规则（首扫=一轮干满 first 条建池夹 50、复扫=rescan 只追新绝不重扫已扫作品，时长首扫最长约 +40 分钟）；⭐R96do 1.2.53→1.2.54：R96dn 复测两残留补——①七列表仍在（宿主违抗「汇总表退役」自画，latest_notes 字段全顺手就画，SKILL 两段禁令硬化「板块内禁画任何形式的命中汇总表」）；②引擎 top_leads 文本截 30 字（SKILL 承诺完整照抄禁截断，引擎先砍一刀，30→120 字覆盖 99% 评论）。⭐R96dn 1.2.52→1.2.53：扫对标三反馈批（⭐2026-10-30 用户实报：①抖音号粉丝仍显（→0）非（≤999）；②图解万物 7 天外作品发布时间恒 —；③【命中详情】七列表与【最新动态】重复拍板删、改展示代表评论方便评论和去触达）。根因①②同源=引擎 platform 兜底缺——capture_profile 工具 schema 无 platform 参数，宿主只传 url+limit，task.platform 空默认 "xiaohongshu"，delta_note（≤999）与发布时间补采两处 platform==="douyin" 守卫对抖音号恒 false（R96dk note/R96cl/R96ct 补采从未真正执行过；四象限回填不依赖守卫所以照常出值——同引擎不同命自洽），修=platform 非法/缺失时从 task.url 判 douyin.com（与 executeDeepProfile 同款）；③=SKILL 两段去表留块——七列汇总表退役（与【最新动态】作品表重复），快扫块保留+代表评论行强化（top_leads 完整照抄禁截断，触达素材位）。⭐R96dm 1.2.51→1.2.52：触发词家族补全批（⭐2026-10-30 用户要求「增加这几个：栗子加/删/查/扫对标（或我的号），栗子加/关监控」——盘点：加/删/扫对标·扫我的号·加/关监控六词早已注册（R74/R96as/R96bj/R96ca/R96bq），唯「栗子查对标」未注册（查对标库路径 R96ap 只有「查对标库/谁在监控中」等自然词形）；注册「栗子查对标」进 description 两处+触发表加行+流程 F 触发段，边界=带「对标/监控」字样归情报栗、管家栗「栗子查」只管本地资产细看）。⭐R96dk 1.2.50→1.2.51：扫我的四反馈（⭐2026-10-30 用户实报 a/b/c/d）①delta_note 极简「≤999」（拍板——抖音万位步进内两次同值方向不可判定禁编↑微涨/↓微跌，替代「±0.1万内」，表下解释行全删；小红书精确个位 delta=0 照旧显→0）②命中详情七列表 |#|账号|作品|发布|赞|A3|四象限|（A3 列=🟢强🟠弱无显—；四象限列=💎双高/🚀流量/🎯线索/💤双低，引擎 fillHitQuadrant 回填复用 R96bd calcTrafficIndex×calcNoteLeadIndex→classifyNoteQuadrant 同函数同口径）③禁解释旁白三条（直采说明句/7天外口径解释句/有命中时「无额外A3」补充句）④扫对标与扫我的 SKILL 两段同构同款同步改。⭐R96df 1.2.49→1.2.50：①深扫跟随扫描规则（首扫min(first,50)/复扫=rescan，单轮≤10条增量补池+池进度透出「池进度A/B未满下轮自动续」）②命中优先补扫（7天内命中不在深扫集的引擎单开页补采评论挂a3，≤2条/轮，独立hit账本::hits防重复扫）③【命中详情】禁拼「评论A3线索：🟢X🟠Y」账号级合计行（挂单作品语境误导成「这篇快扫就这水平」——实报与单篇深度采集四宫格差远；账号级合计只在完成行深扫行）；⭐R96cx 1.2.48→1.2.49：扫我的五反馈三修（⭐2026-10-29 用户实报五项）①【命中详情】只收 7 天内命中（拍板「太早的就不要重复展示了」）——引擎 latest_notes 7 天外补足条目改标 old_hit/old_obs，深扫快扫回填 filter status=hit 自动只对 7 天内（小米 3 条老命中全噪音三行 0 快扫随之消失）②快扫块复刻流程 A 四宫格（实报「格式跟评论拆解不一致，有四宫格/评论展示，尽量复刻」）——带 a3 的命中在汇总表后逐块：小标题+四宫格表（档位/标记/条数/占比）+A3 率行+top_leads 评论行③「1738.5万（→0）」获赞精度老 bug 复发——scan_delta 加 followers/total_likes_delta_note 万位步进注记（抖音粉丝/获赞 DOM 万位步进 delta<1000 恒 0，宿主括号照抄（±0.1万内）禁显（→0））+message 行获赞同款守卫（R96ct 只修了粉丝）；另三问归因非 bug 不改码：弹窗闪烁=r75 Agent 前台开 tab 设计（防后台隐藏页定时器节流，采集完即关）、小米「又深度采集」=旧版账本口径漏记（30 全采才记账 vs 平台每篇吐 18 条）本轮一次性补齐已记账下轮 skipWhenAllExcluded 跳过、140s 前摇主因即小米重扫（下轮回落）。上批 R96cn：扫对标四问题根修（⭐2026-10-28 用户实报四问）①图解万物（抖音图文号）发布时间仍「—」：当年作品详情页正文只显 MM-DD 短格式不带年份，R96cl 补采正则只认 2026-10-15 全格式对当年作品必 miss——引擎改三段式提取（SSR RENDER_DATA/_ROUTER_DATA createTime 毫秒戳 decodeURIComponent 后匹配最稳→DOM 全格式→MM-DD 引擎补年，拼出未来日期回退一年）②「板块一/二」前缀仍现：SKILL 真源 1.2.47 已含禁令，宿主技能未更新生效，随批发版走 leadsradar_get_latest_skills 更新③总表增量只有 Judy 有括号：scan_delta 对 0 变化已透出 followers_delta:0，旧口径 0=裸值与首轮无快照混淆——拍板改 0=（→0）也显括号④【命中详情】升级单篇快扫：深扫回执 enrichedComments 按 note.id 分组现成底座，hit 条目按 note_url→id 映射单独跑 quickScan 挂 a3 四宫格+top_leads（A3 优先点赞降序取 2 条文本截 30 字），7 天外老命中不在深扫集无评论数据不加引导裸行照旧（⭐拍板「老爆款没那么多价值」）｜前轮 ⭐R96cl 1.2.46→1.2.47：扫对标呈现四改+free 监控拦截（①交付标题去「板块N」前缀②作品表五列钉死禁删列③7 天外补足改最新 3 条时间降序④发布时间空补采详情页+free 点亮 403 会员文案+库况行 0/0 括注）｜前轮 ⭐R96ck 1.2.45→1.2.46：我的账号自带监控重开路径接通+监控位 X 计数修正（⭐2026-10-28 用户实报「1、我的账号无法加云端监控？这个解析下，到底啥情况？2、把我的账号抖音加监控、3加监控，4取消监控」附实收「⚠️ 小米公司（我的抖音）加不了也不需要加——它已绑定为你的『我的账号』自带云端监控+深度采集，直接用就行（当前它的自带监控处于暂停态，要重启去插件『监控』页点开关）」）：①self 重开路径根因——「我的账号」自带监控被「栗子关监控」暂停后（⭐R96ca 开窗含 self）Agent 侧无重开路径：pause_monitor 只关不开、add_monitor 走通用链路必撞云端 self 防线 400（add route「已绑定为我的账号无需再加入对标监控」防线本身是对的——按对标再加是语义错位），宿主只能指路插件监控页手动点；修法=executeAddMonitor 在 wantMonitor 且 targetIsSelf 时先查云端 self 分段（fetchMonitorTargets("account",true) 按 platform+target_id/target_name 匹配）：paused→updateMonitorTargetStatusByKey active 重开（与插件监控页胶囊 Toggle 完全同链路）、active→幂等「自带监控本来就在运行中无需再加」、未匹配→fallthrough 通用链路防线兜底，回执三态 message（已重开「✅ 自带监控此前处于暂停态现已重新开启（云端盯盘+深度采集恢复，不占对标位与监控位）」/运行中/重开失败+插件出路），分支一 self 引导语同步补「若自带监控处于暂停态，对栗子说『栗子加监控+账号名』即可重新开启」——pause_monitor 关监控回执里「要重新开监控：对栗子说『栗子加监控+账号名』」这句指路从此对全场景成立（含我的账号）；②监控位 X 计数修正——用户实收「监控位 0/0」与表内「图解万物 ✅」矛盾根因=query_local_data accounts 库况行误传 fetchMonitorTargets("account",true)（云端 is_self=true 只返回 self 目标），在纯 self 集合里滤 !x.is_self 恒 0，而表内 ✅ 的 monitored 键集来自另一处 fetchMonitorTargets("account") 全量拉取（同函数两种调用参数不一致）；修法=库况行改全量拉取（不传 isSelf）一次三用全对（非 self active 计数=监控位 X+self 行组+失败省略段）；③破案附记（不改码仅记录）——free 用户「已开监控成功」链路真相：PATCH 点亮无权益墙是 ⭐282 故意设计（目标须保持 active 供本机扫描/自动采集引擎用），云端 cron 阶段0 对 free（slotCapOf=0）跳过不扫——free 点亮后本机引擎照跑、云端 24h cron 不盯，回执「云端 24h 盯盘启动」对 free 是过度承诺（产品口径待拍板）。SKILL 配套：流程 F 第 3 条补 self 场景回执三态口径（轻量完成行+回执一行即完，不进对标位括号体系不配四件套）。⭐R96cj 1.2.44→1.2.45：扫对标四板块对齐自查+池空降级话术钉死（⭐2026-10-28 用户实报「我发扫描对标，显示这个，是扫描对标还没开启能力吗？要求要跟扫描我的类似的」附实收「监控池通道这个版本还没开，直接走现场扫描 4 个对标账号，稍等——」「文件拿到，提取关键数据——」）：①池空降级说明只准用「本次为现场扫描（云端监控池没有数据——对标没开监控）」禁编「这个版本还没开/功能未上线」类版本概念话术（池查询通道一直开着，池空=对标没开监控非能力缺口）；②扫对标双路径交付统一四板块与「栗子扫我的号」自查同构（用户拍板）——现扫：完成行+板块一【对标账号】总表（粉丝/赞藏/近7天·命中，scan_delta 增量括号同自查）+板块二【最新动态】每号作品表（⚪ 近7天 0 条号也列「近 7 天 0 条更新」+7 天外高赞 TOP3 参考表，禁防刷屏省略）+板块三【命中详情】跨账号汇总（无命中一句 hit_rule 原文）+板块四【下一步行动】（命中给栗子研究/无命中给栗子加对标铺号）；池有料路径同构四板块（板块一照抄 by_account 池源无粉丝列不编）；旧【巡逻摘要】三列总览+「逐账号两行以内」碎片呈现退役，公共骨架 E 小标题组合同步改；③「文件拿到，提取关键数据」类过程旁白违反 ⭐R96ab 零过程旁白既有规，本批流程 E 重申不新增条款。⭐R96ci 1.2.43→1.2.44：监控三连报 SKILL 侧（⭐2026-10-28 用户实报三连——①「目前监控的上限和权益没显示出来」②「栗子对标第一组内容应该加小标题【我的&对标账号】另外监控栏为啥我的账号显示—（监控未激活）而其他显示为—？这个应该统一吧」③「目前不能加监控貌似？」——完成行「✅ 已开监控」与详情表「监控未激活」+独立警示行三处自相矛盾）：①加监控回执口径两态定版——点亮成功（cloudNote=「已开启云端监控」）完成行用「✅ 已开监控 ·「XX」· 平台（对标位 N/M）」；点亮失败（cloudNote=「云端监控未激活（原因）」）完成行用「✅ 对标已入库 · 云端监控未激活（{原因照抄}）」**禁报「已开监控」**（引擎 ADAPTER 1.2.98 add 后自动点亮 PATCH active 无权益墙，与插件监控页胶囊同链路等效用户手动点）；②对标库表（流程 F 四件套+第 5 条查对标库两处同款）——表上方加小标题 `【我的&对标账号】`（用户拍板命名）+库况行扩 `· 监控位 X/Y · 权益：Z`（message 照抄，回执无该段就不加禁自编——引擎 fetchMonitorTargets 一次三用非 self active 计数+getMonitorSlotsCap+planLabel）+监控列统一两态：监控中=`✅`、未激活（paused/从未开）=`—`——列内禁一切括注（「—（监控未激活）」退役，用户实报我的账号与其他账号两口径混显不统一），权益口径由库况行统一承载；③两样例表（四件套+查对标库）同步新款形态。⭐R96ch 1.2.42→1.2.43：扫我的号四板块+深扫 A3 线索挂钩（⭐2026-10-28 用户实报自查三连——a 拍板「表1【我的账号】和表1.5【增量对比】合并，增量括号展示（↑↓代表数字变化），均赞不需要展示；板块=【我的账号】【最新动态】【命中详情】【下一步行动】」b「深采各4条作品采到4条评论我很难理解？是否命中？不命中的是否也要深度采集？没有命中的命中详情是否要展示内容？」c「小米公司似乎不是最新的3条？02-16、09-28、05-19 看看是啥原因」——自查交付四板块定版：板块一【我的账号】合并总表（两表合一增量进括号正=↑N 负=↓N 0/缺失=裸值，均赞列彻底退役；表前 scan_delta 有才注「较上次扫描约 N 小时前」）+板块二【最新动态】（近7天作品表照抄 latest_notes；7 天外参考表帽行钉死「7 天外高赞 TOP3（按赞降序，非最新）」——引擎口径=近 7 天不足 3 条时从 7 天外按赞降序只补足到 3 条，是高赞优秀内容参考非最新作品、表序=赞降序非时间序，设计如此禁当 bug 报禁自作主张改时间序——破小米「不是最新的3条」疑）+板块三【命中详情】（独立板块：有命中时 status=hit 行跨账号汇总表；无命中不出空表只一句「本轮无命中（规则：hit_rule 原文照抄禁自算换算成具体数字）」——用户实报宿主把「点赞 ≥ 均赞×1.5」自算成「≥1000」口径漂移；深扫 A3 线索>0 补一行计数）+板块四【下一步行动】不变；完成行深扫照抄条款换新文案「深扫：N 条最新作品的评论区 · 采到 M 条 · A3 线索 X 条（🟢🟠🟡⚪）」（引擎 ADAPTER 1.2.97 deep_scan 增 a3 四级计数配套——「A3 线索 X 条」=评论侧命中答案，深扫不筛命中目的=给作品卡建 A3 快扫底座）；纪律六条 ④⑤ 更新（增量禁自编→括号版/hit_rule 原文照抄禁换算）；现扫路径深扫行与 hit_rule 口径同款同步；扫对标作品表条款引用从「自查第 4 件」改「自查板块二」+7 天外帽行同款）。⭐R96cg 1.2.41→1.2.42：我的号不占对标位定版（⭐2026-10-28 用户实报「栗子对标，我的账号也占用对标的位置，是否合理」+追问「我的小红书怎么变成对标了」——AskUserQuestion 拍板「我的号不占对标位」：引擎回执侧已把 self 记录从对标段 items 排除+对标位计数=真对标口径（全库-self，位满判定同口径），SKILL 侧推翻 R96cc/R96cb 双段拉锯——对标段=真对标不再出现「·我的」行、历史误入对标段的我的号已被引擎自动清出禁当 bug 报禁自作主张加回、我的号由 self_accounts 独立行组呈现不计位、扫我的号完成行带「我的账号——未占对标位」行时同款照抄禁报「已入对标库」；「·已在对标段 #N」呼应括注体系整体废止）。配套引擎 ADAPTER 1.2.96。⭐R96cf 1.2.40→1.2.41：现扫深扫行照抄（流程 E 现扫回执新增「深扫：N 条作品 · 采到 M 条评论」行——快扫即采评论与插件监控页「扫描规则」同心智同设置（deepComments 默认开监控页可关），宿主照抄进交付；回执无该行=用户已关或全已扫过，不追问）。⭐R96cd 1.2.39→1.2.40：现扫巡逻交付补作品表（⭐2026-10-27 用户实报「栗子扫描对标，没有作品信息呀」——现扫降级路径只有【巡逻摘要】总览表（动态+爆款一句话），更新的作品明细看不到；而「栗子扫我的号」自查路径有每账号【近7天作品】表——两路径同源引擎（capture_profile 回执都带 latest_notes），数据在手上只差列出来）：①流程 E 步骤 5 改两段交付——【巡逻摘要】总览表保留+其后新增有动静号【近7天作品】表（与自查第 4 件同款：帽行 `**@账号名（平台）** 近 7 天 X 条 · 命中 Y 条`+`|#|作品|发布|赞|命中|` ≤7 行照抄 latest_notes，status=hit 显 ✅ 否则显 —）；②只有 🟢 有爆款/🟠 有更新的号列表——⚪ 无动静号 7 天没发新作总览行+优秀参考已够禁列表刷屏；多号都有更新按总览表顺序逐号各一张；全部 ⚪ 时作品表整体省略不提；③池有料路径已有作品表不动，两路径交付结构对齐。纯 SKILL 批（ADAPTER 不动）。⭐R96cc 1.2.38→1.2.39：对标库表双段呼应定版 1.2.38→1.2.39：对标库表双段呼应定版（⭐2026-10-27 用户复测拍板「如果对标和我的都有，怎么办？对标就不显示？」——推翻 R96cb「同名行挪出对标段」归组：双重身份账号两个身份都要可见，且对标段 4 行与对标位 5/8 对不上账要靠括注脑补）：①对标序号段 items 全量编号 1-N——同名行（自己的号曾加对标，与 self_accounts 同 platform+账号名）照常占位编号+名字「·我的」后缀，对标位 N/M=对标段行数直接对账；②我的段全量隔离行，与 items 同名的行括注「·已在对标段 #N」（N=该行在对标段的编号，两段呼应；纯 self 行不括注）；③同一账号两处出现是刻意呼应禁当重复删行；④未登录/无 self_accounts 字段时我的段整组不列，items 同名行照常留对标段加「·我的」后缀（无呼应行）；⑤对标账号库表+查对标库表两处同改+两模板示例改双段呼应形态。纯 SKILL 批（ADAPTER 不动）。⭐R96cb 1.2.37→1.2.38：对标库表分组显示规 1.2.37→1.2.38：对标库表分组显示规（⭐2026-10-27 用户实报「对标和我的混淆显示，一个显示为 -、一个显示为 1 号」——自己的号曾加对标时 items 与 self_accounts 同名，同名行被编进对标序号段、纯 self 行又用隔离行，两个「我的」口径不一）：①对标账号库表+查对标库表统一分组规——items 与 self_accounts 同名（platform+账号名一致）的行挪出对标序号段并入「我的」段只显一行（括注「·占对标位」，对标位 N/M 计数含它，对标段行数+占位行数=N 对账）；②对标序号段只列纯对标重编 1-N，禁把「我的」账号编进序号段；③纯 self 行不占位不括注，paused 行监控列显 — 禁恒 ✅；④未登录/无 self_accounts 字段时我的段整组不列，items 同名行照常留对标段加「·我的」后缀。纯 SKILL 批（ADAPTER 不动）。配套⭐R96ca 1.2.36→1.2.37：栗子关监控开窗（⭐2026-10-27 用户实报宿主「小米公司取消监控这一项我这边做不了——探栗没有提供『关监控』的接口」+拍板现在开工）：①触发词家族加「栗子关监控/取消监控 + 账号名」（动作化注册词，与栗子加监控对称）；②监控三件套（加监控/删对标/扫对标）段落补关监控分流句——关监控走本技能调 leadsradar_pause_monitor（只停监控不删对标，账号留在对标库），禁再说做不了；③对标表监控列口径注释补一句「monitored 已改云端 status 真源（本地布尔仅未登录兜底）」。配套：引擎 pause_monitor 任务+对标列表 monitored 改云端 active 键集（治图解万物「云端 active/本地 false」误显）+mjs 工具 leadsradar_pause_monitor（⭐R96by 1.2.35→1.2.36：本地扫描类极简定稿（⭐2026-10-27 用户拍板「栗子本地扫描类的都不要快扫，本地扫描就是一个核心目的，看一下有没有最新命中或者其他优秀内容，不要冗余的分析」：①自查交付六件→极简四件——完成行→表1 总表（去快扫列，|#|账号|粉丝|近7天/命中|）→表1.5 增量对比（保留）→每账号【近7天作品】表 ≤7 行（快扫三行组/自查三问/节奏行/爆在哪/一句话结论全退役）；②纪律五条→六条——快扫全砍（列/三行组/字符条/均赞赞粉比爆款数行）+分析段全退役（只报事实：最新命中✅+优秀内容高赞+增量）+回执 account_scan/quick_scan 字段本地扫描不读不展示（引擎为流程 B 顺带算的）；③现扫第4条逐账号三行→两行（命中行+优秀内容 TOP1-2 点名，更新频率/节奏评述/爆在哪不发）；④巡逻摘要爆款信号列删「均值倍数·爆在哪」只留数据事实；⑤引擎配套 latest_notes 7 天外补足改按赞降序（优秀内容优先）） ⭐R96bx 1.2.34→1.2.35：自查交付以命中为核心重排（⭐2026-10-27 用户实报「要以命中为核心去展示，且要展示每个账号的7天最新作品的列表，以及命中、增量相关情况，继续跟插件的本地扫描的展示结果对齐」+实收宿主拿会话记忆自创「增量对比表」/「学什么避什么」「一句话结论」退役段回潮；引擎 capture_profile 已补 latest_notes（pickStripHits 同款：近7天在前/命中置顶/上限7条 status=hit/obs）+week_count/week_hit_count+hit_rule（与监控页命中规则同源，默认 点赞≥均赞×1.5）+scan_delta 增量快照；SKILL 自查交付六件定版：完成行→表1 总表（近7天/命中列）→表1.5 增量对比（scan_delta 有才出禁自编）→表2 块（快扫三行+【近7天作品】表≤7行命中✅+节奏行）→自查三问→下一步行动；纪律五条（增：增量禁自编+快扫三行禁压一行）；流程E 第4条扫对标命中口径同步同源） ⭐R96bw 1.2.33→1.2.34：「栗子领取」退役换「栗子报告」（⭐2026-10-27 用户拍板「栗子领取改为栗子报告是不是更好？直接查看所有最新的生成 7 条报告」——AskUserQuestion 定版「领取+列表合一」）：radar 侧三处改词——流程 B-深 pending 领取行/流程 E 现扫领取行/深采 error 段的「栗子领取」全换「栗子报告」（语义=喊栗子报告拿报告，与 insights 同批全局改名 agent-tasks/index/connector 共 13 处引擎文案+mjs 20 处同步）；「栗子报告」合一入口语义见 claim_pending_result description（先领 pending 最新一份，无 pending 列 query_local_data(reports) 最近 ≤7 条一览）。⭐R96bv 1.2.32→1.2.33：扫描量可调开窗批 radar 侧两处（⭐2026-10-27 用户拍板「开窗也直接做了。扫描对标也一并调整了吧」——R96bu 预告的下批引擎开窗提前到本批执行）：①流程 E 现扫逐个采集 capture_profile(url, limit=30~50) 补「用户指定扫描量时按用户值传 limit（引擎白名单 1-300），默认 30-50 不动」——扫对标/扫我的号现扫路径同步生效；②流程 B-深 深采发起补参数口径（limit=深采条数 1-50 默认 20/comments_limit 每篇评论 10-100 默认 50，用户主动指定才透传默认不传）。引擎批：agent-tasks.ts executeTrackDeep 开窗三参数 sample_count 20-120/top_deep 5-30/comment_limit 10-100（track_deep 工具 inputSchema+dispatch 同步注册，本工具侧 radar 场景透传 limit 即可）。⭐R96bt 1.2.31→1.2.32：扫我的号自查交付两张表定版（⭐2026-10-27 用户实报两问——问1「你这个用的是我们插件本地扫描功能吗？怎么看起来不像」取证答疑：是——capture_profile 引擎真采+account_scan 快扫与插件监控页 classifyAccount 同源同引擎 source="plugin_classify_account"，连「推测·基于N条」都是引擎 basis 字段原文（surface-diagnose sourceLabel）插件端同款标注；问2「输出也跟之前说的不对，应该显示我的账号列表一个表格，命中之类的」实锤：R96br 咨询 6 拍板「两张表+命中✅+最多7条」当时只落了巡逻池路径，自查现扫路径漏定版——宿主自由发挥成逐账号大段块【账号详情两列表+快扫+TOP5+学什么避什么】无总览表、【自查三问】扩成三大段）：流程 E 尾「看我的号」一句话扩成自查交付定版——结构五件顺序固定先总后分：①完成行（耗时/号数/条数/名单来源云端+⚠️位满提示照抄追加）；②表1【我的账号】总表 |#|账号（平台）|粉丝|快扫|扫描| 每号一行（快扫列 icon+label 引擎没算显—禁自算；扫描列 ✅N条/⚠️原因；监控中括注）；③表2 逐账号紧凑块（快扫行组三行照抄 account_scan：icon+label+advice／流量分·线索分 20 格字符条+分数／均赞·赞粉比·爆款数 → 爆款命中表 ≤5 行 → 节奏一行；作品表一律 ≤7 行）；④【自查三问】自创段转正定版（爆款哪篇/节奏稳不稳/对标差在哪，各 ≤2 行只引真实数据，无横比数据就说本轮不横比）；⑤【下一步行动】2 句；纪律三条：「学什么/避什么」双段退役（学什么并入爆款表尾 1 行 ≤20 字）/快扫分数分类字符条全照抄回执禁自算/【账号详情】两列表退役。纯 SKILL 批零引擎改动，ADAPTER 不动。⭐R96br 1.2.30→1.2.31：名单来源统一+巡逻命中换 ✅（⭐2026-10-27 用户咨询「两个的名单来源不一样？为啥不保持一致？选择可靠的名单？不应该都在云端有保存吗？（包括目前的栗子对标，读取的名单不应该也都在云端吗？）栗子扫对标 vs 栗子扫我的」+「命中如何标注？✅️的emoji?」——AskUserQuestion 拍板「统一云端优先」+「两张表+命中换 ✅」）：①「栗子扫我的号」双层定位——先 query_local_data(source="accounts") 查回执 self_accounts（云端我的账号分段，引擎 ⭐R96br 已补透 url 主页链接字段），有带 url 的号直接扫（有几个扫几个，完成行注明「名单来源：云端我的账号 N 个」），未登录/名单空/行没 url 才要主页链接（同会话沿用不重复要）——与扫对标「先查池」同构，名单来源口径两端统一（云端真源=lf_monitor_targets self 分段）；②巡逻命中标注 🎯→✅——流程 E 池里有料段 status=hit 的行加 ✅ 前缀，与对标库表监控列 ✅ 同族（🎯 退役）。配套引擎 ADAPTER 1.2.87（self_accounts 透 url+account_deep 账号深度研究开窗，本批为引擎批须重载插件）。生效前提=重载浏览器插件+npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bq 1.2.29→1.2.30：自查注册词补宾语（⭐2026-10-26 用户咨询「栗子扫对标和栗子扫我的要不要分两个提示词/合二为一/名字能否优化」——AskUserQuestion 三拍板：①维持两词不合——意图歧义大且名单来源不同（扫对标读对标库/监控池零追问直达，扫我的本地不存用户账号首次必须要主页链接，合并成一个词退化成「扫谁」追问；管线本就流程 E 共享无重复维护成本）；②主词改「栗子扫我的号」——「我的」后缺宾语口语悬空，补宾语与「栗子扫对标」对仗；③研究类交付补行动区见 insights 2.3.3 同批）：frontmatter description/分流表自查行/流程 E 注册词行/确认交互行四处换词——「栗子扫我的号」为主注册词、旧词「栗子扫我的」同认不退役、自然语「看我的号/看看我的号」照旧。纯 SKILL 批次零引擎改动，生效前提=npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bo 1.2.28→1.2.29：深度探一下开窗+扫对标近7天口径（⭐2026-10-26 用户实报两条——「栗子研究 小红书 辅食」宿主只给轻量速览+编造预估分「要调用插件的账号深度采集，按钮就是叫这个名字，我要调用的是我插件的能力，不是让你临时搞些没用的」+「目前的扫描也是不对，没有最新的7天更新或者最新7条的展示」）：①流程 B-深开窗——注册词「深度探一下 <账号链接>」/「深度采集这个号」/「深挖这个号」→ capture_profile(url, deep:true[, limit 1~50 默认 20, comments_limit 10~100 默认 50])，与插件账号 Tab「深度采集」按钮同源同引擎（content deepCapture 协议：逐条详情+评论+A3 快扫+四分类深采修正版+近7天最新作品），5-20 分钟异步闭环 pending→「栗子报告」claim_pending_result（交付=完成行耗时/详情成功数/评论总数+【账号快扫】帽行两维分+A3 快控行+近7天最新作品表+学什么避什么；DEEP_PROFILE_FAILED/LOGIN_REQUIRED/COLLECT_BUSY 分类转述；pending 期间追问如实说还在采禁编阶段；快扫四档/两维分/线索率照抄回执禁编；采集互斥同会话等上一号领完再启）；输入分流表+职能语（深度采集/深挖这个号）+requires（leadsradar_claim_pending_result）三处落位；②流程 E 先查池再现扫——巡逻第一跳 query_local_data(source="monitor")（云端 lf_monitor_targets+lf_monitor_hits 与插件监控页同源，引擎已按插件折叠栏 pickStripHits 同款口径排好：近7天优先→命中置顶→时间降序上限 7 条，回执带 monitor_stats{targets_total,week_count,hit_count,by_account}+data 各条 in_week/status 标记）：池里有料直接交付「监控巡逻速报」不现扫（省额度秒回：完成行监控池 N 条·近7天 X 条·命中 Y 条+【巡逻摘要】by_account 分组表+近7天最新作品表 status=hit 行加 🎯；LOGIN_REQUIRED 转述栗子登录），池空/未开监控降级现扫原 1-5 步并注明「云端监控池没有数据本次为现场扫描」；「现扫现报定位」改双层定位+「暂无 Agent 查询通道」退役。配套引擎 ADAPTER 1.2.85（executeDeepProfile 深采引擎+query_local_data monitor 源+capture_profile deep 参数——引擎+SKILL 混合批次须重载插件）。生效前提=重载浏览器插件+npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bn 1.2.27→1.2.28：我的账号行组 paused 丢行根修（⭐2026-10-26 用户复测删对标通过后实报「我的账号，还有一个怎么不见了，我的小红书账号？」——删对标交付【对标账号库】表只列小米公司一条「我的」行，肖予暄（小红书·paused·0 粉）整行消失；引擎侧 agent-tasks self_accounts selfList.map 全量映射无过滤（status:"paused" 原样透出，肖予暄必在回执里）非引擎 bug，根因=SKILL 两处规则缺口——流程 F 第 4 条与第 5 条写死「我的账号自带云端监控恒 ✅」，宿主按模板没法给 paused 填 ✅ 就把整行丢弃）：①两处「恒 ✅」改按回执 status 映射——active 显 ✅、paused 显 —、空/其他显 —，paused 行可括注「监控未激活」；②钉死全量列出纪律——回执 self_accounts 有几行列几行，禁因 paused/粉丝 0 丢任何行（宁缺毋滥只管无字段整组不列，不管组内行丢弃）；③两处模板示例表各补一行 paused 形态「我的」行（`| — | 小栗同学（小红书·我的）| 粉丝 0 | — |`）教宿主两种形态。纯 SKILL 批次零引擎改动，生效前提=npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bj 1.2.26→1.2.27：删对标开窗+粉丝缺失三源反查（⭐2026-10-26 用户复测 R96bi 交付实报两条——反馈1「为什么有的没展示粉丝量呢？」附栗子监控交付表三处「粉丝 —」（梓悦爸爸做辅食/肖予暄·我的/小米公司·我的）；反馈2「删除对标的能力还没开窗？」附宿主自述「探栗给我的能力只有采集、查库、加对标开监控，账号删除是插件监控页的手动操作，没有删除接口」）：①流程 F 触发段补「栗子删对标 <账号名/链接>」「删对标」「腾对标位」（⭐R96bj 开窗）→走第 6 条删除路径；②第 6 条删对标路径新增——leadsradar_remove_benchmark(url 或 name，重名带 platform)，破坏性操作必须先确认（把账号名+平台+粉丝数+是否监控中报给用户确认一句，用户指令已点名且语义明确也不跳过确认，批量删除逐个确认逐个删），回执 message 照抄，ACCOUNT_NOT_FOUND 先查对标库核对账号名，删除交付轻量（完成行 `🗑️ 已删对标 ·「XX」· 平台（对标位 N/M）`+云端说明一行+【下一步行动】两选项（`栗子加对标 <新主页链接>` 加新号/查对标库核对剩余名单）+收尾语「删旧腾位，接着铺 🔍」）；③超限场景首项三处升级——流程 F【对标账号库】表下删除指引退役+【下一步行动】首项从「插件对标页删旧腾位（Agent 通道暂不支持删号）」改 `栗子删对标 <表里账号名>`（Agent 直接删：本地库+云端对标+本机监控三处同删），第 5 条查对标库超限口径同步；④纪律行改写——一次最多操作一个账号、批量对标/删除逐个来（删除逐个确认）、删对标走第 6 条三处同删、监控暂停/恢复仍指路插件监控页只读边界。配套引擎 ADAPTER 1.2.81（executeRemoveBenchmark 三处同删+粉丝三源反查自愈回写+self_accounts 反查兜底）。⭐R96bi 1.2.25→1.2.26：【对标账号库】四件套+栗子监控无上下文兜底+我的账号并入+监控=云端口径（⭐2026-10-26 用户实测反馈2「加入对标的，如果满了应该列举全部的对标对象，方便用户进行删除操作——增加一个【对标账号库】表格方式呈现，在下一步行动之前；如果单独发送栗子对标栗子监控，没有上下文的情况下，则也会呈现全部对标账号库的信息，包括我的账号」+反馈4「目前监控不存在本机监控中的监控，监控=云端监控，这类表述有误（本机监控中·云端 24h 未激活）」）：①流程 F 对标交付三件套升四件套——【对标账号库】全量表恒追加（不限超限场景），位置在【账号详情】后【下一步行动】前，`|#|账号（平台）|基础数据|监控|` 四列与第 5 条查对标库同款（monitored=true 显 ✅ 否则 —；>8 行照列不截断），数据=query_local_data(source="accounts", limit=200) 追加调用；回执带 self_accounts 字段时表末追加「我的账号」行组（每行 `| — | 账号名（平台·我的）| 粉丝 X | ✅ |`，我的账号自带云端监控恒 ✅；未登录/无字段整组不列不提宁缺毋滥）；超限场景（对标位 N>M）本表即删除操作依据——表下加删除指引「删旧腾位：插件 → 监控页（对标分段）→ 卡片右上删除」+【下一步行动】首项改 `插件对标页删旧腾位 ← 表里挑一个删`（Agent 通道暂不支持删号，删除在插件完成）；②「栗子监控」无链接无上下文兜底=查对标库全量呈现（含我的账号）——触发词总表+流程 F 触发段并列补；③第 5 条查对标库同步补 self_accounts 行组+超限场景下一步行动改写（首项=插件对标页删旧腾位+表下删除指引）；④监控=云端口径（用户拍板「不存在本机监控的说法」）——步骤 3 落规回执照抄「监控未激活（云端 24h 盯盘为会员权益）——在插件监控页点亮该账号胶囊可激活」/「已开启云端监控」，禁出现「本机监控」字样（R96bg「本机监控免费已开」权益口径整体退役——用户实报宿主压缩成「本机监控中·云端 24h 未激活」像已在监控、表述有误）；模板示例【账号详情】与【下一步行动】之间插入【对标账号库】表（含我的账号示例行）。配套引擎 ADAPTER 1.2.80（cloudNote 两分支重写+accounts 源 self_accounts 透出）。⭐R96bh 1.2.24→1.2.25：线索快扫措辞钉死（⭐2026-10-26 用户实测反馈3「小红书图文测试，怎么显示了多余的文字，且表述不一样？」——实报宿主三宗罪：plaintext 围栏孤行泄漏+标签改写「客户线索指数/内容流量指数」+帽行自创前缀「🧭 一眼判断：」并拼 A3 档位词「客资肥沃」）：①帽行三件外零附加——禁加「🧭 一眼判断：」类自创前缀、禁把 A3 率档位词（线索富矿/客资肥沃/线索可挖）拼进帽行，A3 率归统计行括注、帽行只管双轴四分类；②双指数条措辞照抄钉死——两行标签只用「流量」「线索」两词（禁「客户线索指数/内容流量指数」等改写）、流量行在前顺序不变、字符条一律普通文本行直接输出禁包三反引号代码围栏（plaintext/text 等围栏语言标记会被部分宿主渲染泄漏成「plaintext」孤行文字）；③模板区帽行乱码修复（💎 双高型）。配套引擎 ADAPTER 1.2.79（douyin.ts 互动数 document 级唯一性兜底，抖音图文四分类透出的数据前提）。⭐R96bg 1.2.23→1.2.24：对标与账号速览三修（⭐2026-10-26 用户实测反馈三条——①「学什么和避什么回行展示，不要挤在一起」②「这个对标位置12/8?超出上限了还能添加？」③「开监控是否考虑到我的权益？我这账号貌似没权益啊」）：①**学什么/避什么分行**——流程 B 结论铁律两短句各占一行 `- ` 列表项（与赛道总览 R96ae 分行铁律同规：markdown 单换行必合并挤成一行，列表项宿主漏空行也各自成行），模板示例同步改两行；②**对标位超限警示**——流程 F 步骤2补超限存量口径（回执带「⚠️ 对标位已超限 N/M（历史存量）」照抄——存量账号在库可用但新号已加不进，R96ap 位满闸门拦新不删旧）+完成行超限场景（照常 N/M+警示句另起一行，禁把已入库改报失败）+查对标库库况行 N>M 追加警示；③**开监控权益口径说清**——步骤3补「开监控交付必含一句『本机监控免费已开（浏览器开着时自动巡逻）；云端 24h 盯盘是会员权益未激活』」（本机/云端是两个东西，只说未激活不说免费已开会让用户误以为开了不该开的权益）。配套引擎 ADAPTER 1.2.78（add_monitor 两分支+查对标库 accounts 源超限警示+cloudNote 权益口径四改）。⭐R96bf 1.2.22→1.2.23：下一步行动存选题升位（⭐2026-10-26 用户实测反馈1「探一下 小红书视频通过，小瑕疵，下一步行动第一推荐应该是存选题」）：流程 A【下一步行动】岔口改版——**栗子存选题升默认首位**（`栗子存选题` ← 好内容先进弹药库）+「栗子研究」次位（看完快扫最自然的下一步是先进弹药库）；**加对标退役出 A 岔口前 2**（用户真要再说）；唯一保留的岔口=自己的作品或 A3 信号强（A3 率 ≥30% 或 🟢≥5 条）→「栗子触达」首位+「栗子研究」次位不变；模板示例同步（存选题/研究两句）。纯 SKILL 批次零引擎改动。⭐R96be 1.2.21→1.2.22：账号快扫两处去重（⭐2026-10-26 用户复测 R96bd 后实报三问题：①「账号快扫，展示还是不太对，这俩都没按照规划的方式呈现，你看看探一下关键词是为啥可以做到」——用户实测【账号快扫】仍是「依据/最爆/建议」旧三行骨架且帽行带「· 不建议对标」尾巴，根因诊断=引擎字段是新的（实测依据行已出现「流量分 57 · 线索分 40」证明 traffic_score/lead_score 已透出）但宿主技能页 SKILL 还是旧版（1.2.19 及更早格式）——「探一下<关键词>」赛道总览能成是因其字符条格式规则在旧版技能页就有；②「这个应该加入学什么里面去展示，目前也是比较重复的：最爆：…」；③「这个也有点重复了，· 不建议对标；建议：不建议对标」）：①**最爆行退役并进「学什么」首句**——列表块第四行「最爆：标题截 10 字+👍数+均值倍数+爆在哪」删除，学什么首句=爆款点名（标题截 10 字+👍N+对近期均值倍数 1 位小数+爆在哪半句）后续短句再补什么内容在吃流量，各 ≤40 字（原 ≤30）；②**帽行禁拼行动词尾巴**——帽行=`{icon} {label}（{basis}）`三件外再无其他，「重点对标/不建议对标」类行动词只在建议行 advice 原文出现一次；③列表块四行砍三行（流量分/线索分/三大数据）；④旧插件兜底 emoji 查表改**纯 emoji 表**（monetization=💎/marketing=🎯/traffic=🚀/lowvalue=💤，只查 emoji 不拼行动词）+「只出帽行+建议行」。纯 SKILL 批次零引擎改动，生效前提=宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开（无需重载浏览器插件）。⭐R96bd 1.2.20→1.2.21：单篇快扫四分类帽行+双指数条（⭐2026-10-26 用户指认「单篇快扫也是有四类Emoji类型的呀！你在研究下单篇快扫还有哪些，是否需要展示」——研究实锤插件端单篇快扫卡本就有与账号四分类同族同源的双轴四分类（CommentScanView calcTrafficIndex×calcNoteLeadIndex→classifyNoteQuadrant：💎双高/🚀流量/🎯线索/💤双低），引擎 quick_scan 一直没透出宿主说不了「这篇是💎双高型」；AskUserQuestion 拍板「四分类为主+A3率并入统计行」「双指数20格字符条」）：①流程 A【线索快扫】帽行升级四分类 `{icon} {label} · 流量 N / 线索 N`（quadrant_icon/quadrant_label/traffic_index/lead_index 照抄禁编）+帽行紧跟双指数 20 格字符条两行 `- 流量 █░×20`/`- 线索 █░×20`（与账号快扫两维评分条同款算法，不带数字尾巴——帽行已有分数）；②A3 率四档自帽行降级并入统计行括注 `N%（🟠 线索可挖）`（R96bc 帽行体系退役为兜底）；③无 quadrant 字段兜底（旧插件/AI 跳过 note_detail 反查不中）：帽行退回 R96bc A3 率四档、双指数条省略——步骤 1/3 落规「先 note_detail 再 capture_note_comments 的固定顺序就是为让 quadrant 命中，跳步=自己丢四分类」。配套引擎 ADAPTER 1.2.75（详见其注释）。⭐R96bc 1.2.19→1.2.20：账号快扫学赛道总览+单篇快扫同理（⭐2026-10-26 用户复测 R96bb 后实报「目前还是不太对，没有展示两维评分，也没展示三大数据，学一下探一下<关键词>的赛道速览的表达方式，另外4类的EMOJI也再策划设计下（探一下单篇的快扫同理）」）：①流程 B【账号快扫】学赛道总览逐段同构——判定帽行 `{icon} {label}（{basis}）` 独立段（对位「🔵 蓝海词（预估）」）+ `- ` 列表块四行：流量分/线索分 20 格字符条（对位需求分/竞争分，两维即四分类依据：流量≥60 且线索≥72=双高型）+三大数据行「均赞 N · 赞粉比 N% · 爆款 N/M」（对位「集中度·均赞·最爆」）+最爆行（爆款点名解读保留）+建议行 `→ {advice}` 独立段（对位「→ 建议立即切入——」）；旧「依据/最爆/建议」三行列表块退役（basis 挪帽行括注）；②四类 emoji 对齐插件端 surface-diagnose CATEGORY_MAP 定版：💎双高型/🎯线索型/🚀流量型/💤双低型（全端同源；旧版帽行写死 🎯 与线索型专属 emoji 撞车）；③流程 A【线索快扫】同理——加判定帽行 `{档位emoji} {判定词}（A3 率 N%）`（≥30%=🟢线索富矿 / 10~29%=🟠线索可挖 / 3~9%=🟡线索偏薄 / <3%=⚪噪音为主，A3 率照抄禁编）+A3 统计行 A3 率画 20 格字符条（与赛道总览分数条同款算法）；④旧插件兜底：account_scan 无 traffic_score 字段时分数条两行+三大数据行整行省略不编。配套引擎 agent-tasks.ts account_scan 透出 icon/traffic_score/lead_score/avg_likes/like_follower_ratio/hit_count（详见 ADAPTER_VERSION 1.2.74 注释）——需重载插件生效。⭐R96az 1.2.18→1.2.19：账号展示「基础数据」并一行+全端账号结构同构（⭐2026-10-26 用户反馈「这个也展示在一行，改为基础数据：粉丝6.2万、赞藏30.3万」「注意抖音平台也要适配，抖音是点赞吧」「其他的账号也按照类似结构来」）：①流程 B【账号详情】紧凑四行版——粉丝/赞藏两行并成「基础数据」一行 `| 基础数据 | 粉丝 6.2万、赞藏 30.3万 |`（顿号分隔；标签随平台：小红书=赞藏、抖音=获赞（抖音主页官方口径叫获赞，全端统一标准同款）；哪项有值写哪项、全无省整行禁编），模板同步；②「其他账号同构」三处——流程 F 对标交付表紧凑五行版（账号名（平台）并一行+基础数据并一行+对标监控合并行 `已入库 ✅（未开监控）`/`（监控中）`，旧八行：账号/平台/定位/粉丝/获赞/更新节奏/监控/对标）、查对标库清单表四列 `|#|账号（平台）|基础数据|监控|`（旧五列平台/粉丝并拢）、C1 代表账号 TOP5 五列变体 `|#|账号|命中|基础数据|总赞|`（粉丝/赞藏并一列缺项省略）；③纯 SKILL 展示层改版零引擎改动（数据链 R96ay 已修常态有值）。⭐R96ay 1.2.17→1.2.18：账号速报三改（⭐2026-10-26 用户实测「探一下账号」三反馈）：①【账号详情】紧凑五行版——账号名+平台并一行「陆婷LT（小红书）」（用户拍板「账号名和平台可以展示在一行，名字（平台）这样的，避免账号详情太长」）+对标监控合并行 `| 对标 | 已对标 ✅（未监控） |`（用户拍板「对标和监控合并为一个，监控采用括号的形式展示，如已对标√（未监控）」，monitored=true 括「监控中」、false 括「未监控」、无 account_stats 括号省略只写「已对标 ✅」），平台/监控独立行退役旧七行砍成五行；②过程插曲零叙述+收尾禁令全流程化——公共骨架收尾条加两条硬禁令：收尾交付语即全文最后一行之后一个字都不能有（自流程 A 模板纪律上移通用化，用户实报流程 B 收尾语后又跟「账号速报已交付：@XX 是…爆款是…」整段收尾重复）、连接闪断重连/重开浏览器窗口等运行细节一律不进交付文案（用户实报「（小插曲：探之前插件连接闪断了一次，我按指引重开了装插件的浏览器窗口已恢复…）」整段多余——异常仅在实际影响交付物缺失时 ⚠️ 一句）；③引擎侧三修配套（详见 ADAPTER_VERSION 1.2.70 注释）——scratch tab 时序空壳根治后粉丝/赞藏常态有值、account_scan 四分类（双高型/流量型/线索型/双低型）常态返回，【账号快扫】板块随之常态出（用户反馈2 澄清「双低型、线索性、流量型这类」即指账号四分类结论）。⭐R96ax 1.2.16→1.2.17：速报过程文案瘦身（⭐2026-10-26 用户拍板「这类文案有点多余，包括复核什么的，这些过程不要过度展示；这个过程消息也可以不要」）：①复核静默化——流程 A 第 3 步复核动作保留但「复核过程零展示」落规（增减静默并入四宫格计数，A3 统计行/收尾禁「已人工复核样本：X 条误报降档、Y 条升入 🟢」类过程自述）；②A3 统计行收尾硬化——以「插件规则引擎判定（词库可解释，非 AI 评分）」收尾其后禁接复核尾巴；③模板纪律加「收尾交付语即全文最后一行，之后一个字都不能有」——用户实报收尾语后又跟「线索速报已交付：快扫 200 条评论…最值钱的发现…建议下一步…」整段总结复述（三重冗余：计数四宫格已给/发现解读段已给/建议行动区已给），与创作栗 R96ac「指引行后零输出」同规。同批引擎修复 ⭐R96aw 小红书视频封面零落盘（详见 ADAPTER_VERSION 1.2.69 注释）。⭐R96au 1.2.15→1.2.16：流程 A 速报评论表格化+四宫格重排（⭐2026-10-25 用户指令「评论数据改用表格形式展示A3和A2」「评论区需求总结压缩到一段放在A3评论后面」「【评论展示】展示具体评论、A3还有点赞量」「【线索快扫】包括四宫格、A3统计和评论区解读」+数量策略「优先展示A3和A2，数量太少或太多要有折叠机制/展示的上限」）：①【评论数据】栏目退役→【评论展示】——具体评论三列表 `| 档位 | 评论 | 👍 |`，行序 🟢→🟠→🟡 档内按 👍 降序，🟢 行带序号（1.=最优先跟，跟单名单进表格——推翻 R96k「跟单名单不进表格」旧规，公共骨架表格规则同步开例外口）、🟠🟡 例句不带序号、⚪ 不进表、无 👍 显「—」；②展示上限（太多防刷屏）：🟢 ≤5/🟠 ≤3/🟡 ≤2 超出按 👍 截断，全量在插件面板四宫格计数对账；下限（太少防虚胖）：档内不足照实全列不凑数，A3（强+弱）合计 <3 条表后加「A3 样本薄（N 条），以下判断供参考」不引导扩扫；③【线索快扫】重构三件套顺序固定——四宫格表（四档计数表从旧【评论数据】挪入，quick_scan 照抄+🟢 计数加粗）+A3 统计行（A3 率+判定话术+透明化溯源）+评论区解读一段（≤3 句放 A3 评论与统计之后，收编旧「信号点评」职责）；④旧温度计字符条+分档例句散列退役（分布归四宫格表、例句进【评论展示】表）；⑤模板示例换用户实测马尔代夫案例，小标题组合行/模板纪律同步。⭐R96as 1.2.14→1.2.15：触发词动作化（⭐2026-10-25 AskUserQuestion 用户定版五注册词「栗子存选题、栗子加对标、栗子扫对标、栗子加监控、栗子扫我的」——动词+对象自明，旧词栗子入库/栗子对标保留兼容仍认、报到菜单展示新词）：①分流表三行落注册词——「栗子扫对标/扫一遍对标/谁更新了」=巡逻（流程 E）、「栗子扫我的/看我的号」=自查（流程 E 自查视角）、「栗子加对标 <主页链接>」/「栗子加监控」=对标管理（流程 F）；②流程 E 定名单+确认交互落规——给了链接/名单直接用、点名扫「栗子扫对标 @某某」只扫指定号、没给则 query_local_data(source=accounts) 读对标库，名单 ≤5 个号默认全量直接开扫（每号占采集额度 1 次）、>5 个号先确认「对标库 N 个号，全扫约 X 秒 · 占 N 档采集额度——全扫还是点名几个？」，「栗子扫我的」本地不存用户平台账号→首次要主页链接同会话沿用；③流程 F 标题+触发段换注册词；④四岔口/流程 B/C1 下一步行动等 9 处旧词替换。⭐R96aq 1.2.13→1.2.14：账号数据双修+对标交付三改（⭐2026-10-25 用户实测「探一下 小红书@陆婷LT」+「栗子对标 @陆婷LT」五反馈）：①账号级数据双根因修复——两平台列表采集 note 恒不带 follower_count/total_likes（引擎四分类取 notes 粉丝恒 0→account_scan 恒跳过+【账号详情】恒无粉丝行，用户实报「账号详情没有粉丝量和赞藏」「账号快扫还没有」），content 两侧挂头部指标（小红书 collectXHSAccountNotes 从 acctState.fans/interaction 解析、抖音 collectDouyinAccountNotes 读 user-info-fans/user-info-like+label 兜底），引擎 profile_posts 回执新增 account_stats{followers,totalLikes,noteCount,monitored}（monitored 查对标库 URL 归一匹配，旧库记录重采一次自愈）；②【账号详情】表全端加状态维度（用户拍板「是否加监控、是否加对标要成为这个账号详情表格中的一个状态维度。但是后面就不要再显示了」）——流程 B/F 表格统一 +`| 监控 | 未开/已开 ✅ |`+`| 对标 | 已入库 ✅ |`（位满例外「位满未入 ⚠️」），散文监控行全退役（旧插件无 account_stats 省监控行）；③【一眼结论】散文板块退役→【账号快扫】挪位扩行（用户拍板「账号快扫还没有，格式模仿赛道总览，替换掉这个板块；学什么和避什么不错保留在账号分析后面」）——快扫从【账号详情】后挪到【作品数据】后（原一眼结论位），列表块两行扩三行：依据（basis 照抄）/最爆（爆款数据收编：标题截 10 字+👍数+对近期均值倍数 1 位小数+「爆在哪」半句）/建议（advice 照抄），学什么/避什么两短句紧随其后不带【】小标题；④对标完成行合并确认行（用户实报「✅ 完成 · 已入对标库」与「✅ 已入对标库」两行重复）——`🌰 **情报栗**：✅ 已入对标库 ·「XX」· 平台（对标位 N/M）——` 单行带确认，已开态「监控：已开 ✅」状态散文行退役（状态进表，行动区只留行动）。配套引擎 content×2+agent-tasks×1，需重载浏览器插件生效。⭐R96ap 1.2.12→1.2.13：对标三改（①对标场景专用收尾语「对标入库，接着铺 🔍」——用户判「情报到手，接着挖」的「挖」是线索语境对标不贴切，通用版仅用于采集流程 A/B/C1/E；②查对标库开窗——不带链接的「栗子对标/查对标库/谁在监控中」→ query_local_data(source=accounts, limit=200)，交付=库况行（对标库 N 个账号 · 对标位 N/M，引擎 accounts 源回执 message 附送）+|#|账号|平台|粉丝|监控|清单表（monitored 列即监控名单不另开）+下一步行动两选项；③对标位满撞墙落地——引擎 capture_profile 位满预判照采不入库（新账号 records>=cap 时跳过入库，message ⚠️ 明说「未入对标库+删旧/升级出路」），SKILL 落规禁报「已入对标库」——根因：位满唯一硬闸本是服务端 400 仅面板链路有，Agent 通道云端上传静默吞错+本地入库无闸，位满 8/8 照样报成功且本地超 cap 显示 9/8）。⭐R96ao 1.2.11→1.2.12：对标交付三改（①【账号详情】补粉丝/获赞行——插件端 add_monitor 回执新增 data{followerCount,totalLikes,noteCount,benchmark{count,cap}}，宿主双源取回执优先；②确认行尾缀（对标位 N/M）——用户拍板「可加对标的上限要展示」，N=已用 M=上限从回执 benchmark 抄，旧插件无回执不带括注；③散文监控行退役并入【下一步行动】编号短句行——未开→1.开监控 2.探一下，已开→状态行+1.探一下 2.栗子对标）。⭐R96al 对标交付轻量化（⭐2026-10-24 用户实测「栗子对标 我是十四哦」三反馈：①对标是入库不是采集——流程 F 禁复用流程 B 整套采集交付（用户原话「加入对标要不要也发这么多内容？又是分析又是那个感觉像采集一样」——【作品数据】20 条表/【一眼结论】/学什么避什么/【下一步行动】四样都不发），对标交付=确认行+【账号详情】表+监控行三件套；②确认行主体=账号本身 `✅ 已入对标库 ·「我是十四哦」· 抖音`——消歧「近 20 条加入对标库」误读（用户原话「这个到底是啥意思啊？不是把这个账号加到我的对标吗？」——入库的是账号，20 条只是采集顺带的数据，作品条数不进确认行）；③【账号详情】两列表直接内联进流程 F 防走样（用户实报对标路径宿主仍写一行长文本——流程 B 定版格式在 F 路径强度不够，F 内自带格式+模板）+新增定位行（从作品标题一句话提炼 ≤10 字，对标者最关心「这是个什么号」）+对标场景去「默认采了最近 20 条」括注（条数是内部参数非交付信息）；④对标完主推开监控（用户问「对标完了…任务应该是什么你觉得？」——入库是静态、监控才是持续学：未开则「说『开监控』让它一更新就知道」）+句尾轻指路「探一下 <主页链接>」看作品数据——账号速览全套在探一下那边，对标交付不预支；账号深度研究不主动推（会员权益+批量对标场景逐个推研究太贵），原步骤 4「顺手价值·account_scan 四分类连着说」随轻量化退役）。⭐R96ag 账号速览 B 流程四改（⭐2026-10-24 用户实测抖音「李子柒」账号采集四反馈）：①【账号详情】一行长文本→两列标签表（学【作品详情】同款全端统一——账号/平台/粉丝/赞藏/更新节奏各占一行，数据没有不列行禁编）；②快采口径——profile 列表快采默认只带回 👍 是设计预期，三列表 `|#|标题|👍赞|` 即正常形态，禁「评论/收藏数这次没采到」「先给 👍 口径」类意外表述（用户原话「如果是意料之中的，不应该说是本次没有采到，不然给人感觉好像是出了意外」；用户要评/藏时说明需逐条深度采集）；③账号快扫接入——返回带 account_scan 就出【账号快扫】独立栏目（格式学赛道总览：判定词组帽行 `🎯 双高型 · 重点对标` + `- ` 列表块依据/建议两行照抄 basis/advice；无 account_scan 不出也不提——插件侧列表卡没带回粉丝数自动跳过四分类是常态非意外）；④【下一步行动】全端去链接（用户原话「不要等我测试一个一个改呀，其他的下一步行动都直接改一下」——A/B/C1 模板+四岔口+触达句共 7 处链接占位全清，指令只写指令词，同会话回喊默认取最近交付对象，与创作栗同规）+顺手补开工语/完成行/区块/收尾语空行铁则（用户实报开工语与完成行连排「🔍🌰」，markdown 单换行必合并）。⭐R96ae 结构性分行定版（用户三报「赛道总览的竞争分和后面的柱状图依然没有回行」——探一下抖音「AI变现」实测复现）：R96ab「段间空行」+R96ac「空行防呆自查」两轮软约束宿主均未执行（漏敲空行→markdown 单换行合并→两条分数条挤行折行错位），弃叮嘱改**列表语法硬约束**——需求分/竞争分/三指标三行一律 `- ` 列表项连排成一个列表块（CommonMark 列表相邻行天然逐项分行，宿主漏空行也合并不了；判定词仍独立段作组帽，建议话术/线索提示行维持独立段），规则两条+示例段同步列表化。⭐R96ac 复测两改（用户反馈）：①判定词上置组帽——用户拍板「红海词应该显示在两个分数上面」，🔴/🔵 判定词统领两条分数居【赛道总览】最前（推翻 R96ab「判定=分数的结论紧随其后」排序），新结构：判定词行→需求分行→竞争分行→三指标行→建议话术行→线索提示行；②空行防呆——用户实报竞争分仍与需求分挤一行（宿主丢了段间空行）：规则改为「段间必须空一行=敲两个回车，宿主输出前自查两条分数条之间必须看到空白行，丢了补上再发」；C1 模板赛道总览段同步重排+线索提示行与建议行之间补空行。⭐R96ab 测试1+测试2 复检四改（用户反馈）：①开工语贴任务不喊口号——R96n 口号开工语「✅ 收到！探一下，线索不错过 🔍」作废（用户原话「第一句话不用这个口号，而是根据具体任务来的，以免造成误解」），改 `✅ 收到！这就探<实际对象> 🔍`（作品链接=这篇/账号=这个号/关键词=「AI获客」/巡逻=巡逻对标；slogan 只住管家栗报到菜单不进任务话术——与 R96o 创作栗「口号是能力名片」拍板同向）；②开工语与完成行之间零过程旁白（用户实报测试1 输出「先确认雷达连接，马上开探：」「✅ 雷达已连接，开探…顺手查一下本地关键词库」全是过程叙述——R96i 实查不出声延伸到任务执行全程：连接确认/工具调用/查库比判定等中间步骤一律不发话，开工语→完成行→交付物直连，仅异常时 ⚠️ 一句问题+下一步）；③收尾语换文案——「雷达待命，下个目标随时发 🔍」→「情报到手，接着挖 🔍」（用户原话「这个文案不够好，需要优化」——对仗创作栗「素材到手，参考着拍 🎬」句式=交付物到手+拿着它干什么；仪式条/骨架条/A 模板/C1 规则/C1 模板五处同步）；④赛道总览分组+回行（用户实报手机上需求分/竞争分两条柱状图挤成一行——根因=markdown 单换行渲染合并同行）：需求分行→（空行）→竞争分行→（空行）→判定词独行→（空行）→三指标独行（集中度/均赞/最爆纯文本）→（空行）→建议话术行——用户拍板「红海词和两个分数一组，三个数据一组」，判定词=分数的结论紧随其后、三指标=原始数据独立成行，每行独立成段行间必须空行。⭐R96aa 测试2 四改（用户复检：①作品详情显示「想一想办法」→AskUserQuestion 拍板**两列标签表**（推翻 R96x 上下结构/R96y 空行分段三轮摇摆——R96y 原话「按照表格的形式显示」即要表格：宿主对加粗独行+空行执行不稳，表格边框自带分区渲染最稳，长标题在内容列自动换行不撑爆；标题放表头行=表头自带加粗不依赖宿主执行 **）三行两列 标题/来源/互动，与 creator【作品信息】同款全端统一；②删 C1【采集速报】总标题行（用户「完全冗余」——完成行已含平台+词+条数，直接从【采集作品】起）；③赛道总览重排（用户「集中度/均赞/最爆不适合与需求分/竞争分并列」+「红海词也展示在纯文本里」）——字符条只画需求分/竞争分两行，集中度/均赞/最爆不画条与判定词合并一行纯文本（判定词 ### 大标题退役）；④【下一步行动】全流程三砍二（用户「只保留 2 个，其他也是同理」——A/B/C1/E 骨架+岔口+模板全改两句））（R96y 收尾栗子发言五处+作品详情空行分段，见前——空行分段条款已随 ① 表格化退役）（用户问「其他地方的单片展示也要同步遵循这个样式吗？多作品展示怎么办」三拍板：①A 流程【作品详情】五列窄表→上下结构——标题**加粗独行**（原样不截断自然换行）+meta 一行 `作者 · 平台 · 类型 ｜ 👍 N · 💬 N · ⭐ N`（与创作栗交付同款全端统一；推翻 R96n 两列表——抖音标题百字塞表格列必撑爆；数字基础不加粗、评赞比 💬≥👍 一半时加粗评论数——信号语义保留与 C1/B 同规，区别于创作栗全加粗强调；抖音行尾加 · 🔁 N）②多片维持五列表+标题截断 ≤18 字（C1/B 不动——信息密度决定形态：单片=完整阅读不截断、多片=快速筛选可截断，20 条上下结构 40+ 行刷屏没法扫视）③洞察栗/成交栗已是标题独行形式天然合规零改动）（用户拍板「我刚才不是说让你把所有的都按照类似要求统一吗？你是改了情报栗？其他的也都要改的」）：【下一步行动】三句独立 code block 退役改「编号短句行」——`1. `栗子研究 <本作品链接>` ← 拆这篇钩子打法`（指令 inline code+理由 ← 同行右侧，3 行收不铺高；理由 ≤8 字动宾短语，禁复述前文数据与长解释——数据正文已给，行尾只留「干这件事图什么」），A/B/C1/E 四流程模板统一改（推翻 R96j/R96n-复测「每句独立 code block」口径，与 helper 报到菜单同规；岔口排位不变、「最该干的一件」永远首位）（1.2.2=⭐R96n slogan 用户定版+详情表两列分开两改（用户复测三反馈）：①开工语换用户定版五句——情报栗「探一下，线索不错过 🔍」/洞察栗「获客方法，一探便知 🧠」/创作栗「获客视频，一键生成 🎬」/成交栗「线索成交，一触即达 💰」/管家栗定位「经营你的AI获客团队」——五句全锚「获客」主张、首尾串联=完整获客漏斗（探线索→知方法→产视频→达成交，管家栗经营全队），「探/触」品牌动词嵌入（推翻 R96m 职能核心词版：用户版把产品卖点写进口号，层级更高）②A 流程【作品详情】表格改标题/作者两列分开（`| 标题 | 作者（平台·类型） |` 两框各自独立——推翻 R96m 一体式首列，用户拍板「标题和（作者·平台·类型）两组分两个框显示」；多行列表 C1/B 维持首列一体式省列宽；抖音加转列 6 列为该场景例外）（1.2.1=⭐R96m slogan 体系+样式统一+评论分档+理由极简四改（用户复测六反馈）：①开工语 slogan 体系定版（用户判「雷达转起来 🔍」傻，要求每栗与核心词挂钩）——四栗口径：情报栗「目标锁定，开探 🔍」（探=品牌动词+雷达锁定感）/洞察栗「开拆，看门道 🧠」（外行看热闹内行看门道俗语底）/创作栗「下料，三件套这就齐 🎬」（下料=备料动词，三件套=存选题/下素材/提文案）/成交栗「捞单去，话术随身 💰」（捞单=获客行话，话术随身=交付物名片）②作品类表格首列=「标题（作者）」一体式样式统一（A 流程《标题》题注+作者单列窄表与 C1「标题（作者）」分叉消除——作者不再与标题分家；单行记录标题不截断自然换行，多行列表维持截 18 字）③A 流程【线索快扫】分档原始评论按点赞降序（🟢 strong_sample 全列 ≤5/🟠 weak_sample 高赞 ≤3/🟡 痛点典型 ≤2 新增/⚪ 不列原文只计数；50 条全量不铺开——全量在插件面板「评论/线索」弹窗）+横幅透明化必带「插件规则引擎判定（词库可解释，非 AI 评分）」（用户问「是不是 AI 编的/数据假的吧」——快扫是插件规则引擎按客资词库判的可解释分级，MCP 重采同作品 50 条实证 A3 率 42%=(10+11)/50 算术自洽真实）+A3 率照抄 quick_scan.a3_rate_pct④下一步行动理由极简 ≤8 字动宾短语（「← A3 率 42%，换到你自己的作品评论区挖客户」→「← 换自己评论区挖客户」级，A/B/C1 三模板九处统一改，禁复述前文数据）（1.2.0=⭐R96k 呈现公共骨架定版+A 流程四栏目重构：①呈现公共骨架（全采集流程 A/B/C1/E 同构——骨架四段：开场双行/对象详情段/核心数据段/【下一步行动】+收尾交付语「雷达待命，下个目标随时发 🔍」；小标题统一【】样式禁①②③编号——A=【作品详情】【评论数据】【线索快扫】【下一步行动】/B=【账号详情】【作品数据】【一眼结论】【下一步行动】/C1=【采集作品】【赛道总览】【代表账号 TOP5】【下一步行动】/E=【巡逻摘要】【下一步行动】；什么时候用表格：多条同构记录一律表格、分数与占比对比用 20 格 █░ 字符条、判断/建议/跟单名单短句行不进表格、单对象元信息一行题注+窄表——用户拍板「公共底层逻辑一次定齐全端，不要等逐个测」）②流程 A 整段重构（四栏目：作品详情一行题注+窄表/评论数据四档分布表/线索快扫温度计字符条复刻插件快扫观感——每档一行 emoji 档名 █░×格数 条数、🟢 优先跟最多 5 条/A 岔口排位：自己的作品或 A3 率≥30% 或 🟢≥5 条触达首位、评赞比异常/断层爆款打法值得学研究首位、默认对标首位）③转发列守卫（全端统一：小红书全链路不显示不导出转发——shareCount=分享按钮次数非转发指标，仅抖音给转列 0/null 显「—」）④B 栏目化【账号详情】【作品数据】【一眼结论】+条数声明砍「要加减说一声」（与 C1 同规）+C1 小标题①②③→【】+E 巡逻摘要短句行→三列表格（1.1.9=⭐R96j 复测三反馈：赛道总览字符柱状图版六列判定表退役/「下一步行动」三句分别复制独立 code block 纯提示词/砍收尾钩子）（1.1.8=⭐R96h 复刻插件快扫三栏目+「下一步行动」三句可复制：C1 重组「①采集作品+②赛道总览+③代表账号TOP5」——判定词/建议话术/结构与插件关键词卡逐字同源（🔵🔴🟡⚫ emoji 复刻插件 SVG 四宫格观感；判定算法轻量预估与插件阈值同向：需求分=量级分+评赞比异常加成、竞争分=100−集中度×0.8，keywords 源查到插件判定则整行照抄）；「立即行动」更名「下一步行动」=三句推荐提示词 code block 直接复制（栗子入库/对标/研究，四岔口推荐位排首位注明理由）；C2 四段模板退役并入 C1（1.1.7=⭐R96g-2 对勾新质+一表一判一行：状态符号定版 ✅=就位/成功、⚠️=异常（每次就位或成功必打 ✅ 形成新质）；完成行一句话=花了什么+产出了什么（成本只念有感知的：耗时为主，免费采集不念额度——「占采集额度 1 次」口径废弃）；C1 砍长篇结论段改速判表 |判定|证据| ≤3 行+收尾「立即行动」全端更名（B/C1/C2/E 四处，原「今天最该做的一件事」）；C1 砍时间戳与「默认N条要加减」重复声明（1.1.6=⭐R96g 赛道速览 v2：数据准备三步+四段模板+四岔口决策树只推一件）
  insights: "2.5.0",
  // ⭐R96gba~gcf 2.3.7→2.3.12 五连跳：gba 主副词归位（菜单指令栏=主词唯一真源）+gbb 四主词拆解（研究×作品/账号/关键词+复盘）+gcd 栗子报告统一动作词/复盘两出口+gcf 四主词专属同义词（拆解/研究一下这个号/研究一下<关键词>/复盘我的账号，禁「无专属」空挂）｜⭐R96bw 2.3.6→2.3.7：三报告领取瘦身+栗子报告合一入口（⭐2026-10-27 用户三问复盘赛道报告领取实收——问1「结尾这个也比较冗余，赛道机会的简介是否跟保同源的素材；后面的素材是不是都删除，直接引导用户去web端看就行了？栗子领取改为栗子报告是不是更好？直接查看所有最新的生成7条报告」+问3「三大报告是否能正确触发全量报告能力，中间是否有断点」取证两断点：①宿主为凑「说人话三个发现」自查本地库只找到 10-26 历史搜的 15 条旧笔记拿旧数据验证新报告——根因=引擎 executeTrackDeep 采集数据用完即弃不落 IndexedDB；②宿主称「策略/对标明细没随回执返回」自由发挥——根因=云端空返回被 filter(Boolean) 静默吞行；AskUserQuestion 三拍板「三报告统一瘦身/领取+列表合一/断点本批一起修」）：①三报告统一瘦身——能力 1/4/6 领取交付删「按第五节模板说人话解读+【下一步行动】」，改【完整报告】链接+「栗子查 XX报告」提示收尾（帽+关键行照抄+链接，全量明细 web 端看）；第五节模板加适用范围限定「仅深采等无 web 报告页的纯数据回执用」；②「栗子领取」全局退役换「栗子报告」（14 处，radar 3 处/引擎 13 处文案/mjs 20 处同批）+合一入口规约——有 pending 完成结果先交付最新一份+尾附最近报告一览 ≤7 条，无 pending 直接 query_local_data(source=reports) 列最近报告表（类型/对象/时间/一句速判/链接）可「栗子查 <名称>」展开，旧词栗子领取同认兼容；③配套引擎断点修复（ADAPTER 1.2.90）：executeTrackDeep detached 段补 putNotes/putComments 落库+summarizeTrackDeepResult 策略/对标空时显式报行「本次未随回执返回——打开报告直达链接看全量渲染」防宿主自由发挥。引擎批须重载插件。⭐R96bv 2.3.5→2.3.6：扫描量可调开窗 insights 侧（⭐2026-10-27 用户拍板「开窗也直接做了」——R96bu 预告的下批引擎开窗提前到本批执行，AskUserQuestion 拍板「先透明+下批开窗」的「下批」就是本批）：能力 6 赛道深研发起段补扫描量可调口径——leadsradar_track_deep_research 新增三参数 sample_count（列表采样 20-120 默认 80）/top_deep（深采条数 5-30 默认 20）/comment_limit（每篇评论 10-100 默认 20），⭐用户主动指定扫描量/深采量/评论量时才透传（「多扫点/只深采 10 条/评论多采些」类指令），默认不传走引擎默认，超范围引擎自动夹回边界禁宿主自己拦；pending 首段扫描规则行照抄回执 message 实际生效参数（回执已带「采 X 条列表 + TopY 深采」实际值+params 字段——用户调过就照抄调后的数字，禁照抄 SKILL 示例里的默认 80/20）；能力 5 深采已有参数口径不变（limit=深采条数 1-50 默认 20/comments_limit 10-100 默认 50）。配套引擎 agent-tasks.ts executeTrackDeep 三参数白名单 clamp+sendMessage/progress/estCollect/params 全参数化+AI 样本截断 slice(0,aiSampleCap) 跟随实际采样量（draft 命中存量数据仍按 80 截断）+mjs TOOLS inputSchema/dispatch 双注册。引擎批须重载插件。⭐R96bu 2.3.4→2.3.5：pending 首段四板块定版+三禁（⭐2026-10-27 用户三问复盘赛道深研实收 pending——问1「输出没有按照我们之前说的要求，不太符合规范」实收超纲三处：自辩段「这一轮是真实深度报告，不再是我手工拼凑的速览」/计费扩成 bullet 大段/pending 结尾挂「拆透了，照着打」收尾语（pending≠交付）；问2「用立即回复+二次查询的方式做的是吧？第一段的提示词怎么设计？展示哪些板块？」——确认两段式链路正确，AskUserQuestion 拍板「四板块定版」；问3「本地扫描应该有说一下本地扫描规则吧？参数是否支持宿主调整（命中和扫描量等）」——拍板「先透明+下批开窗」）：①能力 4/5/6 三异步闭环第 1 条统一改 **pending 首段四板块**——启动行（已启动·耗时 N 秒·对象）/扫描规则行（照抄回执真实参数：采多少条→深采几条→AI 出什么，赛道=80 条→点赞 Top20 深采→三段式报告；禁自己编扫描量）/提示行（标签页别关+计费各一句）/领取行（「栗子报告」+括注等来的是什么报告），全文 6-8 行收束，复用缓存分支②改口③删标签页提示；②第七节新增 ⭐R96bu 公共条款「四板块与三禁」——三禁：禁自辩段（过程自述类）/禁计费扩段（照抄 credits 一句收）/禁 pending 收尾语（**栗子收尾语只在「栗子报告」交付后出现**）；③下批引擎开窗预告（记账不入本批）：capture_profile/track_deep 加 options 白名单参数（sample_count 20-120/top_deep 5-30/comment_limit）供宿主调扫描量命中量。纯 SKILL 批零引擎改动，radar 不动。⭐R96br 2.3.3→2.3.4：账号深度研究 Agent 直发+报告顶部专属帽+积分权益必念（⭐2026-10-27 用户六条咨询「三个报告分别摘录输出展示输出顶部区域的内容【内容主题】【账号定位】【赛道机会】」「这个板块都要有【完整报告】链接XXXX」「【下一步行动】」「积分和权益变化也要算在成本里面」「其他无关的重复快扫不要展示，因为和探一下重复了」+追加实锤「我们现在聊的栗子研究『账号』就是『账号深度研究』啊，你还没接入？」）：①能力 4 整节改 Agent 直发——leadsradar_account_deep_research(url[, platform]) 直接发起（⭐R96br 引擎开窗：快路径本地素材够（≥10 条且 8 条有正文/逐字稿）2-6 分钟/慢路径自动深采垫场 20 条 6-25 分钟 pending→栗子报告，报告四板块 账号定位（IP 主线/受众分层/变现模式）/内容支柱/获客速判/完整报告 deep_link），不再指路插件手点；②能力 1 深拆顶部加【内容主题】帽（report.summary 照抄+线索指数/线索率关键数字——报告是啥就展示啥）+【完整报告】独立板块（report_url 裸链单起一行，web 端渲染禁全文搬运）+慢反馈三件套（pending 至少 3 分钟起口径+期间追问如实说「X 分钟前提交」不编阶段不编百分比+领取没领到「再等一两分钟再喊我」不慌报错）；③能力 6 赛道深研顶部加【赛道机会】帽（verdict+market_stage 照抄）+【完整报告】独立板块+成本必念；④能力 5 深采定位收窄（「栗子研究 <账号链接>」默认直走能力 4，深采只在明确要采数据/看逐条明细或能力 4 报 INSUFFICIENT_DATA 需垫场时用）+删独立快扫两行帽（A3 四级计数/线索率/账号四分类/流量分线索分融进「三个发现」——与情报栗探一下重复）+不放【完整报告】板块（纯数据回执无 web 报告页）+【下一步行动】首项改栗子研究快路径；⑤积分和权益变化都算在成本里面统一口径（每类研究交付回执 credits.cost=0 念「本次 0 积分（首免/会员权益）」把权益变化念出来，有消耗念「消耗 N · 余额 M」）——栗子仪式/能力 1/4/6/安全限额四处落规；⑥分流表账号链接行+分流纪律+总述行同步改写。配套引擎 ADAPTER 1.2.87（executeAccountDeep/summarizeAccountDeepResult/buildAccountDeepResult 三函数+account_deep 路由+mjs TOOLS/dispatch 双注册）+radar 1.2.31 同批（引擎批须重载插件）。生效前提=重载浏览器插件+npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bq 2.3.2→2.3.3：研究类三交付补【下一步行动】（⭐2026-10-26 用户咨询「作品深拆/账号深采/赛道深研三个输出结构如何」+追问「这些是否都有下一步行动」——行动区审计实锤：采集/巡逻类（探一下/扫对标/扫我的号/对标入库）都有复制即用指令区，研究类三交付看完不知道下一步喊什么）：AskUserQuestion 拍板补齐，能力 1/5/6 三交付段尾各追加行动区（2 句编号短句行 inline code+理由 ← 同行右侧，与情报栗流程 A/E/F 同款复制即用）——能力 1 作品深拆：`栗子存选题 <这篇链接>` ← 拆出信号的好内容先进弹药库（A3 线索浓度高=🟢≥3 条或 A3 率≥10% 时换 `栗子触达` 顺着报告挖到的客户线索去跟进）；能力 5 账号深采：`栗子加对标 <该号主页链接>` ← 值得学的号入库盯着（回执已在库则换下一条）+`探一下 <近7天爆款作品链接>` ← 看这篇爆款的线索构成再决定学不学；能力 6 赛道深研：`栗子研究 <对标 TOP1 账号>` ← 深挖报告点名的标杆号+`栗子存选题 <赛道代表作链接>` ← 按策略 TOP1 的方向先攒弹药。同批 radar 1.2.30 扫我的号补宾语。纯 SKILL 批次零引擎改动，生效前提=npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bp 2.3.1→2.3.2：赛道深度研究开进 Agent（⭐2026-10-26 用户实报「栗子研究 小红书 辅食」——洞察栗「栗子研究」统一入口三维度盘点：作品拆解 R96at✅/账号深采 R96bo✅/赛道深研❌ 16 工具无通道，宿主只能指路插件手点）：①requires 加 leadsradar_track_deep_research（16→17 工具）；②一点五节分流表「平台+关键词」行改直调——先 query_local_data(source="reports", keyword=词) 查已有 track 报告（有就免费解读+report_url），没有就 track_deep_research(keyword, platform) 直接发起（与插件赛道页「赛道深度研究」按钮同源同引擎：采 80 条+Top20 深采→三段式报告，非会员首免/之后 8 积分，15-30 分钟 pending→栗子报告）——「指路插件手点+回情报栗攒料」旧口径退役；③新增能力 6 整节（异步闭环 4 步：pending 转达含「复用缓存直接 AI 约 2-6 分钟」改口径→claim 领取→交付赛道判定行/策略 TOP3/对标 TOP3/deep_link 裸链+说人话解读→error 五类分类转述，AI_TIMEOUT 附「超时不代表失败」）；④能力 4 收窄为账号深度研究（赛道拆出）、R74 铁律账号/赛道分述、仪式成本行与第七节计费补赛道 8 积分首免口径。配套引擎 ADAPTER 1.2.86（executeTrackDeep fire-and-forget 异步闭环+track_deep 模式）。生效前提=重载浏览器插件+npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96bo 2.3.0→2.3.1：垫场速览禁编预估分+账号深采垫场（⭐2026-10-26 用户实报「栗子研究 小红书 辅食」宿主交付轻量速览+编造「需求分70/竞争分53/集中度59%（预估）」——引擎 search_results 本就不附象限分（单词搜索输入不全不硬算），宿主 LLM 现编数字被用户打回）：①垫场速览纪律新增——深采 pending 期间/查无报告时用采集数据先答只准引用回执真实字段：禁编需求分/竞争分/集中度/蓝海词评级这类引擎没返回的指标（没有就说「轻量采集算不出竞争格局，真实判定去插件赛道页快扫/深度研究」）；没采评论禁下「评论区冷热/有无商业询问」类意向结论（列表卡只有互动计数看不进评论区，要下结论先 capture_note_comments 或 deep 深采回执 A3 快扫）；均值/最值/排名可算但注明「N 条样本」，宁说数据不够不编数字；②能力 5 账号深度采集开窗——requires 加 leadsradar_capture_profile，一点五节账号链接分流行改「没有报告→capture_profile(url,deep:true) 深度采集垫场」（与插件「深度采集」按钮同源同引擎 5-20 分钟 pending→栗子报告，领到后按真实数据速览再指路深度研究报告），新增六点五节整节（异步闭环 4 步：pending 转达「预计5-20分钟别关标签页完成喊栗子报告」→claim_pending_result 领取→交付完成行/快控行/账号快扫/近7天最新作品/说人话解读→error 分类转述）；③赛道研究分流行+第七节纪律补「引擎没返回的评分/分级禁止编造或预估」总条款；④能力 4 攒料行改「账号走能力 5 深采、赛道回情报栗搜关键词」。配套引擎 ADAPTER 1.2.85+radar 1.2.29 同批。生效前提=重载浏览器插件+npm 发版+宿主经 leadsradar_get_latest_skills 更新 SKILL.md+完全退出宿主重开。⭐R96at 2.2.8→2.3.0：单篇拆解重设计（⭐2026-10-25 用户拍板「单篇深度拆解有且只有一种，不存在所谓的轻量拆解，这是个巨大bug，需要完全重新设计」）：能力1整节重写——轻量拆解四段卡退役，统一走新工具 leadsradar_note_deep_research（与插件「深度拆解」按钮同源同引擎，deepDiagnosisAsync L2 单篇深度）：先查本地已有报告免费解读（不扣券）→没有则触发云端 AI 分析（扣券，约 1~3 分钟）→AI「说人话」解读（三个发现+最该做的两件事+一个风险+最值得存的一句）→report_url 直达+本地副本自动入 work_records；未登录 LOGIN_REQUIRED 撞墙规范（指路「栗子登录」）；评论/正文不足转述引擎拒绝原因；pending=true 返回时引导用户稍等后喊「栗子报告」拿完整报告（超时自动回灌待领取）。⭐R96y 收尾栗子发言（全端规则「开头结尾都是栗子发言」，与开工语对仗）：「拆透了，照着打 🧠」→「🌰 **洞察栗**：拆透了，照着打 🧠」（2.2.7=⭐R96n slogan 用户定版开工语「开拆，看门道 🧠」→「获客方法，一探便知 🧠」（五句全锚获客主张，「一探便知」嵌品牌动词探）（2.2.6=⭐R96m 同上定版）（2.2.5=⭐R96f 同上定版）（2.2.4=⭐R96e 头像化）
  creator: "1.2.32",
  // ⭐R96gay 1.2.31→1.2.32：栗子创作第四件套注册批（「栗子创作 <链接>」注册为第四件套：提取直连仿写开拍稿；description 三件套→四件套+精准触发词注册+L183 漏改补修+批量下载补行动+模糊词兜底层补「创」行）｜⭐R96gaw 1.2.30→1.2.31：提取文案后【下一步行动】次位研究→下载（五维评分拍板：下载 3.25 > 研究 2.95——文案刚到手最常见是先拿素材参考着拍，视频/图文两模板同步）｜⭐R96df 1.2.29→1.2.30：媒体链接附文件末尾（⭐2026-10-29 用户拍板「把视频链接和图片链接等也附在md文件里面，在最后面，方便用户自己下载」）：引擎 extract_text 回执 data 透出 mediaUrls（video=无水印视频地址/videoList=多清晰度视频列表/images=图集原图列表/cover=封面/audio=音频，全去空），creator SKILL 落盘文案 md 最末尾追加「## 媒体链接」段（先一行说明「链接复制到浏览器即可自行下载（第三方 CDN 直链，有时效性，建议尽快保存）」再逐条列行：视频（无水印）/图集图片按两位数逐张编号（图片 01…）/封面）——只写进附件 md 文件禁堆对话正文（对话只在【文案提取】表后提一句「媒体链接已附在文件末尾」），mediaUrls 无值（引擎未返回）不编造不提；⭐R96cu 1.2.28→1.2.29：图文三形态模板+图号前缀（⭐2026-10-29 用户拍板两落点——①引擎侧 OCR join 加图号前缀〔图 N〕：宿主有「按图分块」原料且封面→内页图片序列结构可读（这本身就是仿写关键信息）；②SKILL 侧动作 3 新增图文三形态模板与视频逐字稿模板并列——决策树：图字主型（图字≥正文或正文<50字）图字分块升主位/正文主型（图字<50字≈封面钩子）套视频模板改引用段/双强型（两边≥50字）图字分块在前+正文全文在后/拿不准图字优先，决策原则「谁承载文案本体谁占主位」；模板=完成行（图文文案已落盘）+【文案提取】表第四行「图上文字」+形态判断行（带数字依据 N 字 vs M 字）+图字分块引用（〔图 N〕原样透传禁重排，图号跳缺属正常）+正文降级行（图字主型一句话概括/双强型全文照引）+【文案结构】图号列（图号是真实序非估算，不用时间码）+硬规两条（形态判断必带数字依据/图号禁重排）+L73 回执结构注同步（〔图 N〕分块前缀+主位按三形态定）。引擎批：插件需重建重载生效）。⭐R96cq 1.2.27→1.2.28：并列要点逐条换行总纲+图文额度凭据防呆+小红书禁转（⭐2026-10-28 用户实报两案——①视频交付学什么/避什么分号连排不回行，「这类格式问题总在不同地方反复出现」要求治根：硬规新增通用总纲条，交付内一切并列要点（学什么/避什么/钩子变体/卖点/标签/一切清单类字段）一律逐条一行（> ①/> ② 引用行或编号行）禁分号顿号斜杠连排挤一行，模板学什么/避什么同步钉死逐条一行格式；②小红书图文交付零 OCR 调用却编「云端转录只返回了正文全文（无图片 OCR 结果）」假话术——实锤三证：耗时 2 秒不可能走完 OCR 提交+轮询、完成行无「文案提取额度已用 X/Y」、引擎从不说那句话，宿主只采 note_detail 拿 body_text 顶替交付（R96bi「图文必调 OCR」条款未被执行，插件引擎链路本身正确无需改）；修法=硬规图文额度凭据防呆条——图文交付完成行必须带「文案提取额度已用 X/Y」（该行=真调了 extract_text 走 OCR 的唯一凭据，真调了额度回执必返），无额度行=没调 OCR 违规，禁编「云端转录只返回正文/OCR 无结果」类假话术（引擎真调了要么【图片文字】+【正文】两段回执照抄、要么明确报错「图片 OCR 未识别到文字」如实转述）；③顺带：小红书互动行禁 🔁（实报视频交付混入 🔁 644——share_count 是分享按钮次数非转发数据，仅抖音给转列）。纯 SKILL 批零引擎改动，ADAPTER 不动）。⭐R96co 1.2.26→1.2.27：照读标注按转写质量分档（⭐2026-10-28 用户实报「栗子提取」方言视频交付——开场段标「可直接照读」与同交付避什么「ASR 转写错字多需人工校稿」自相矛盾，且 310 字/159 秒≈2 字/秒丢字过半、结构表时间码全靠推断；修法=SKILL 模板行「（钩子段，可直接照读）」固定标注退役改中性「（钩子段）」，硬规新增照读分档条——转写通顺（普通话、无连续错译句）标「可直接照读」、方言/口音/环境音重错译句 ≥2 处改标「需校稿后照读」且避什么同步点名「ASR 方言转写错字多照读前需人工校稿」、字数 <3 字/秒时避什么加「转写丢字多结构表时间码为推断值」提示——禁对错字稿标「可直接照读」。纯 SKILL 批零引擎改动，ADAPTER 不动）。⭐R96bi 1.2.25→1.2.26：图文提取必调 OCR+两段回执照抄（⭐2026-10-26 用户实测反馈3「目前针对图文类的提取文案也要调用any2copy提取图片上面的文字，正文也附在里面；但是图片上面的往往才是主要内容」）：动作 3 两步重写——①步骤 1：仅视频类已挂载转写（transcript）有就直接用不花转录额度；图文类必调步骤 2 走 OCR（用户拍板「图片上面的往往才是主要内容」——页面正文只是附带，禁拿 body_text 顶替图上文字省额度）；②步骤 2：ASR 空时引擎已自动降级 OCR 宿主无需带 note 对象重试；图文回执结构=【图片文字】在前为主+【正文】在后附带（⭐R96bi 引擎自动拼）——照抄两段全给禁只给其一。配套引擎 ADAPTER 1.2.80（executeExtractText 重写 buildOcrSuccess 公共出口+ASR 空自动降级）。⭐R96bf 1.2.24→1.2.25：存选题核对口径改版（⭐2026-10-26 用户实测反馈2「存选题后显示 已核对：选题仓库第 1 条 · 仓库现共 1 条，但是我的选题仓库明明还有好多，怎么才检测一条呢？」——根因=动作 1 存后必查教宿主用 query_local_data(source="works") 反查本地 IndexedDB works 充当「云端选题仓库」计数，本地是插件本机缓存非云端仓库，云端几十条本地 1 条时报「现共 1 条」口径事故）：①动作 1 第 3 条存后核对整段重写「⭐R96bf 口径改版——总量直读回执，本地反查退役」——回执带 topic_total（云端选题仓库当前总条数，服务端 supabase count 真源）直读回显「已核对：云端入库成功 · 选题仓库现共 M 条（本条为最新入库）」，**禁再用 query_local_data(source="works") 反查本地 works 充当仓库总量**，「选题仓库第 N 条」旧说法退役；②第 4 条 duplicates 行对齐「+回执同样带 topic_total 照报总量（已存在也报真实仓库总量，禁报本地计数）」；③第 6 条交付形态核对行对齐新口径。配套引擎 executeSaveTopic 回执两分支（成功+already_exists）透出 topic_total+web 端 create-from-plugin route 服务端 count（archived=false 口径）+ADAPTER 1.2.77 同批。⭐R96ba 1.2.23→1.2.24：收尾防呆再硬化两条新形态（⭐2026-10-26 用户复测封面修复成功后实报交付末尾仍跟两段——「下载完成：马代视频无水印 MP4…已落盘…附在上方卡片」镜像复述段+「两点说明：①这次把封面也带下来了（上次只有视频）；②插件连接闪断…重开 Chrome 窗口…自动升级到 v1.2.70」修复史/插曲自述段；R96ac 点名四条后旧形态已消失、本次犯的是未点名新形态）：第六节附件条禁令清单加⑤禁镜像复述段（指引行的复读机版，文件名/大小/路径正文全给过还把「下方」错写成「上方卡片」）⑥禁「两点说明/补充说明」自述段（修复史=版本差异用户不需要知道、过程插曲对齐情报栗 R96ay 插曲叙述禁令——用户要结果不要流水账）。⭐R96as 1.2.22→1.2.23：触发词动作化——注册词「栗子存选题 <链接>」（⭐R96as 五词拍板之一，旧词「栗子入库」同认），frontmatter description/精准触发词条/【下一步行动】三处换词。⭐R96an 1.2.21→1.2.22：提取交付定版五改（⭐2026-10-24 用户实测「栗子提取」逐字稿到手后五反馈：①下一步行动导向栗子创作优先（与存选题 R96aj 同拍板——文案到手最顺的下一步是开拍，`栗子创作`固定第 1、`栗子研究`第 2）；②完成行必念文案提取额度「X/Y」——引擎 quota 尾巴一直有但宿主只念采集额度（用户「消耗的免费额度1/1没有计算和提示」），X=Y 追加「今日免费额度已用完明日恢复」，两本账并排念清，禁带下载场景「素材本机已有未重复下载」话术；③【文案拆解】改名【文案提取】+逐字稿进表——标题/来源/互动三行下直接加第四行 `| 逐字稿 | 📁 路径 · N 字 · 已附在下方 |`（用户「应该直接在标题、来源、互动下面展示逐字稿的下载地址和字数」）；④【文案结构】表格化 `|时间码|结构点|简述|`+表后一句话评价「值得模仿/不值得模仿+理由≤20字」——时间码是估算值（ASR 逐字稿无时间戳，按各段字数占比×视频时长折算一律带「约」，禁精确到秒假装真实测）；⑤推翻 R96ak 三段式旧模板（标题钩子 3 变体/内容结构/口播全文）——变体不再默认输出，开场 30 秒钩子段引用块保留、全文走附件）。⭐R96ak 文案提取 Agent 开窗 · ⭐R96aj 存选题交付定版（完成行不念额度+仓库计数+下一步行动两选项+重复检测说明）。⭐R96ai 视频封面伴下（引擎提取层补 cover，视频返回清单必有封面，附件=MP4+封面双附件）。⭐R96af 图集嵌图退役改全附件（⭐2026-10-24 用户实测手机端 16 张图集零附件：「主要问题是附件，我看在手机端没有给我附上」+「图片比较多 16 张怎么展示才不乱」+「图片地址表格下方有很大的空格」三报同根——file:/// 嵌图是电脑本地路径，WorkBuddy 手机端渲染必裂，5 张裂图占位成大块空白即用户看到的「大空格」，宿主判断不了自己所在端无法执行「裂图自删降级」；旧口径「嵌图=已交付本体不另附文件」两头落空作废——附件是手机端拿图的唯一通道）：图集 N 张图片逐个作为附件附在交付末尾（单作品全附不问，表行可合并、附件逐个不省略），指引行分场景拼「16 张图片已附在下方，点开即可保存」；file:/// markdown 嵌图整条退役（单作品/批量同退役，批量附件 >5 先问维持）；【下载目录】合并行形态保留。⭐R96ac 复测防呆强化（用户实报新开窗口测试指引行后仍跟去重解释两大段——宿主读到 1.2.16 禁令仍违规）：三处落规①第六节骨架条新增「交付末 3 行定版」——收尾语→（空行）→指引行→全文到此结束，指引行后一个字都不能有（不解释去重机制/不复述数据/不再报路径/不再喊指令——四类信息各有归属区块）；②第四节去重条尾加「交付末尾零复述」（去重解释只在完成行、位置只在【下载目录】、指令只在【下一步行动】）；③第六节附件条禁令细化为四条禁止清单+「指引行写成独立一行，句子写完就停，别用句号后继续接话」。⭐R96ab 测试2 唯一反馈「冗余多余文案都去掉」+过程旁白两改：①第六节附件条硬化——指引行 `视频+封面已附在下方，点开即可保存` 即交付最末一行，**之后禁再跟任何内容**（用户实报指引行后还跟文件明细 bullet 块（视频/位置/数据三行——【作品信息】【下载目录】正文已给）+「要继续的话直接喊：栗子提取/栗子入库」段（【下一步行动】区块已给）全冗余应删）；②仪式条开工语与完成行之间零过程旁白（用户实报测试2 输出「详情已到手，正在下载无水印素材：」「素材本机已有，核对一下落盘文件夹的实际文件：」「按交付规范记录一笔工作日志」全是过程叙述——工具调用/去重核对/记录日志等中间步骤一律不发话，开工语→完成行→交付物直连，仅异常时 ⚠️ 一句问题+下一步；与 radar 同批同规）。⭐R96aa 作品信息表格化（用户测试2 复检「还是没有按照预想的显示，想一想办法」→AskUserQuestion 拍板两列标签表，与 radar【作品详情】同款全端统一——推翻 R96v 上下结构/R96y 空行分段三轮摇摆：表格边框自带分区渲染最稳、标题放表头行自带加粗不依赖宿主执行 **、长标题在内容列自动换行不撑爆）：三行两列 `| 标题 | 全文原样不截断 |`+`| 来源 | 作者 · 平台 · 类型 |`+`| 互动 | 👍 N · 💬 N · ⭐ N · 🔁 N |`（互动数字全加粗、小红书无转、图集在来源行标·图集；标签窄列内容宽列）。⭐R96z 附件数量原则+说明行归位（用户复检测试1两反馈「视频 MP4 已附在上方」说明行位置与文案双错+「附件这次只出来了一个视频，要求每次都把视频和封面同时都附出来，前面显示了多少素材后面就要附件多少，其他的地方也要按照这个原则来」）：①**附件与【下载目录】清单一一对应**——表里列出 N 个文件就附 N 个（视频 MP4+封面 JPEG 都要附，用户实报只出视频封面漏附；图集已嵌图展示的图片不重复附文件=嵌图即交付本体；批量场景同原则：合并表列出多少就附多少，>5 先问保留）②**附件说明行归位**——从收尾语前移到**收尾语之后**（交付最末一行），文案写「下方」`视频+封面已附在下方，点开即可保存`（附件在宿主实际渲染于消息下方，旧「已附在上方」位置与文案双错）；收尾即收尾的**唯一例外**=附件指引行③**分段铁则全链延伸**——开工语行/完成汇报行/各区块/收尾语/附件指引行各自独立成段两两之间必须空行（用户实报开工语与完成行连排成一行——markdown 单换行渲染合并为空格）。（R96y 三改详录：）①收尾语加栗子前缀分动作——下载「🌰 **创作栗**：素材到手，参考着拍 🎬」/存选题「🌰 **创作栗**：选题入库，弹药备好 🎬」/提文案「🌰 **创作栗**：文案到手，拿去开拍 🎬」+**收尾即收尾禁再跟长解释段**（用户点名「视频和封面都给你挂上面了…插件自动去重…强制重新下载…喊一声栗子提取/栗子入库」整段应删——去重信息完成行+下载目录已给不重复，必要补充 ≤1 短句并入收尾行内）；②【下一步行动】三列表退役→**编号短句行 2 选项**（用户拍板「不要表格有点冗余、不要三个选项全部改为两个」——推翻 R96v 表格化回行式）：默认 `1. 栗子提取 ← 抠出口播文案` `2. 栗子入库 ← 存进选题仓库`（同栗创作链路下完素材→提文案/存选题；爆款可换首行栗子研究；指令不带链接沿用 R96v 上下文拍板）；③动作 2 去重转述极简（完成行尾缀「素材本机已有，未重复下载」+下载目录给位置即够，禁收尾再解释去重机制/主动给强制重下指引——用户要重下再说）（用户拍板多作品场景紧凑块+合并表）：动作 2「账号素材批量下载」第 4 条——完成行 `✅ 批量下载完成：成功 N · 失败 M` → 逐作品紧凑块两行（**标题截 20 字**加粗独行+meta 一行 `👍 N · 💬 N · ⭐ N ｜ 1 视频/N 图`，文件明细不在此重复）→ 合并【下载目录】一张表（`| 文件 | 位置 |` 逐文件一行，同文件夹第二行起「同上」）→ 附件逐个附（每个视频 MP4 都附，>5 个先问「全附还是只报清单」）；批量图集不逐张嵌图（单作品才嵌图）文件进合并表即可；第六节三区块条注明单作品形态、批量不套用。⭐R96w 交付末尾附文件（用户实报「本次输出没有附带文件可下载，之前都是把附件附在后面，手机也可以直接下载；没附是巨大缺失」）——第六节新增交付必经步骤：三区块输出完后把落盘视频 MP4 作为文件附件附在交付末尾（拿返回清单绝对路径走宿主发文件能力，WorkBuddy 手机端点开即存）；图集按动作 2 嵌图走不另附；确实发不了才降级只报表格+路径（先试一次再降级）——根因=R96u/R96v 三区块模板化后宿主 AI 只照模板输出表格，动作 2「宿主能发文件就直接推」（R73 拍板）藏在子弹里被忽略，落位为模板必经步骤根治。⭐R96v 三区块再调+去重（用户复检四反馈「格式和文件合并」「位置直接显示完整路径」「下一步行动也用表格」「标题为何如此之长」）：①【作品信息】上下结构——标题加粗独行（原样不截断自然换行）+meta 一行（作者·平台·类型｜互动数字全加粗；推翻 R96u 两列窄表：抖音标题动辄百字表格列必撑爆）②【下载目录】两列表 |文件|位置|——文件名截 20 字+大小括号接尾（格式列退役扩展名已表意）、位置=📁+完整落盘文件夹路径 inline code（首行全路径第二行起「同上」；表下题注行退役防重复；推翻 R96u 三列+题注式）③【下一步行动】三列表 |#|指令|干什么|——指令列只写指令词不带链接（⭐R96v 拍板：同会话用户紧接着回喊指令词默认取最近一次交付作品的链接作参数；隔太久/多作品混聊先确认对象；推翻 R96u 编号短句行式）④动作 2 新增重复下载去重条：插件同作品已落盘且文件在→自动跳过重下返回「本机已有未重复下载」+位置，如实转述别二次触发；强制重下走插件作品卡手动通道（插件端 executeDownloadMedia ⭐R96v 去重闸配套）。⭐R96o 下载场景四修（用户实报 16 张图集下载全链路，反馈「问题很大」）：①开工语分动作——口号「获客视频，一键生成 🎬」是能力名片、只住管家栗报到菜单，任务开工语贴着任务说：下载「收到！无水印素材，这就下 🎬」/存选题「收到！好选题，这就入库 🎬」/提文案「收到！文案这就抠出来 🎬」②收尾语分动作去搬运暗示——下载的是别人的素材、用途=参考/拆解/二创，禁「货备好了拿去发」（用户：「别人的素材怎么拿来发呢？」），下载收尾改「素材到手，参考着拍 🎬」③动作 2 图集交付前 5 张本地 file:/// 嵌入 markdown（宿主不渲染裂图自删降级报清单）④【下载清单】窄表化+尾部 next steps 改编号短句行 inline code（1.2.7=⭐R96n slogan 用户定版开工语「下料，三件套这就齐 🎬」→「获客视频，一键生成 🎬」（获客视频=用户要的最终产物场景聚焦）（1.2.6=⭐R96m 同上定版）（1.2.5=⭐R96f 同上定版）（1.2.4=⭐R96e 头像化）
  closer: "1.4.36",
  // ⭐R96g1ba 1.4.33→1.4.34：看板行数即规格+代发 author_id 贯通+深楼定位口径批（①【7天待回应】实报只显 6 条+「173条中…」残行——样例 3 行压过 20 条指令，样例扩满 20/12 行+行数即规格硬规+算术自洽；②send_reply 补 author_id 同传纪律；③深楼定位失败口径=重试 1 次仍败即停手换浅位目标）｜⭐R96gq 1.4.32→1.4.33：看板两板块渲染根修批（用户实报「【7天待回应】【7天获客榜】这俩也没看到啊」宿主自由发挥旧按作品聚组格式——根因=我的线索视角主指令仍写「输出与账本查询同构（按作品聚组四列留痕表）」压过两板块定义：①主指令改「输出=统计行+看板两板块定版+样例照抄」聚组形态看板场景退役 ②补看板定版样例整段照抄级（统计行+【7天待回应】七列表+交代行+【7天获客榜】表+行动行））| ⭐R96gp 1.4.31→1.4.32：【7天待回应】A3+优先排批（用户拍板「评论的A3级别和来源也要加上，按照A3+优先来排列」——列式升 `|#|A3|客户|评论|来源|回评|私信|`：A3 列取回执 intent 映射🟢A3强/🟠A3弱/🟡A2/⚪A1、来源列取 note_title 作品名截前12字；排序 🟢→🟠→🟡→⚪ 同级问价/求购/求合作优先；数据面 lead_records 已直出 intent/note_title 零引擎改动）｜⭐R96gl 1.4.30→1.4.31：误发事故根修（代发纪律新增「确认单行直拷贝」——send_reply/send_dm 参数必须从阶段 2 确认单行逐字复制，禁发送时重新捞库按序号取行重组；回执即核每条到即核 matched_commenter 禁攒批末；DUPLICATE_REPLY=引擎防重拦截禁绕过须与用户核对）+⭐R96gm 看板两板块（我的线索看板：【7天待回应】20 条列式含回评/私信两栏规范格式禁省略+【7天获客榜】12 条）｜⭐R96gcj 1.4.29→1.4.30：初卡回填 lf_leads 历史留痕（阶段 1 出卡前查 contacted 回显，治「测过多次记录显空」）+评论采集默认 50 条提速 | ⭐R96gay 1.4.28→1.4.29：查询四词主次+终版快照/设置出口批（查询四词三层化「栗子触达记录」主词+「谁还没回/触达了谁/未完成任务」注册同认；会话内推进词家族标注；点名全形同认；阶段 4 终版快照必带出口；第七节触达设置查/改完必带出口）｜⭐R96gas 1.4.27→1.4.28：栗子守家更名批（⭐2026-11-03 拍板「栗子守家改为栗子我的线索，展示我的待回应线索」）——description/一节触发词行/第六节看板标题【我的待回应线索】全链改名+成交栗提示语定版「栗子触达/回复/私信 <作品链接> · 栗子我的线索 · 栗子触达设置」（L39 职能语旧词守家兼认保留）｜⭐R96gar 1.4.26→1.4.27：栗子守家入口批（⭐2026-11-02 用户拍板「栗子守家」命名+「成交栗内入口」不加第六技能，类比复盘之于账号研究=栗内入口）——description 触发词注册「栗子守家」（职能语兼认「回自己账号的评论/我的待回复」）+触发词行+守家流程（lead_records source=own 拉「我的账号」待回复→按作品聚组跟进卡→行动行回评优先=自己作品纪律）｜⭐R96gaq 1.4.25→1.4.26：入口定版+留痕表定版+截流渠道纪律批（⭐2026-11-02 用户四拍板）——①「栗子触达是一个入口，让用户根据评论选择回复还是私信」：description+一节入口口径（出跟进卡后停选号步，用户按每条评论意向点名渠道「回1、3，私6」再进阶段2，宿主禁替用户定渠道）；②「触达记录要按照作品来，回评和私信是两个字段，✅展示发的内容，没有的为-，表格保持统一格式」：第六节留痕表定版——按来源作品聚组（作品名加粗组标题）+每组固定四列|#|客户|回评|私信|，完成=✅+话术截30字、没做过=-，默认≤3作品组×每组≤9条，格式恒定禁变体（R96gap 渠道列形态退役）、按渠道查=对应列≠-；③「要不要鼓励用户去回复别人评论区的高价值评论？」结论=鼓励触达但分场景：自己作品回评优先（公开立形象零风险）、别人作品（栗子触达/关键词扫描=鱼塘截流）私信优先（回评在别人地盘易被删评/举报营销/判引流限流，确要回评只做无链接无报价无硬钩子的软性答疑）——一节渠道选择纪律+阶段1行动行别人号私信升首位+第六节最值钱段转正（待处理>20默认带Top5=带主页链接+A3问价/求方案，行动引导私信首位）；④账本查询【下一步行动】改双行（栗子私信首位/栗子回复次位）｜⭐R96gap 1.4.24→1.4.25：触发词族定级批（⭐2026-11-02 用户三问：「成交栗技能改为这个？栗子触达<作品链接>·栗子回复/私信·栗子触达记录/设置」「目前触达和私信的意思是一样的吗？还是触达包含回复和私信？要捋一下核心提示词的意思和用词」「触达记录目前只有私信的？」）——①用词定级：触达=总称（含回评+私信两渠道，层级触达⊃回评/私信）禁当「私信」同义词，description+一节新增「用词层级」行；②「栗子私信」注册（私信渠道触发词，与栗子回复同构、不带序号同用阶段 2 筛选交代分支）；③第六节账本查询模板加「今日触达留痕」段（渠道列+发的内容列，touched_reply/touched_dm 取已回档前 9 条，话术截 30 字）+按渠道查口径（谁被私信过=touched_dm 非空/谁被回评过=touched_reply 非空）——转正宿主自发增强（用户实贴输出已带渠道+内容列，比旧模板好），答「触达记录两渠道都有非只私信」｜⭐R96g1ao 1.4.23→1.4.24：开关拆渠道+防误发双闸批（⭐2026-11-02 用户三拍板：①「应该分开，改」——成交文档/人设档案 options 两卡看着两套实际绑同一字段，拆 use_deal_doc_reply/_dm、use_persona_doc_reply/_dm 四字段（插件端存量迁移两渠道继承旧值；云端 route 参数名不变插件按渠道各传；mjs touch_settings 旧名兼容=两渠道同设）+SKILL 第七节两表各补渠道开关行、公共项行删；②「发错的是很严重的问题，要想办法杜绝」——send_reply 加 comment_id 必传纪律（小红书 id=comment-xxx 精确命中防同质评论「多少钱」撞车误发、抖音 DOM 无 id 自动忽略）、ID 命中仍须昵称/uid 硬闸（宁可不发不错发）、回执回显 matched_commenter/matched_comment_text 实际定位评论、宿主逐条核对不一致=误发立即停手告知用户；③xhs 定位窗口 15s→30s（旧评论深滚动可达，缓解「1/2/3/8/9 定位失败」）；④顺手修 send_reply/send_dm message 旧节奏口径→回评 8-40s 按稿长/私信 45-90s（R96g1am 漏改处）；配套 ADAPTER 1.2.164）| ⭐R96g1an 1.4.22→1.4.23：触达设置查呈现拆两表批（⭐2026-11-02 用户大测复验「栗子触达设置」后拍板「触达设置的回复设置和私信设置要分开两个表格展示」——旧单表八项混排回评/私信字段交错，拆分后各自独立一目了然）：第七节「查」改两张表格——【回评设置】（手动回评稿/AI 回评要求/AI 字数回评/生成条数）+【私信设置】（手动私信稿/AI 私信要求/AI 字数私信/生成条数），成交文档/人设档案注入为公共项跟两表后一行文字（回评与私信生成共用同一开关不进表）；mjs touch_settings description 同步补两表口径（配套引擎 ADAPTER 1.2.163）。 | ⭐R96g1am 1.4.21→1.4.22：触达节奏定档批（⭐2026-11-02 用户问「每一个间隔45秒感觉有点慢，论证下多久合适；组间间隔多少合适？私信的MCP速度如何？」+拍板「回评8-40s随机跟评论字数有关系；加象征性的组间距比如1分钟，插件端手动也要加；私信也是批间隔1分钟；日限200和80」——实查 MC v0.4.0 源码定档：OUTREACH_FEATURE_KEY=outreach.private_message 实锤 MC 只有私信无回评（回评是 LF 独有能力，无竞品对标）、私信 45-90s 已实证跑一版、「每 5 人健康检查」=发送前安全门（风控信号/发送账号身份/页面响应三查，inspectLiveContext）非节奏单位——LF 已有同款反应式保护+身份卡无需新增；新档=回评批内 8-40s 按稿长（模拟真人打字：30字≈19s/60字≈29s/80字+封顶40s——回评=博主在自己作品下互动平台鼓励、风控判内容不判频率）、私信批内 45-90s（MC 同款实证）、批间 ≥5min→1min（象征性分段，MC 零组间等待更松）、日限共享 100→双账本解耦回评 ≤200/私信 ≤80；SKILL 六处改（版本/分批方案表/分批规则/节奏纪律主段/第八节硬规/阶段 3 照抄模板）+mjs send_reply/send_dm description 同档+插件 CommentDetailsModal 同档（回评批量按稿长 8-40s+私信批量 45-90s+批间 1min+双账本 lf_touch_ledger 继承旧计数/lf_touch_ledger_dm 新建，REPLY_DAILY_CAP=200/DM_DAILY_CAP=80）三端一版口径）。| ⭐R96g1al 1.4.20→1.4.21：无 A3 出口补评论分级明细表批（⭐2026-11-02 用户复测 1.4.20 后拍板「这种没有A3+和A3的要不要也展示至少满15条？只不过A3+和A3、A2、A1按照优先级展示而已？我之前设置20条就20条」——1.4.20 收得太狠只给一句结论+计数，用户要看到评论明细本身）：阶段 0 无 A3 出口=一句结论+【评论分级明细】表+指路一行——明细与【客户跟进卡】六列同款同构（| 档位 | # | 评论 | 客户 | 回评 | 私信 |，回评/私信全 —），排序编号同一套全局规则（🟢→🟠→🟡→⚪ 优先级、档内 👍 降序、从 1 连续编跨档不重起）；无 A3 时 🟡⚪ 升格进默认表，默认 ≤20 行、不足 20 全量全列零截断，超出计数行括注「另 N 条未列」；阶段 0 附无 A3 出口整段照抄模板（作品详情+结论+明细表+计数行+指路）；阶段 1 跟进卡规则补例外指向「🟡⚪ 不进默认表（无 A3 场景例外住阶段 0）」防两规打架；三禁保留（禁痛点主题表格/整理选题素材/存选题行动项——明细表=原始评论逐条列表禁改写成主题归纳）。| ⭐R96g1aj 1.4.19→1.4.20：无 A3 出口收紧+标题互动根治批（⭐2026-11-02 用户两报——报2「怎么是痛点主题？这是谁设计的？」：closer 无 A3 时自建痛点主题表格+存选题行动项越界代劳，阶段 0 改一句结论+指路一行（换篇栗子触达/深挖痛点转洞察栗），禁自建痛点主题表格/整理选题素材/代创作栗出存选题行动项，计数行尾注同步「🟡 分流口径住阶段 0（指路不代劳）」；报1「还是查不到标题+互动不全面」：配套引擎批 ADAPTER 1.2.159——comments 前置详情补采（库缺标题同 tab 先采详情落库再采评论，宿主直采评论不再命中空 title 脏记录）+note_meta 互动四项透全 collect/share）。| ⭐R96g1ai 1.4.18→1.4.19：宿主四报批——①comments 回执补 note_meta（作品标题真源，修「未设标题·xx」自拼）②报编号即发（两道门→一道门：【发送身份】卡降级异常兜底：复用旧稿未带直核表/切号/登录态掉线三种场景才出）③预热行砍「也可以自己复制发」尾巴（插件引擎代发=默认唯一执行路径，自发只剩代发失败兜底）。| ⭐R96g1ah 1.4.16→1.4.18（跨 R96g1af 1.4.17 代发红线退役批）：五问批三件——①新工具 leadsradar_touch_settings（触发词「栗子触达设置」用户拍板命名，查改触达设置与 options 同源，第七节）②稿源确认（生成前 get 手动稿现状，已设必问「固定稿还是 AI」，未设不问直接 AI）③账本渠道留痕直答（lead_records 每条 touched_reply/touched_dm，谁被回评/私信过直接答禁猜渠道）｜⭐R96fc 存量注：跟进卡状态列四态（—=未触达/⏳=待执行/⏸=等下批/✅=已发出已核验已留痕），初卡全 —、阶段 4 直接在本卡更新状态禁另起独立执行单，数据同源 lf_leads 账本+会话进展；②展示规则旧「🟢≤5/🟠≤5」退役改「默认 ≤20 行、🟢 优先全列、🟠 接序号补足到 20 行，🟢🟠 合计 ≤20 全列零截断」——261101 抖音实测 🟢7 只列 5 条、用户喊「栗子回复 1-6」时 6 号不在表上断层全靠交代行救；🟡⚪ 仍不进默认表喊「看全量/看黄色」补展示；③纯私信块名分家=【私信任务】（纯回评/混合=【回复任务】，身份三行表同款同走），【私信内容】表补「对方评论」列四列与【回复内容】完全同构（旧三列话术贴哪条评论写的无从对照）；④阶段 4 重写=【触达执行单】退役，发完每批直接重渲染跟进卡（帽行「第 N 批完成 X/Y」+状态列现填，只列触达涉及行不必回贴 20 行全量；状态四态 ✅/⏳/⏸/—，回评私信两列各管各渠道同客户两渠道则两列各 ✅）；跨作品【线索账本】查询不属合并范围；⑤纪律表格豁免跟进卡固定 6 列 ≤20 行。纯 SKILL 批引擎零改动，生效前提=宿主经 get_latest_skills 更新 closer SKILL.md） ⭐R96fb 1.4.14→1.4.15：代发四步核+先核后标批（⭐2026-11-01 用户复测「继续做回复测试你看看问题在哪」——宿主代发第 1 条三连环误报实录：误点「取消」收起输入框→二次输入落进笔记总评论框（绑错对象）→按钮灰态硬当已发，报「✅ 已发出已留痕」后用户网页端没看到回复打穿，宿主认错改账本重发才成功；SKILL 四缺口实锤=「发一条标一条」没定义「发出」判据/留痕早于核验/无输入绑定核验/无定位指导；修=①「发一条标一条」改「先核后标」——发送成功唯一判据=发送后核验页面（目标评论楼下真实出现当前登录号该条回复才算发出），顺序钉死核验通过→mark_replied→回执 ✅，未核到禁报 ✅ 禁留痕，误报须认错+账本改回待处理+重走流程；②新增「代发操作四步核」条（定位提速：页内查找 Ctrl+F 搜客户昵称直达禁滚动逐层扫+视野内相邻目标一次定位挨个回批内间隔照留/绑定核验：输入前确认挂载对象=目标评论楼中楼回复框 placeholder 带客户昵称防落进笔记总评论框/发送：按钮灰态=没绑对回②重核禁硬点、发送取消相邻点前看清/核验：等 1-2 秒核楼下出现登录号+成稿文字核到才算发出接写账本）；③阶段 4 状态三态 ✅ 收紧=四步核通过页面核到真实回复才打勾核不到标 ⏳ 如实说；用户第 2 问「回复速度跟什么有关要不要每次重新定位」固化进四步核①——页内查找+一片一片回不逐条从头滚，强制间隔 30-60s 是风控纪律大头不能省（MC v0.4 实证 45-90s 更长）） ⭐R96fa 1.4.13→1.4.14：分级词表 B2B 补齐+节奏对齐 MC 实证批（⭐2026-11-01 用户复测三问——①「🟢 15 > 🟠 7 这数据对吗？A3+绿色比橙色还多？是不是表述混淆了？用户澄清绿橙=A3+/A3 并列档非包含关系」：本地库 78 条人工判级绿=15 吻合数字本身对（服务营销帖问价/私我/怎么合作类硬意向扎堆绿>橙是真实构成），但橙被压扁（人工判 ~13 宿主只判 7、🟡 虚胖至 20）——根因=第四节 🟠 特征词全是 C 端消费词（想买/纠结/蹲一个），B2B 服务评论区软意向词「了解一下/怎么做/有吗/XX 行业获客」全缺失按「拿不准就降档」被批量压进 🟡；修=🟠 词表补服务/B2B 语境词+三条边界判例（绿橙并列独立计数非包含/向博主求方案=🟠 不降 🟡 对齐插件引擎 A3_SOLICIT_PATTERNS/同行引流自荐=⚪ 禁进 A3 按帖型语境区分）；②「两批之间 30 分钟？有点夸张了吧？你查下 MC 的去触达批次间隔和组间间隔」：实查 Chrome 实装 MC v0.4.0（知识库快照滞后只记到 v0.3.2）新增 comment-outreach+utils/outreach 模块=插件端自动私信，OUTREACH_POLICY={executionGroupSize:5, maxDailyRecipients:100, minDelayMs:45s, maxDelayMs:90s}——发送间隔 45-90 秒/条、执行组 5 人检查点、组间零额外等待（UI 原文「发送间隔 X–Y 秒，跨组同样生效」）、日预算默认 100 可调 1-500、风控反应式=遇平台验证/限频立即停等人工；修=批间 ≥30 分钟→≥5 分钟（六处全改）+补单账号日触达总量 ≤100 人纪律+节奏纪律行注明 MC v0.4 实证依据；③断层隐患：名单只列 🟢1-5/🟠16-20 截断段，用户喊「栗子回复 1-7」时 6、7 号是未展示的全量名单条目回复表冒出名单上没有的客户无从对号，修=阶段 2 补「点名超出已展示名单段必带一行交代」规则（交代行格式+禁静默换人禁重编号）） ⭐R96ez 1.4.12→1.4.13：触达合并本地库批（⭐2026-11-01 用户复测质疑「（🟡 7 · ⚪ 2，这数据对吗？）」——上轮同篇 🟡 8 · ⚪ 35 本轮骤降 ⚪ 2：capture_note_comments 默认 limit=30 只覆盖热门区，触达重跑不合并本地库时名单 34→23 条、⚪ 35→2 集体缩水；实查本地库 78 条，手工对热门前 30 条分级=🟢12 🟠11 🟡7 ⚪2 与宿主回执吻合，数字本身对但缩水呈现歧义）：阶段 1 采集段改写——limit 建议显式传 100+（默认 30 只覆盖热门区）+ 采集后必调 query_local_data(source="comments", note_url=链接) 拉本地库已有评论按「作者+评论内容」去重合并，分级与名单永远基于合并后全量，【客户跟进卡】「已采 N」=合并去重后全量分级基数） ⭐R96ey 1.4.11→1.4.12：档位计数行温度计四色版+whoami 传 open_url 批（⭐2026-11-01 用户复测两反馈：①「这里显示有问题，应该只显示绿色和橙色注释，黄色白色应该用温度计方式一起呈现，你看下别的地方咋呈现的对齐下」——旧规计数行自带「🟡 N（转内容选题）」括注，修=档位计数行温度计四色版「🟢 N · 🟠 N · 🟡 N · ⚪ N」：🟡⚪ 恒裸计数禁任何括注（与探一下【线索快扫】四宫格同序同款全端统一色板）、🟢🟠 可各带 ≤20 字短括注、🟡 转内容选题分流逻辑住能力 1 首段不占计数行；②「另外读到了插件，但是不能唤起网页？」——whoami 调用方式升级：出稿前必调 leadsradar_whoami 且传 open_url=作品链接，没开任何平台页时插件自动前台代开作品页再读登录态（成功回执前缀「（已自动为你打开页面）」），「没开页→引导用户手动开页」分支退役、只剩「代开后仍读不到→登录/稍等复查」引导；帽注释③/规则段③/复用段（⭐R96ey 版）三处同步。配套引擎 executeWhoami 代开分支+mjs inputSchema/dispatch（ADAPTER 1.2.153）） ⭐R96ex 1.4.10→1.4.11：whoami 前置阻断闭环批（⭐2026-11-01 用户三反馈：①「回复账号要确认当前平台的登陆账号啊，不然总是后知后觉的才发现，这一步要核实是否有账号登录，以及是哪个账号，不然回复主体错了，或者没有登录，不至于事后。如果需要登录，也要本步让用户登录」②「浏览器和MCP的指引是否总保持一致？」③「回复账号是不是叫回复主体更好？」——AskUserQuestion 四选一拍板「回复主体」）：【回复任务】三项直核表升级——③行名「回复账号」→「回复主体」+whoami 核不到=本步阻断不出稿（按引擎 message 两分支引导：没开平台页→「先在浏览器打开小红书/抖音任意页面，开好说声复查」、开了未登录→「先在该页面登录（右上角能看到自己头像=已登录），登好说声复查」，复查核到才出稿），「发送前在平台页面现场核（未核不发）」事后话术退役；核到多平台按作品平台选对应账号；②浏览器行不写死 Chrome——browsers 是磁盘扫推断（Chrome/Edge 各 profile、10s 缓存），whoami 与 MCP 连接物理同源恒一致，核到什么浏览器写什么。配套引擎 executeWhoami 两分支+missNote（ADAPTER 1.2.152） ⭐R96ew 1.4.9→1.4.10：三项直核表精简批（⭐2026-11-01 用户复测三反馈——①「回复账号还是没检测到我的chrome登录的平台所在账号呢？」②「浏览器里面出现一些用户不太理解的语言呢，尽量通俗易懂一点」③「回复作品里面也多余一些信息，只展示标题和作者平台即可，这两个条路感觉有点多余」）：【回复任务】表五项砍三项——①回复作品行只写《作品名》（作者 @X · 平台）禁「现核」「回评挂在这篇下」等多余修饰；②浏览器行通俗化写「Chrome（插件所在浏览器）」禁 extension.browsers/插件上报/profile 技术黑话；③回复账号行升级 whoami 现核——出稿前必调 leadsradar_whoami（⭐R96ew 新工具，引擎 executeWhoami 从已打开的小红书/抖音页 MAIN world 读当前登录账号，零采集不占风控限额），核到直接填「⭐已核 @昵称（平台）」禁再列名下候选反问（列候选反问=没检测到，用户两轮实报根因）；whoami 查不到=用户没开平台页面，写「发送前在平台页面现场核（未核不发）」+一句引导先开页面再复查；是否本人判断不删逻辑只删行——whoami 核到的账号 vs 笔记作者，=作者表尾一句「（当前登录的就是作者本人号 ✓）」/≠作者「（注意：当前登录的不是作者本人号，回评会显示为第三方回复）」禁占独立表格行；发送留痕行删（账本留痕阶段 3 触达时自然发生）；requires 加 leadsradar_whoami；复用早前稿规则段同步（三项+双工具现核）。配套引擎 executeWhoami+mjs 工具注册同批（ADAPTER 1.2.151） ⭐R96eh 1.4.0→1.4.1：三稿全展示批（⭐2026-10-31 用户拍板「明明消耗了却不给用户看，有点浪费ai积分，这是bug。浪费钱的行为应该被杜绝」——云端 quick-reply 一次生成 3 候选已占 1 次 aiReply 日限，旧「一次一稿」只展示 1 条=另 2 条白生成浪费积分）：①阶段2表格每序号铺 3 行候选（a ⭐主推/b/c，客户/评论列只 a 行填省宽）；②挑稿制——用户说编号（如「用 1b」）即选该稿，不说默认 a 主推；③重新生成口径补死——3 稿都不满意重新生成=新占 1 次日限（生成前告知，旧口径池尽换稿消耗不告知的缺口一并堵死）；④样板表/尾句/规则行三处同步，废弃「一次一稿（3候选为后备池说换再给）」旧拍板。纯 SKILL 批引擎零改动 ⭐R96dr 复检补拍（同日·未发布并入本批）：输出全表格化与探一下流程A同构——【作品详情】标签表总是保留/【客户跟进卡】档位#评论客户四列表/阶段2确认【回复内容】【私信内容】表格化+【后续执行】批次表/AI话术「基于个性化数据库生成」每次必带一句/档位计数一行/栗子仪式对齐R96ab（✅符号+贴任务开工语+零过程旁白+免费采集不念额度+收尾语后零输出）。原批拍板： 1.3.9→1.4.0 触达回评互动闭环批（⭐2026-10-30 拍板）：①前置门槛——触达/回评必须先有评论采集（没有就先推「栗子触达/探一下」采评论），只推 A3 及以上评论；②序号点名制——A3 名单带序号（1/2/3…），用户按号选要回评/私信谁；③确认制四阶段——采评论→序号名单→选号生成 AI 建议→用户确认批次与文案→才执行（分批每批≤5 条，批内间隔回评 30-60s/私信 90-120s，批间≥30min）；④探栗 AI 默认（个性化线索库：贴评论原文+A3 档位+followup 记忆）+触达后 lf_leads 完整记账+对话端任务进度表格（完成打勾+下一步）。新三工具：leadsradar_comment_reply（AI 回评 3 候选，与插件评论弹窗「AI 回复」同源同池）/ leadsradar_mark_lead（标已回留痕/已留资/流失/重开，云端 lf_leads 与插件收件箱同一账本跨宿主可查）/ leadsradar_lead_records（查线索账本四档筛选+统计，全终端聚合）。「栗子回复」「栗子触达记录/谁还没回」触发词转正。⭐R96cs 1.3.8→1.3.9：AI 私信话术开窗（⭐2026-10-28 用户拍板「先把我们能做的做好再测试宿主能不能代发」——成交栗触达链与插件评论弹窗「AI 私信」打通：①新 MCP 工具 leadsradar_dm_reply（19→20）与插件 reply-inbox fetchDmReplies 同源同链（POST /api/generate/dm-reply，Bearer jwt）——comment_text 必填+commenter_name/note_title/platform/intent_level 选填+stage first 首触/followup 追问+lead_id 二触以上传，fallback 自动建档 lf_leads（⭐233 口径）+aiReply 会员日限；②插件端 agent-tasks.ts executeDmReply（executeGetDailyReport 同范式）+分发注册 mode=dm_reply+UNSUPPORTED 列表补词；③web dm-reply route 补 fallback 评论原文兜底（Agent 链评论只落本地库 r96f 口径云端 lf_collected_comments 无该评论 lead.comment_id 空必 404「评论原文缺失」断链——commentContent 空时直接用 fallback.comment_text）；④SKILL 触达包升级——私信段已登录调 dm_reply（3 候选挑 1 贴评论原话成稿照抄即发），未登录/429 降级宿主自写（原格式保留）；触达包每条带评论者主页 URL（采集回执 author_url）；宿主代发纪律不变（≤5 条/不改写），代发能力待实测。引擎+web 混合批：重载插件+web 部署+npm 发版三件全做。⭐R96y 收尾栗子发言（全端规则「开头结尾都是栗子发言」，与开工语对仗）：「名单到手，按节奏跟单 💰」→「🌰 **成交栗**：名单到手，按节奏跟单 💰」（1.3.7=⭐R96n slogan 用户定版开工语「捞单去，话术随身 💰」→「线索成交，一触即达 💰」（漏斗末环成交，「触」嵌精准触发词栗子触达）（1.3.6=⭐R96m 同上定版）（1.3.5=⭐R96f 同上定版）（1.3.4=⭐R96e 头像化）
  helper: "1.4.49"
  // ⭐R96g1ba 1.4.48→1.4.49：日报样例行数即规格加固（最新线索样例 2 行→3 行+排满 20 行省略行标注、爆款榜单画出真实表头+列满 12 行标注——与 closer 实报「20 条只显 6 条」同款病根：宿主照抄样例行数而非执行行数指令，样例占位行仅示结构非规格）｜⭐R96gq 1.4.47→1.4.48：日报表格规则+我的账号口径批（⭐2026-11-03 用户复测两反馈——①「最新线索没有按照表格的规则呈现啊」②「爆款榜单和最新线索应该是我的账号的数据啊，你看看web里面的日报」根因=引擎 buildLocalActivityBriefing 全量取数未对齐 web 端 execDailyBriefing ⓭1 口径+SKILL 最新线索段只定名单式未定表格：①最新线索升表格 |#|A3|客户|评论|来源|（A3 列 level 映射🟢🟠🟡+来源列 note_title 截前12字，与看板七列同规则）②爆款榜单+最新线索标注「我的账号」口径（引擎侧已限：线索 source_type=own、top_notes 限 self 账号作品——对标/截流线索与别人作品不进日报，未绑我的账号时爆款榜单恒空引导栗子扫我的号）；配套引擎批 ADAPTER 1.2.177 须重载插件）| ⭐R96gn 1.4.46→1.4.47：日报仪式化五件套（报头 📰 栗子日报 日期/段间 ---/段首锚点 🔴最新线索 🔥爆款榜单 🎯对标命中 ⚙️系统信息/关键数字加粗/报尾日期戳）+骨架样例定版+云端报/纯活动简报/空日报三形态同款（空态不素版）｜⭐R96gm 1.4.45→1.4.46：日报四段式统一形态（⭐2026-11-03 拍板回归原设计）——【最新线索】20 条（云端 a3Strong/本地 samples 前 20 带 level 圆点）/【爆款榜单】12 条（云端 hotHits/本地 top_notes）/【对标命中】12 条（radarRank/空态行）/【系统信息】（system+report 摘要+本地统计行），云端五段映射收骨架+出口锚点跟迁（存选题锚爆款榜单、触达锚最新线索）｜⭐R96gcj 1.4.44→1.4.45：日报 activity_report 本地活动简报渲染（无云端报 fallback 成主内容+空报新口径「count=0 且无 activity_report」+纯活动简报出口锚 samples note_url） | ⭐R96gba~gce 1.4.38→1.4.44 五连跳：gba 主副词总纲+gbb 主词拆解粒度+gbc 对外展示条款/栗子帮助主词化+gcd 栗子日报主词化/免费解读措辞修正+gce 日报两动作/登录出口｜⭐R96gaw 1.4.37→1.4.38：栗子查作品【下一步行动】下载/提取对调（五维评分拍板：下载 3.50 > 提取 3.20——查到旧采作品最常见诉求是拿素材，文案已在库里随时可提取）｜⭐R96gas 1.4.36→1.4.37：菜单/路由随 closer 更名批——菜单 00 行提示语定版「栗子在吗 · 栗子档案/版本/登录/帮助」+03 行「栗子触达/回复/私信 <作品链接> · 栗子我的线索 · 栗子触达设置」+description 触发词家族栗子守家→栗子我的线索（旧词兼认）+五节派活路由表成交栗行同步｜⭐R96gar 1.4.35→1.4.36：栗子守家路由注册——成交栗族触发词加「栗子守家」，管家栗菜单/转派同步（「回自己账号的评论/我的待回复」类意图转派成交栗）｜⭐R96gaq 1.4.34→1.4.35：栗子版本主词定级批（⭐2026-11-02 用户问「栗子版本也包含更新，栗子版本和栗子更新哪个作主词？展示格式是啥？」）——主词=栗子版本（栗子更新/版本详情/什么版本为同族别名等价触发），展示格式恒定=【栗子版本】七行对照卡（表名固定禁变体）——一节触发词行+三节模板条+description 三处同步｜⭐R96gap 1.4.33→1.4.34：栗子版本卡批（⭐2026-11-02 用户问「管家栗，栗子版本或栗子更新要不要加一个？查看版本详情？」拍板加）——注册「栗子版本/栗子更新/版本详情/什么版本」触发词（管家栗自己答不转派）+三节固定模板版本详情卡（探栗MCP+五技能+插件七行当前/最新对照：当前读各技能 frontmatter version/adapter.version/extension.extensionVersion，最新读 skills_latest/plugin_latest/adapter.update.latestVersion；latestVersion null 显「—未查」禁编）+菜单 03 行成交栗指令重排（栗子触达<作品链接>·栗子回复/私信·栗子触达记录/设置，与 closer 1.4.25 触发词族对齐）+派活路由表加栗子私信/栗子版本｜⭐R96g1ah 1.4.32→1.4.33：路由表补「栗子触达设置→成交栗」（⭐五问批 Q1 新触发词——查改触达话术设置：手动固定稿/AI 生成要求/字数/文档开关；description 家族词表/员工表 03 行/派活路由表三处同步防误接）｜⭐R96dy 1.4.31→1.4.32：菜单指令三处精简（⭐2026-10-31 用户复检菜单认知成本：①00 行「栗子档案/查/登录 · 帮助/教程」→「栗子档案/登录/帮助」——栗子查与栗子档案包含关系撤菜单不撤触发词、帮助/教程语义重复并一词「帮助」；②成交栗行删「/谁还没回」口语别名撤菜单不撤触发词；③洞察栗行「栗子研究/复盘 <对象>」拆「栗子研究 <作品/账号链接/关键词>」·「栗子复盘」两组——研究=外部对象拆解、复盘=我的账号专属动作，并写一组易误导） ⭐R96dw 1.4.30→1.4.31：菜单 00 行删「权益」+观察期语义同步（⭐2026-10-31 用户问「栗子在吗、栗子登录、栗子权益是一个东西？删一个删哪个？」拍板：三个不是一个东西——在吗=报到+技能自检入口、登录=配对登录动作（未登录唯一入口）、权益=档位/到期/积分查询；登录与权益输出同款三区块模板（⭐R96cu）重叠最高，删「栗子权益」——撤菜单不撤触发词（R96du 查对标库先例：喊「栗子权益/栗子会员」照常按三点五固定模板答）；另 description 转派清单观察期改口「命中条件对两端生效、观察期为云端监控观察窗」）。⭐R96dv 1.4.29→1.4.30：转派清单同步（radar 1.2.57 命中规则开窗批）——description 转派清单补「命中条件/观察期（⭐R96dv 命中规则开窗，对两端生效需登录）」+遇「改命中条件/观察期」类意图直接转派情报栗，L210 派活路由表情报栗行同步。⭐R96du 1.4.28→1.4.29：报到菜单精简（⭐2026-10-31 用户拍板情报栗指令列简化为「栗子加/删对标（及监控），栗子扫对标/扫我的」+管家栗自己上表 00 行；查对标库撤出菜单——与栗子档案同属「查已有」包含关系，触发词照常认能力不丢；禁造「栗子设置」泛词——未注册且与管家栗教程/设置问答路由打架，设置入口一律用真触发词并写「栗子扫描（及监控）设置」）——【AI员工】表 00-04 五行（00=管家栗前台经营者非链路工位，能力语与开场定位语同款）+情报行四组精简+L73 栗名呈现规范注记。⭐R96dt 1.4.27→1.4.28：转派清单同步（radar 1.2.56 扫描/监控设置升级批新注册「栗子监控设置」→情报栗）——description 转派清单补「栗子监控设置→情报栗——与栗子扫描设置同路（本地扫描条数/评论采集开关与云端监控回显）」，遇「扫描监控设置/云端监控频率」类意图直接转派情报栗禁答办不了。⭐R96dr 1.4.26→1.4.27：转派清单同步（closer 1.4.0 触达回评闭环批）——「栗子回复/AI 回评/栗子触达记录/谁还没回/未完成任务」类意图转派成交栗；管家栗自己也能直接答线索账本四档统计（leadsradar_lead_records 轻查询），深度触达编排仍归成交栗。⭐R96dq 1.4.25→1.4.26：转派清单同步批（radar 1.2.55 新注册「栗子扫描设置」→情报栗）——description 转派清单补「栗子扫描设置→情报栗——扫描规则（首扫/复扫条数、深扫评论开关与上限）的查看与修改也是情报栗的写操作」，遇「改扫描设置/首扫多扫点/复扫条数」类意图直接转派情报栗禁答办不了。⭐R96dm 1.4.24→1.4.25：转派清单同步批（⭐2026-10-30 用户要求「栗子加/删/查/扫对标（或我的号），栗子加/关监控」七词盘点——六词早已注册，唯「栗子查对标」未注册；radar 1.2.52 新注册「栗子查对标」→情报栗查对标库路径，helper description 转派清单同步补栗子查对标→情报栗，边界=带「对标/监控」字样归情报栗）。⭐R96dl 1.4.23→1.4.24：转派清单补全批（⭐2026-10-30 用户实测「云南阿叁（旮旯食堂）取消监控」被管家栗误接答「办不了只读不写、请去插件手动关」——根因=description 转派清单停在 R96as 四词，R96bj 删对标/R96ca 关监控/R96ap 查对标库等后续动作词全漏，宿主误路由后管家栗无转派依据只能拒办；修=清单补「栗子删对标/栗子关监控→情报栗（取消监控/别盯这个号了/把监控关了同认，对标与监控增删开关全是情报栗写操作）」+员工表情报栗行指令列同步 + 落死禁令「禁止答办不了/禁止指引手动操作，一律转派情报栗带账号名」）| ⭐R96dg 1.4.21→1.4.22：九行额度表禁删行（⭐2026-10-30 用户验收三卡实测「栗子权益」表抄漏第九行 AI 积分余额——旧硬规「填八行额度表（…+AI 积分余额行）」计数含糊，宿主按八行抄漏积分行；改「九行额度表禁删行：八行额度+第九行 AI 积分余额（数字取 account.aiCredits 真值，null 显「—」，禁照抄样例 1150）」）| ⭐R96de 1.4.20→1.4.21：档案删体检行+null省略批（反馈2a 档案23:09「到期 未拿到（接口没有返回…）」失败感文案→拍板 null 字段直接省略、下次拿到自然出现；反馈2b 体检两段⚠️→拍板「档案是资产清单不是问题清单，不抢细分栗子的活」整行删；样例残留 2027-10-17/对标位4/24 修正为 2026-11-26(还剩28天)/4/8；反馈1 催续费句+旧三行权益=宿主卡1.4.19旧技能产物，真源已净无需改）| ⭐R96da 1.4.19→1.4.20：权益明细+链接可点批（用户实报「1、有Bug，数据怎么没链接呢」「2、【会员权益】不对啊…提取文案的次数、AI回复此时等等」）①【会员权益】三行空泛话术→九行额度明细表（提取文案 100 次/月·AI 回评/私信同池 25 条/天·换选题 15 次/天·选题评分 30 次/月·复盘周报 1 份/周·监控位 8·对标位 24·账号组 2 组·AI 积分余额，真源 web src/lib/daily-limits.ts 抄录「档位额度常量表」禁改数禁编，usageLocal 非空括注今日已用 N）②链接可点铁则——一切 web/官网地址写完整 https:// 裸 URL 独立成行（membership/topics/farm/creative/faq/academy/leadsradar.cn），禁反引号包域名（渲染成 inline code 点不开）③pickAccountSnapshot 白名单 7→10 字段补透传 email/loginProvider/usageLocal——插件侧 local-agent-connector 十字段早已返回但被 mjs 白名单丢弃，修「邮箱/到期接口没返回」假象（DB 真值齐全：pro_monthly/2026-11-26/1150 分/8 监控位）。⭐R96cy 1.4.18→1.4.19：管家栗六反馈批（⭐2026-10-29 测试1/2/3 实报）①档案云端资产开窗真数（拍板「云端资产没有开窗」）——accounts 源回执新增 cloud_counts（选题仓库五段明细/跟进线索/创作成片，/api/pipeline-counts 加 Bearer 双鉴权+creative 段），缺省退「登录后可查」禁编数②权益行进档案（拍板「到期日期和账号权益也没开窗吗？还有监控位置、对标位置、每日使用量」）——档位/到期/积分（slots 接口扩 plan_expires_at/ai_credits+refreshPlanEntitlements 回填，修「到期日期没拿到」）+监控位/对标位（库况行）+usageLocal 今日用量行③邮箱口径（拍板「微信登录的没有邮箱咋显示」）——web 端 wx_*@wechat.local 占位改发 null+login_provider，插件端旧缓存同款兜底，显「微信登录（未绑邮箱）」④总览不点名对标账号（拍板「不必额外强调除非继续问」）⑤帮助卡（拍板「没看到下一步行动/档位连接冗余」）——【下一步行动】三条（丢链接实操+leadsradar.cn/faq+栗子学院 academy）+禁附档位/连接段，「学院暂无」旧口径改学院上线⑥Agent 采集 tab 彻底后台零闪烁（拍板「能不能不要」——agent-tasks 五处前台改 active:false，推翻 r75 口径，节流风险实测监控）。上批 R96cv： 栗子档案重排+查类模板化（用户拍板「档案应包括对标/选题/报告，采集记录考虑值不值得，线索农场/创作工厂要不要，【下一步行动】也要有，每一类单独查都要表格+下一步行动」）：①档案总览=本地三真值行（对标账号 accounts/研究报告 reports/采集作品 works——定位「素材池」值得展示：采过的详情+评论都在库、下载/提取复用不占额度）+选题储备行（真源云端 R96bf 口径本地 works≠云端仓库禁充数，给入口不给假数）+表下云端指路行（线索农场 /farm=dm_reply 线索归档地、创作成片 /creative=web 创作工厂，本地无源禁编数）+体检行+【下一步行动】固定两条（栗子查细看入口+app.leadsradar.cn 云端资产入口）；②栗子查模板化——每类输出「完成行+表格+【下一步行动】」两段式与总览同构：查对标（|对标|平台|粉丝|监控|→扫对标/加监控）、查作品（|标题|平台|👍/💬|采集日|→提取/下载）、查报告（四类分组计数+最近一份→解读/新研究）、查评论（需带链接+A3 色点表）、查选题（本地无源直接指路云端真值禁 works 充数）。⭐R96cu 1.4.16→1.4.17：登录/权益固定三区块模板（⭐2026-10-29 用户实报「栗子登录」输出缺会员到期时间与会员权益明细+拍板「这类登录和会员内的要有固定展示模板【基本信息】【会员权益】【下一步行动】符合 UI 互动规范，栗子登录/栗子权益类关键词都要能路由」）：①三点五升「栗子登录与栗子权益」——登录成功/已登录幂等/权益问询三入口共用固定模板：三区块【基本信息】（昵称/邮箱/档位/到期两列表）→【会员权益】（你档位内已解锁，逐条一行：云端 24h 监控·监控位 N 个/AI 积分 N/额度更优；free 档改列登录可用项）→【下一步行动】（栗子在吗看连接任务+app.leadsradar.cn/membership 续费升级）；②模板硬规四条——三区块固定与创作栗同构/五字段一个不缺（到期必给：有值报日期+剩余天数、plan=free 写「—（免费档无到期）」、null 写「没拿到」禁编「长期有效」）/权益按档位列已解锁项禁「对比参考」（R96cr 口径沿用）/下一步行动固定两条；③路由全覆盖——description 注册「栗子权益/栗子会员」+「我的权益/会员到期/积分还剩多少」问句族，派活路由表管家栗行加栗子登录/栗子权益/栗子会员，第三节权益问答升「按三点五固定模板输出」。纯 SKILL 批零引擎改动。⭐R96cr 1.4.15→1.4.16：管家栗权益四案（⭐2026-10-28 用户实测「了解下我的详细权益」交付编造——pro_monthly 个人版被报「个人版（免费注册档）·无（长期有效）」，到期/积分/邮箱全无数据源自由发挥）：①引擎 readAccountSnapshot 扩权益五字段 plan/planLabel/planExpiresAt/aiCredits/monitorSlots（数据源=R96cm refreshPlanEntitlements 回填+配对登录/JWT 续期回填到期+消费回写余额键兜底 lf_me_cache）+mjs statusSnapshot account 白名单同步透传；②SKILL 权益硬规——档位/到期/积分/监控位一律照抄 account 字段，null=如实「没拿到，去插件个人中心看」，禁编「免费注册档/长期有效」注解、「会员额外权益对比表」（已是会员列「你已解锁」）；③FAQ 新增「怎么使用」四句口诀定版（探一下→加对标→下载/提取→触达）+拆「加对标=开监控」歧义（加监控独立词·会员权益），派活路由表同步拆词；④技能自检结果必须可见（全最新时连接行括号并写「MCP已最新·技能全最新」——用户实报报到块看不出自检做没做）。引擎批：插件需重建重载生效 ⭐R96cg 1.4.14→1.4.15：报到更新中提示（⭐2026-10-28 用户实报「栗子在吗更新很久，能不能给个提示，比如更新中之类的」——技能全文 60-80KB 拉取+写文件 10-60 秒静默干等像死机）：报到纪律「技能版本自检+自动更新」补两条——①发现有落后技能、动手拉全文之前，先输出一行提示「🔧 技能有更新：<栗名1> vX→vY、<栗名2>…正在自动更新（约 10-60 秒），稍等…」再逐个干活（多技能落后提示行一次列全禁逐个刷屏；长任务进度反馈不算 R96i 禁的实查旁白）；②只拉落后技能的全文——版本已最新的技能禁调 leadsradar_get_latest_skills（白拉 60-80KB 只会更慢）。⭐R96bz 1.4.13→1.4.14：多指令调度七规定版（⭐2026-10-27 用户实报「栗子提取+探一下 <同一链接>」双指令连做场景+拍板「1、2执行，多指令的时候如果指令有缺失或者冲突应该询问，如果太多指令不应该重复执行应该有个上限吧」——helper SKILL 第五节派活三段式后新增整段：①照单全收按说话顺序连做 ②各栗各段身份不混禁合成混合报告 ③失败隔离 ⚠️ 报因+下一个照常 ④重复指令去重禁白扣额度 ⑤缺失要问禁瞎猜 ⑥冲突要问禁自作主张 ⑦上限 3 个超出先列清单问优先级） ⭐R96as 1.4.12→1.4.13：触发词动作化换词 10 处——description 家族词（栗子下载/栗子存选题/栗子提取→创作栗；栗子加对标/栗子扫对标/栗子加监控/栗子扫我的→情报栗，旧词栗子入库/栗子对标仍认）、报到菜单【AI员工】表情报栗/创作栗指令列（情报加 `栗子扫对标/扫我的`、创作入库→存选题）、报到纪律合并式描述、空日报指路、体检行、派活路由两行、FAQ 四句话。⭐R96am 1.4.11→1.4.12：报到技能自检升级自动更新流（落后不再只指路——逐技能调 get_latest_skills 拿 content，coding 宿主直接写入 SKILL.md 原路径完成自更新，纯对话宿主出整体复制块）+重启防呆强化（adapter.update=updated-pending-restart 必提醒「完全退出宿主重开生效」——npm 换盘/自更新落盘后进程不热替换，MCP 侧已加磁盘对比保底根治节流盲区）。⭐R96u 1.2.45→1.2.46：①报到菜单剥🚧待开发行（用户复检「还是有这个尾巴…不要强调」——推翻 R96r 待开发行：待开发词并入指令列展示（成交栗 `栗子回复/触达`、创作栗 `栗子下载/…/成片`），菜单不强调、能力未上线应答「还在开发中」口径保留）+指令列增补监控/成片（情报栗 `栗子对标/监控`）；②创作栗下载交付三区块重构（用户复检三反馈：标题斜体独行段→【作品信息】两列窄表对齐情报栗【作品详情】；落盘散装行→【下载目录】三列表 |文件|格式|位置|+表下完整路径题注；尾部括号接续指令→【下一步行动】编号短句行与 radar 全端同规，推翻 R96o creator 括号式）——下载交付=完成行+【作品信息】【下载目录】【下一步行动】三区块平铺无总头；helper 1.4.10→1.4.11、creator 1.2.8→1.2.9 同批 ⭐R96t 1.2.44→1.2.45：报到菜单单区块（⭐2026-10-24 用户复检「下面的命令词重复，上面的不全」）——【命令词】四行区块整删，指令全并进【AI员工】表第三列合并式（情报 `探一下 <作品/账号链接/关键词>` · `栗子对标 <账号链接>` / 创作 `栗子下载/提取/入库 <作品链接>` / 成交 `栗子回复/触达 <作品链接>` / 洞察 `栗子研究/复盘 <作品/账号链接/关键词>`——家族词斜杠并写一格收全，两处重复源消灭）；表头「口号」→「能力」、「命令词」→「指令」；防重复条款（报到菜单每区块/每行只渲染一遍禁复读——用户实报宿主渲染完菜单后末尾又残影重复洞察栗行+待开发行）；helper 1.4.9→1.4.10 同批 ⭐R96r 命令词区加待开发预告行（⭐2026-10-23 用户拍板「栗子回复是直接去回复评论区，还不确定能不能做到，可以写一个待开发；另外增加一个栗子成片，也是在待开发」）：命令词区四行后加一行「🚧 待开发：`栗子回复 <作品链接>`（直接回复评论区）· `栗子成片`（视频一键成片）」——不占员工编号 01-04（编号只给已上线四栗），用户喊待开发词就答「还在开发中，先用 XX」别硬执行；纪律段「栗子回复」定位从「助记简写」改「待开发预告词」（上线前触达一律用栗子触达）（1.4.8=⭐R96q 报到菜单第三列「干什么」→「命令词」简略式（⭐2026-10-23 用户复检「把命令词替换干什么，然后命令词按照这种简略的方法来续写，后面的链接还是照常，列举各种类型的链接，前面我帮你写出来了」——用户亲拟四行简写）：①【AI员工】表第三列表头「干什么」→「命令词」，内容改用户亲拟简略式 inline code：情报 `探一下…链接`/创作 `栗子下载/提取/入库…链接`/成交 `栗子回复/触达…链接`/洞察 `栗子研究/复盘…链接`——职能描述列退役（口号已概括职能，命令词直接给用法入口）②【命令词】区四行展开列举各类型链接：`探一下 <作品链接>`·`<账号链接>`·`<关键词>`、`栗子下载 <视频/图集/主页链接>`、`栗子入库/提取 <作品链接>`、`栗子触达 <作品链接>`、`栗子研究 <作品/账号/赛道>`、`复盘我的账号`——以注册触发词为准（表格简写「栗子回复」是助记，正式词=栗子触达）（1.4.7=⭐R96p 报到菜单两区块定版（⭐2026-10-23 用户复检五反馈「洞察栗放第四个；表头员工改AI员工；基本情况改连接状态；四个栗子要不要加工号（求意见）；要展示四栗一句话Slogan+给个Tab就是命令词；不给复制」）：①报到菜单拆两区块——【AI员工】三列表（表头「员工」→「AI员工」，列=AI员工/口号/干什么）+【命令词】四行编号列表（栗名带🌰+指令 inline code，括号注只写「照着打就行」）②行序调整——情报→创作→成交→洞察（主获客链路排位：探线索→出内容→促成交，洞察=深度辅助殿后；第五节派活路由表同步调序）③表标题【基本情况】→【连接状态】④工号 01-04 前缀定版（`01 🌰 **栗名**` 形式，意见三条=工号感/排位可见/两区工号对应快扫，用户采纳）⑤四栗口号上表（情报「探一下，线索不错过 🔍」/创作「获客视频，一键生成 🎬」/成交「线索成交，一触即达 💰」/洞察「获客方法，一探便知 🧠」）⑥放弃复制诉求（推翻 R96n 复测「指令并进表格括号 inline code」口径——命令词区纯呈现，工号两处对应 `01`↔`1.`）（1.4.6=⭐R96o 两改：①头像禁图令范围注——本条禁的是远程图床 URL 的装饰图（头像/表情类，宿主管线必坏）；创作栗图集交付的本地 file:/// 素材图是用户要看的内容，属例外见 creator 动作 2，裂图自删降级②报到菜单「边界」注取消——radar【下一步行动】独立 code block 已退役改编号短句行，全端统一紧凑（1.4.5=⭐R96n 复测 报到紧凑化（⭐2026-10-23 用户复测反馈「删多余文案帮你管理各项数据和 4 个 AI 员工」「干什么跟提示词合并作注释」「复制的提示词占很长一串每个都是单独卡片块，有没有更紧凑的可复制格式」）：①定位语砍尾「，帮你管理各项数据和 4 个 AI 员工」——定位语一句收，管理职能报到块自己会说②8 个独立 code block 全退役并进「干什么」表格括号缀 inline code（推翻 R96l「一律独立 code block」口径：8 块占太长；宿主对表格内 inline code 虽无复制按钮，但指令短、照着打即可——边界：radar 流程输出【下一步行动】code block 不受影响，那是长指令复制即发场景）③表头注改「括号里就是试一试的指令，照着打或选中复制」④情报栗描述砍「评论区」三字（1.4.4=⭐R96n 报到开场定位语嵌入「经营你的AI获客团队」（用户定版五句之首，报到纪律新增开场定位语条）+派活示例开工语同步「探一下，线索不错过 🔍」（1.4.3=⭐R96m 派活示例同步）（1.4.2=⭐R96l 报到呈现四改（⭐2026-10-23 用户复测反馈「栗子：改为AI员工；情报栗这些前面加emoji🌰，未来五大栗子出现前面都要加emoji；探一下/栗子对标能不能改为一个复制的按钮？表格里面不能单独给复制按钮吗」）：①统称改「AI 员工」——开场「4 个 AI 栗子员工」→「4 个 AI 员工」+【栗子报道】→【AI员工报道】（「栗子」一词只活在触发词家族「栗子X」与唤醒词里——路由机制禁改禁加 emoji）②栗名呈现规范——凡栗名（情报栗/洞察栗/创作栗/成交栗/管家栗）在用户可见输出出现前面一律 🌰（报到表格第一列🌰**栗名**；消息流前缀 R96f 已统一）③报到菜单提示词独立 code block 化——表格「试一试」列退役（宿主对表格内 inline code 不给复制按钮），8 句提示词各一块独立 code block 排表格后顺序对应（探一下/栗子对标/栗子研究/复盘我的账号/栗子下载/栗子入库/栗子提取/栗子触达——宿主对 code block 自带一键复制按钮点了就能用），模板外层围栏四反引号防嵌套提前闭合④纪律新增「栗名呈现规范」条（1.4.1=⭐R96i 报到 v3 简化：一句话介绍+小节化+头像退役+实查不出声+成本口径）（1.4.0=⭐R96f 派活三段式定版：任务复述+分配/专才栗一句开工语/完成汇报行——消息流弃图头像统一 🌰 短前缀）
};
var PLUGIN_LATEST = "1.0.0";
var FAST_LANE_MODES = /* @__PURE__ */ new Set([
  "query_local_data",
  "claim_pending_result",
  "save_topic",
  "add_monitor",
  "remove_benchmark",
  "pause_monitor",
  "scan_settings",
  "get_daily_report",
  "dm_reply",
  "comment_reply",
  "mark_lead",
  "lead_records",
  "touch_settings",
  "pair_login"
]);
var ADAPTER_VERSION = "1.2.184";
var HOST_LABELS = {
  "doubao-work": "\u8C46\u5305\u5DE5\u4F5C",
  // ⭐r85 字节系多客户端实测（用户已验证豆包客户端支持 stdio 连接器，与豆包工作同源）：
  // 每客户端一个 HOST 值 → 密钥分文件（指纹独立可配对）+ 适配器侧异宿主卫星共存（同开不互踢）；
  // 插件侧 doubao 独立宿主（批准卡跟胶囊走），设备名靠此处区分
  doubao: "\u8C46\u5305",
  feishu: "\u98DE\u4E66",
  workbuddy: "WorkBuddy",
  "kimi-work": "KimiWork",
  coze: "\u6263\u5B50",
  // ⭐r93 DeepSeek Harness（dsh）：一切皆插件架构，MCP 走官方 dsh-mcp-client（stdio），工具名带 mcp__leadsradar__ 前缀
  dsh: "DeepSeek",
  // ⭐r96g Codex 回归（r94 放弃后用户拍板回归，CLI·进阶档）：~/.codex/config.toml（TOML mcp_servers 段）
  codex: "Codex",
  claude: "Claude",
  // ⭐r96 千问办公：连接器入口「左侧连接器 → 添加」，支持粘贴 JSON / 手动填写（与豆包同款 STDIO 型）
  "qwen-office": "\u5343\u95EE\u529E\u516C",
  // ⭐r96e Trae（编程 CLI 宿主首个）：项目 .trae/mcp.json 配置拉起，本仓 dogfooding 实测
  trae: "Trae",
  // ⭐r96g CLI·进阶档扩容：Cherry Studio（设置→MCP 服务器→添加服务器 STDIO）；⭐r96t 删阶跃 AI（渠道下线）
  cherry: "Cherry Studio"
};
var HOST = (process.env.LEADSRADAR_AGENT_HOST || "doubao-work").toLowerCase();
var HTTP_MODE = process.argv.includes("--http") || process.env.LEADSRADAR_AGENT_HTTP === "1";
var HTTP_PORT = Number(process.env.LEADSRADAR_AGENT_HTTP_PORT) || 17375;
var DEVICE_NAME = process.env.LEADSRADAR_AGENT_DEVICE_NAME || `\u63A2\u6817 Agent (${HOST_LABELS[HOST] || "\u672C\u673A"})`;
var DEVICE_ID = `leadsradar-agent-${HOST.replace(/[^a-z0-9-]/g, "") || "local"}`;
var KEY_FILE = join(homedir(), `.leadsradar-agent-key-${HOST}.json`);
var LEGACY_KEY_FILE = join(__dirname, ".agent-key.json");
function log(...args) {
  process.stderr.write(args.join(" ") + "\n");
}
function pickAccountSnapshot(a) {
  if (!a) return null;
  return {
    loggedIn: a.loggedIn === true,
    nickname: String(a.nickname || "") || null,
    plan: typeof a.plan === "string" && a.plan ? a.plan : null,
    planLabel: typeof a.planLabel === "string" && a.planLabel ? a.planLabel : null,
    planExpiresAt: typeof a.planExpiresAt === "string" && a.planExpiresAt ? a.planExpiresAt : null,
    aiCredits: typeof a.aiCredits === "number" ? a.aiCredits : null,
    monitorSlots: typeof a.monitorSlots === "number" ? a.monitorSlots : null,
    email: typeof a.email === "string" && a.email ? a.email : null,
    loginProvider: typeof a.loginProvider === "string" && a.loginProvider ? a.loginProvider : null,
    usageLocal: a.usageLocal && typeof a.usageLocal === "object" ? a.usageLocal : null
  };
}
var __extProfileCache = { at: 0, result: null };
function detectExtensionProfiles() {
  if (Date.now() - __extProfileCache.at < 1e4) return __extProfileCache.result;
  const found = [];
  const roots = [
    { browser: "chrome", dir: join(homedir(), "AppData/Local/Google/Chrome/User Data") },
    { browser: "msedge", dir: join(homedir(), "AppData/Local/Microsoft/Edge/User Data") }
  ];
  for (const { browser, dir } of roots) {
    let profiles = [];
    try {
      profiles = readdirSync(dir).filter((n) => n === "Default" || /^Profile /.test(n));
    } catch {
      continue;
    }
    for (const prof of profiles) {
      if (found.some((f) => f.browser === browser && f.profile === prof)) continue;
      for (const file of ["Secure Preferences", "Preferences"]) {
        const p = join(dir, prof, file);
        let text = null;
        try {
          const tmp = `${p}.lf-probe.tmp`;
          copyFileSync(p, tmp);
          text = readFileSync(tmp, "utf8");
          unlinkSync(tmp);
        } catch {
          continue;
        }
        try {
          const settings = JSON.parse(text)?.extensions?.settings || {};
          for (const v of Object.values(settings)) {
            const extPath = String(v?.path || "");
            if (extPath && /leads?find|leads?radar/i.test(extPath)) {
              found.push({ browser, profile: prof });
              break;
            }
          }
        } catch {
        }
        if (found.some((f) => f.browser === browser && f.profile === prof)) break;
      }
    }
  }
  __extProfileCache = { at: Date.now(), result: found };
  return found;
}
function preferredBrowser() {
  try {
    const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    const cfgPath = join(appData, "leadsradar", "service", "config.json");
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    const db = String(cfg.defaultBrowser || "").trim();
    return db || null;
  } catch {
    return null;
  }
}
function extensionLaunchHint() {
  let found = detectExtensionProfiles();
  if (!found.length) return null;
  const pref = preferredBrowser();
  if (pref) {
    const pinned = found.filter((f) => f.browser === pref || pref === "edge" && f.browser === "msedge");
    if (pinned.length) {
      found = pinned;
      const cmd2 = found.map((f) => `start ${f.browser} '-profile-directory="${f.profile}"'`).join(" \u6216 ");
      return `\u5DF2\u6309\u63A2\u6817 MCP \u8BBE\u7F6E\u56FA\u5B9A ${pref === "edge" ? "Edge" : "Chrome"} \u4E3A\u9ED8\u8BA4\u6D4F\u89C8\u5668\u2014\u2014\u8FD0\u884C ${cmd2} \u6253\u5F00\u5B83\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5\uFF08\u2B50R96ez \u81EA\u6551\u4EC5\u5C1D\u8BD5\u4E00\u6B21\uFF1A\u6CA1\u8D77\u6765\u6216\u6CA1\u7EC8\u7AEF\u6743\u9650\u5C31\u505C\u624B\uFF0C\u7981\u6362\u59FF\u52BF\u518D\u8BD5\u2014\u2014\u627E exe \u8DEF\u5F84\u76F4\u542F/\u6362 shell/\u6362 PowerShell \u90FD\u4E0D\u5FC5\uFF1B\u76F4\u63A5\u8F6C\u7528\u6237\u5F15\u5BFC\uFF1A\u8BF7\u7528\u6237\u624B\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\u70B9\u4E00\u4E0B\u63A2\u6817\u63D2\u4EF6\u56FE\u6807\uFF0C\u6216\u5230\u63D2\u4EF6\u8BBE\u7F6E\u628A\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u5173\u4E00\u4E0B\u518D\u5F00\uFF09`;
    }
  }
  const cmd = found.map((f) => `start ${f.browser} '-profile-directory="${f.profile}"'`).join(" \u6216 ");
  return `\u5DF2\u63A2\u6D4B\u5230\u63D2\u4EF6\u88C5\u5728 ${found.map((f) => `${f.browser === "msedge" ? "Edge" : "Chrome"} \u7684 ${f.profile}`).join(" \u548C ")}\u2014\u2014\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\uFF0C\u8FD0\u884C ${cmd} \u6253\u5F00\u5BF9\u5E94\u7A97\u53E3\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5\uFF08\u2B50R96ez \u81EA\u6551\u4EC5\u5C1D\u8BD5\u4E00\u6B21\uFF1A\u6B64\u547D\u4EE4\u6CA1\u8D77\u6765\u6216\u6CA1\u7EC8\u7AEF\u6743\u9650\u5C31\u505C\u624B\uFF0C\u7981\u6362\u59FF\u52BF\u518D\u8BD5\u2014\u2014\u627E exe \u8DEF\u5F84\u76F4\u542F/\u6362 shell/\u6362 PowerShell \u90FD\u4E0D\u5FC5\uFF1B\u76F4\u63A5\u8F6C\u7528\u6237\u5F15\u5BFC\uFF1A\u8BF7\u7528\u6237\u5728\u6D4F\u89C8\u5668\u91CC\u70B9\u4E00\u4E0B\u63A2\u6817\u63D2\u4EF6\u56FE\u6807\uFF0C\u6216\u5230\u63D2\u4EF6\u8BBE\u7F6E\u628A\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u5173\u4E00\u4E0B\u518D\u5F00\uFF0C\u5F04\u597D\u8BF4\u58F0\u590D\u67E5\uFF09`;
}
var BROWSER_EXE_CANDIDATES = {
  chrome: [
    join(process.env.ProgramFiles || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
    join(process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
    join(homedir(), "AppData", "Local", "Google", "Chrome", "Application", "chrome.exe")
  ],
  msedge: [
    join(process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
    join(process.env.ProgramFiles || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe")
  ]
};
function resolveBrowserExe(browser) {
  for (const p of BROWSER_EXE_CANDIDATES[browser] || []) {
    try {
      if (existsSync(p)) return p;
    } catch {
    }
  }
  return null;
}
var __autoLaunchAt = 0;
function autoLaunchExtensionHost() {
  if (Date.now() - __autoLaunchAt < 6e4) return false;
  const found = detectExtensionProfiles();
  if (!found.length) return false;
  const pref = preferredBrowser();
  let targets = found;
  if (pref) {
    const pinned = found.filter((f) => f.browser === pref || pref === "edge" && f.browser === "msedge");
    if (pinned.length) targets = pinned;
  }
  const t = targets[0];
  if (!t) return false;
  __autoLaunchAt = Date.now();
  try {
    const exe = resolveBrowserExe(t.browser);
    if (exe) {
      spawn(exe, [`--profile-directory=${t.profile}`], { detached: true, stdio: "ignore", windowsHide: true }).unref();
      log(`[lf-agent] \u5DF2\u81EA\u52A8\u62C9\u8D77\u88C5\u63D2\u4EF6\u7684\u6D4F\u89C8\u5668\uFF1A${exe}\uFF08${t.profile}\uFF09`);
    } else {
      spawn("cmd.exe", ["/c", "start", "", t.browser, `--profile-directory=${t.profile}`], { detached: true, stdio: "ignore", windowsHide: true }).unref();
      log(`[lf-agent] \u5DF2\u81EA\u52A8\u62C9\u8D77\u88C5\u63D2\u4EF6\u7684\u6D4F\u89C8\u5668\uFF1A${t.browser}\uFF08${t.profile}\uFF0Cexe \u672A\u63A2\u6D4B\u5230\u56DE\u843D cmd \u94FE\uFF09`);
    }
    return true;
  } catch {
    return false;
  }
}
function loadOrCreateKeys() {
  for (const f of [KEY_FILE, LEGACY_KEY_FILE]) {
    if (!existsSync(f)) continue;
    try {
      const saved = JSON.parse(readFileSync(f, "utf8"));
      if (!saved.publicKey || !saved.privateKey) continue;
      if (f !== KEY_FILE) {
        try {
          writeFileSync(KEY_FILE, JSON.stringify(saved), "utf8");
        } catch {
        }
      }
      return saved;
    } catch {
    }
  }
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const entry = {
    publicKey: publicKey.export({ type: "spki", format: "der" }).toString("base64"),
    privateKey: privateKey.export({ type: "pkcs8", format: "der" }).toString("base64")
  };
  writeFileSync(KEY_FILE, JSON.stringify(entry), "utf8");
  return entry;
}
var keys = loadOrCreateKeys();
var fingerprint = createHash("sha256").update(Buffer.from(keys.publicKey, "base64")).digest().subarray(0, 16).toString("hex").match(/.{4}/g).join("-");
function signPayload(payload) {
  const privateKey = createPrivateKey({
    key: Buffer.from(keys.privateKey, "base64"),
    format: "der",
    type: "pkcs8"
  });
  return edSign(null, Buffer.from(payload, "utf8"), privateKey).toString("base64");
}
var DEVICE = {
  deviceId: DEVICE_ID,
  publicKey: keys.publicKey,
  displayName: DEVICE_NAME,
  host: HOST,
  adapterVersion: ADAPTER_VERSION,
  protocolVersion: PROTOCOL_VERSION
};
var LIST_TASK_TIMEOUT_MS = 5 * 60 * 1e3;
var NOTE_DETAIL_TIMEOUT_MS = 2 * 60 * 1e3;
var AgentBroker = class {
  constructor() {
    this.transfers = /* @__PURE__ */ new Map();
    this.taskWaiters = /* @__PURE__ */ new Map();
    this.lastProgress = /* @__PURE__ */ new Map();
    this.extension = { connected: false, extensionId: "", extensionVersion: "", sessionId: "", pendingResultCount: 0 };
    this.awaitingPairing = false;
    this.awaitingSince = 0;
    this.selfPaired = false;
    this.lastDisconnect = "";
    this.lastClose = null;
    this.lastPluginMsgAt = 0;
    this.client = null;
    this.downstreams = /* @__PURE__ */ new Map();
    this.relay = null;
    let listenAttempts = 0;
    let takeoverSent = false;
    this.portBlocked = false;
    const requestTakeover = () => {
      try {
        const probe = new import_websocket.default(`ws://127.0.0.1:${PORT}/extension`);
        const kill = setTimeout(() => {
          try {
            probe.terminate();
          } catch {
          }
        }, 1500);
        probe.on("open", () => probe.send(JSON.stringify({ type: "broker.takeover", fromDeviceId: DEVICE_ID })));
        probe.on("close", () => clearTimeout(kill));
        probe.on("error", () => clearTimeout(kill));
      } catch {
      }
    };
    const attach = (server, httpSrv) => {
      server.on("connection", (ws) => this.handleConnection(ws));
      server.on("error", (err) => {
        if (err?.code === "EADDRINUSE") {
          if (this.relay) return;
          if (listenAttempts > 20) {
            log(`[lf-agent] \u7AEF\u53E3 ${PORT} \u6301\u7EED\u5360\u7528\u8D85 1 \u5206\u949F\uFF0C\u964D\u9891\u4E3A\u6BCF 30 \u79D2\u91CD\u8BD5\uFF08\u5360\u7528\u539F\u56E0\u89C1\u4E0A\u65B9\u63A2\u6D4B\u7ED3\u679C\uFF1B\u671F\u95F4 connection_status \u53EF\u67E5 portBlocked\uFF09\u3002`);
            setTimeout(() => {
              if (!this.relay) tryListen();
            }, 3e4);
            return;
          }
          if (!takeoverSent) {
            takeoverSent = true;
            void this.probeOccupant(requestTakeover).then((v) => {
              if (v === "timeout" || v === "closed" || v === "error") {
                this.portBlocked = true;
                log(`[lf-agent] \u5360\u7528\u8005\u63A2\u6D4B\u65E0\u5E94\u7B54\uFF08${v}\uFF09\uFF1A\u7AEF\u53E3 ${PORT} bind \u88AB\u62D2\u5374\u65E0\u4EBA\u76D1\u542C\u2014\u2014\u5927\u6982\u7387\u88AB Windows \u52A8\u6001\u7AEF\u53E3\u4FDD\u7559\uFF08Hyper-V/WSL \u6392\u9664\u6BB5\uFF09\u5708\u8D70\uFF0C\u901A\u5E38\u51E0\u5341\u5206\u949F\u5185\u81EA\u52A8\u6062\u590D\uFF0C\u672C\u8FDB\u7A0B\u6301\u7EED\u91CD\u8BD5\u4E2D\u3002\u6C38\u4E45\u6839\u6CBB\uFF08\u7BA1\u7406\u5458 PowerShell\uFF0C\u8FD0\u884C\u4E00\u6B21\u5373\u53EF\uFF09\uFF1Anet stop winnat ; netsh int ipv4 add excludedportrange protocol=tcp startport=${PORT} numberofports=1 ; net start winnat`);
              } else {
                log(`[lf-agent] \u5360\u7528\u8005\u63A2\u6D4B\u7ED3\u679C\uFF1A${v}\uFF08self=\u672C\u5BBF\u4E3B\u5B64\u513F\u5DF2\u8BF7\u5176\u8BA9\u4F4D / other=\u5F02\u5BBF\u4E3B\u5C06\u8F6C\u536B\u661F\u4E2D\u8F6C\uFF09`);
              }
            });
          }
          log(`[lf-agent] \u7AEF\u53E3 ${PORT} \u88AB\u5360\u7528\uFF0C3 \u79D2\u540E\u91CD\u8BD5\u7ED1\u5B9A\uFF08${listenAttempts}/20\uFF09\u2026`);
          try {
            httpSrv.close();
          } catch {
          }
          setTimeout(() => {
            if (!this.relay) tryListen();
          }, 3e3);
        } else {
          log(`[lf-agent] Broker error: ${err?.message}`);
        }
      });
      httpSrv.on("error", (err) => log(`[lf-agent] httpSrv error \u515C\u5E95: ${err?.message}`));
    };
    const tryListen = () => {
      if (this.relay) return;
      listenAttempts += 1;
      const httpSrv = createHttpServer((req, res) => {
        const m = /^\/chestnut\/(\d+)\.webp$/.exec((req.url || "").split("?")[0]);
        if (m) {
          try {
            const buf = readFileSync(join(__dirname, "assets", `chestnut-${m[1]}.webp`));
            res.writeHead(200, { "Content-Type": "image/webp", "Cache-Control": "public, max-age=86400" });
            res.end(buf);
          } catch {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("chestnut not found");
          }
          return;
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("not found");
      });
      const server = new import_websocket_server.default({ server: httpSrv, path: "/extension" });
      httpSrv.listen(PORT, "127.0.0.1", () => {
        listenAttempts = 0;
        this.portBound = true;
        this.portBlocked = false;
        this.wss = server;
        log(`[lf-agent] Broker \u5DF2\u76D1\u542C ws://127.0.0.1:${PORT}/extension\uFF08\u542B\u5934\u50CF\u8DEF\u7531 /chestnut/{n}.webp\uFF09`);
        log(`[lf-agent] \u8BBE\u5907\u300C${DEVICE_NAME}\u300D\u6307\u7EB9\uFF1A${fingerprint}`);
        log(`[lf-agent] \u7B49\u5F85\u63D2\u4EF6\u8FDE\u63A5\uFF08\u63D2\u4EF6 \u2192 \u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u6253\u5F00\u5F00\u5173\uFF09\u2026`);
      });
      attach(server, httpSrv);
    };
    this.retryBindAfterRelayLoss = () => {
      listenAttempts = 0;
      takeoverSent = false;
      setTimeout(() => {
        if (!this.relay) tryListen();
      }, 300);
    };
    this.wss = null;
    this.portBound = false;
    this.clientExtensionId = null;
    tryListen();
  }
  send(obj) {
    if (this.client && this.client.readyState === this.client.OPEN) {
      this.client.send(JSON.stringify(obj));
      return true;
    }
    return false;
  }
  handleConnection(ws) {
    let joined = false;
    let sessionReady = false;
    let pokeTimer = null;
    let lastPong = Date.now();
    ws.on("pong", () => {
      lastPong = Date.now();
    });
    const pingTimer = setInterval(() => {
      if (Date.now() - lastPong > 15e3) {
        log("[lf-agent] \u63D2\u4EF6\u8FDE\u63A5 15s \u65E0 pong\uFF08\u50F5\u5C38\u8FDE\u63A5\uFF09\uFF0C\u5F3A\u5236\u56DE\u6536\u5EA7\u5E2D");
        try {
          ws.terminate();
        } catch {
        }
        return;
      }
      try {
        ws.ping();
      } catch {
      }
    }, 5e3);
    const pokeHandshake = () => {
      if (sessionReady) return;
      try {
        ws.send(JSON.stringify({ type: "device.hello", protocolVersion: PROTOCOL_VERSION, device: DEVICE }));
      } catch {
      }
      pokeTimer = setTimeout(pokeHandshake, 5e3);
    };
    setTimeout(() => {
      if (!joined && !sessionReady) pokeHandshake();
    }, 1e3);
    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (msg.type === "broker.takeover") {
        if (String(msg.fromDeviceId || "").startsWith("leadsradar-agent-")) {
          log(`[lf-agent] \u6536\u5230\u65B0\u5B9E\u4F8B ${msg.fromDeviceId} \u7684\u63A5\u7BA1\u8BF7\u6C42\uFF0C\u8BA9\u51FA\u7AEF\u53E3 ${PORT} \u5E76\u9000\u51FA\u3002`);
          try {
            ws.close(1e3, "superseded");
          } catch {
          }
          setTimeout(() => process.exit(0), 300);
        }
        return;
      }
      if (msg.type === "device.attach") {
        const attId = String(msg.deviceId || "");
        const isFamily = attId.startsWith("leadsradar-agent-") && attId !== DEVICE_ID;
        if (!isFamily || this.relay) {
          try {
            ws.send(JSON.stringify({ type: "device.attach.reject", reason: "not-allowed" }));
            ws.close(1e3, "reject");
          } catch {
          }
          return;
        }
        const device = msg.device && typeof msg.device === "object" ? msg.device : { deviceId: attId };
        ws.__lfDownstreamId = attId;
        sessionReady = true;
        if (pokeTimer) clearTimeout(pokeTimer);
        this.downstreams.set(attId, { ws, device });
        log(`[lf-agent] \u536B\u661F\u9002\u914D\u5668\u6302\u5165\u4E2D\u8F6C\uFF1A${String(device.displayName || attId)}\u2014\u2014\u4E0E\u672C\u8BBE\u5907\u5171\u4EAB\u540C\u4E00\u6761\u63D2\u4EF6\u8FDE\u63A5`);
        try {
          ws.send(JSON.stringify({
            type: "device.attach.ok",
            host: HOST,
            hostLabel: HOST_LABELS[HOST] || HOST,
            extension: { connected: this.extension.connected, extensionId: this.extension.extensionId }
          }));
        } catch {
        }
        this.broadcastDevices();
        this.notifyDownstreamsExtension(this.extension.connected);
        return;
      }
      if (ws.__lfDownstreamId) {
        this.handleDownstreamMessage(ws, msg);
        return;
      }
      if (!joined) {
        if (msg.type !== "broker.join") return;
        const joinerId = String(msg.extensionId || "");
        const holder = this.client;
        const holderOpen = holder && holder !== ws && holder.readyState === holder.OPEN;
        if (holderOpen && this.clientExtensionId && this.clientExtensionId !== joinerId) {
          log(`[lf-agent] \u62D2\u7EDD\u8FDE\u63A5\uFF1A${joinerId || "(\u65E0\u8EAB\u4EFD)"}\uFF08\u5F53\u524D\u6301\u6709\u8005 ${this.clientExtensionId} \u6B63\u5728\u4F7F\u7528\uFF09`);
          try {
            ws.send(JSON.stringify({ type: "broker.busy", heldBy: this.clientExtensionId }));
          } catch {
          }
          setTimeout(() => {
            try {
              ws.close(1e3, "busy");
            } catch {
            }
          }, 100);
          return;
        }
        if (holder && holder !== ws) {
          try {
            holder.send(JSON.stringify({ type: "broker.superseded", by: joinerId || "unknown" }));
          } catch {
          }
          setTimeout(() => {
            try {
              holder.close(1e3, "superseded");
            } catch {
            }
          }, 50);
        }
        this.client = ws;
        this.clientExtensionId = joinerId;
        joined = true;
        this.lastPluginMsgAt = Date.now();
        log(`[lf-agent] \u63D2\u4EF6\u5DF2\u8FDE\u5165\uFF08${joinerId || "\u672A\u77E5ID"}\uFF09\uFF0C\u53D1\u9001 broker.hello`);
        this.send({
          type: "broker.hello",
          protocolVersion: PROTOCOL_VERSION,
          serverName: "LeadsRadar Agent Adapter",
          // ⭐r76 devices 聚合：本机设备 + 所有挂着的卫星适配器（插件对每个已配对设备独立验签建会话）
          devices: [DEVICE, ...[...this.downstreams.values()].map((d) => d.device)]
        });
        return;
      }
      this.lastPluginMsgAt = Date.now();
      switch (msg.type) {
        case "extension.ping":
          this.send({ type: "broker.pong", at: msg.at });
          return;
        case "session.challenge": {
          const ds = this.downstreams.get(String((msg.challenge || {}).deviceId || ""));
          if (ds) {
            try {
              ds.ws.send(JSON.stringify({ type: "device.challenge", challenge: msg.challenge }));
            } catch {
            }
            return;
          }
          const c = msg.challenge || {};
          const payload = [
            "mediaclaw-agent",
            String(c.purpose ?? ""),
            String(c.deviceId ?? ""),
            String(c.challengeId ?? ""),
            String(c.nonce ?? ""),
            String(c.extensionId ?? ""),
            String(c.protocolVersion ?? PROTOCOL_VERSION)
          ].join("\n");
          this.send({
            type: "session.proof",
            purpose: c.purpose,
            deviceId: c.deviceId,
            challengeId: c.challengeId,
            signature: signPayload(payload)
          });
          return;
        }
        case "pairing.awaiting_approval": {
          const dsPairing = this.downstreams.get(String(msg.deviceId || ""));
          if (dsPairing) {
            try {
              dsPairing.ws.send(JSON.stringify({ type: "device.pairing.awaiting_approval", deviceId: msg.deviceId }));
            } catch {
            }
            return;
          }
          if (!this.awaitingPairing) {
            this.awaitingPairing = true;
            this.awaitingSince = Date.now();
            log(`[lf-agent] \u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF08\u8BBE\u7F6E\u9875 \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u5F85\u6279\u51C6\u8BBE\u5907\u300C${DEVICE_NAME}\u300D\uFF09`);
            log(`[lf-agent] \u6307\u7EB9\u6838\u5BF9\uFF1A${fingerprint}`);
          }
          pokeHandshake();
          return;
        }
        case "extension.hello": {
          sessionReady = true;
          if (pokeTimer) clearTimeout(pokeTimer);
          this.awaitingPairing = false;
          this.extension = {
            connected: true,
            extensionId: String(msg.extensionId || ""),
            extensionVersion: String(msg.extensionVersion || ""),
            sessionId: String(msg.sessionId || ""),
            pendingResultCount: Number(msg.pendingResultCount) || 0,
            // ⭐B7b-P1 未领取结果摘要透传（connection_status 展示 + claim_pending_result 领取引导）；
            // 旧版插件 hello 无此字段=空数组（不保留上次值：摘要必须与插件真源同步，宁缺勿旧）
            pendingResults: Array.isArray(msg.pendingResults) ? msg.pendingResults.slice(0, 10) : [],
            // ⭐r81 P0-3 登录态随握手上报（宿主 connection_status 可见，需登录的动作可动手前预检）；
            // 旧 hello 无此字段时保留上次值（防重握手瞬间丢登录态）
            account: msg.account ? pickAccountSnapshot(msg.account) : this.extension.account || null
          };
          log(`[lf-agent] \u5DF2\u8FDE\u63A5\u63D2\u4EF6 ${this.extension.extensionId} v${this.extension.extensionVersion}`);
          this.notifyDownstreamsExtension(true);
          return;
        }
        case "extension.account.update": {
          if (msg.account) {
            this.extension = {
              ...this.extension,
              account: pickAccountSnapshot(msg.account)
            };
            log(`[lf-agent] \u767B\u5F55\u6001\u66F4\u65B0\uFF1A${msg.account.loggedIn === true ? `\u5DF2\u767B\u5F55\uFF08${msg.account.nickname || "?"}\uFF09` : "\u672A\u767B\u5F55"}`);
            this.notifyDownstreamsExtension(this.extension.connected);
          }
          return;
        }
        case "task.progress": {
          const p = msg.progress || {};
          const dsProgress = this.downstreams.get(String(msg.deviceId || ""));
          if (dsProgress) {
            try {
              dsProgress.ws.send(JSON.stringify({ type: "device.task.progress", taskId: msg.taskId, progress: msg.progress }));
            } catch {
            }
            return;
          }
          if (this.resolveIfQueued(String(msg.taskId), p)) return;
          this.lastProgress.set(String(msg.taskId), p);
          log(`[lf-agent] \u8FDB\u5EA6 ${msg.taskId} ${p.status ?? ""}${p.stage ? "/" + p.stage : ""} ${p.message ?? ""}` + (p.processedCount != null ? ` (${p.processedCount}/${p.totalCount ?? "?"})` : ""));
          return;
        }
        case "task.result": {
          const dsResult = this.downstreams.get(String(msg.deviceId || ""));
          if (dsResult) {
            try {
              dsResult.ws.send(JSON.stringify({ type: "device.task.result", taskId: msg.taskId, response: msg.response }));
            } catch {
            }
            return;
          }
          if (this.finishTask(String(msg.taskId), msg.response)) {
            this.send({ type: "task.result.ack", taskId: msg.taskId, deviceId: msg.deviceId });
          }
          return;
        }
        case "task.result.start": {
          const dsStart = this.downstreams.get(String(msg.deviceId || ""));
          if (dsStart) {
            try {
              dsStart.ws.send(JSON.stringify({ type: "device.task.result.start", transferId: msg.transferId, taskId: msg.taskId, charLength: msg.charLength }));
            } catch {
            }
            return;
          }
          this.transfers.set(String(msg.transferId), {
            taskId: String(msg.taskId),
            charLength: Number(msg.charLength) || 0,
            chunks: /* @__PURE__ */ new Map()
          });
          return;
        }
        case "task.result.chunk": {
          const dsChunk = this.downstreams.get(String(msg.deviceId || ""));
          if (dsChunk) {
            try {
              dsChunk.ws.send(JSON.stringify({ type: "device.task.result.chunk", transferId: msg.transferId, index: msg.index, data: msg.data }));
            } catch {
            }
            return;
          }
          const bucket = this.transfers.get(String(msg.transferId));
          if (bucket) bucket.chunks.set(Number(msg.index), String(msg.data ?? ""));
          return;
        }
        case "task.result.end": {
          const dsEnd = this.downstreams.get(String(msg.deviceId || ""));
          if (dsEnd) {
            try {
              dsEnd.ws.send(JSON.stringify({ type: "device.task.result.end", transferId: msg.transferId, taskId: msg.taskId, chunkCount: msg.chunkCount }));
            } catch {
            }
            return;
          }
          const bucket = this.transfers.get(String(msg.transferId));
          this.transfers.delete(String(msg.transferId));
          if (!bucket) return;
          const count = Number(msg.chunkCount) || bucket.chunks.size;
          let serialized = "";
          for (let i = 0; i < count; i += 1) serialized += bucket.chunks.get(i) ?? "";
          try {
            const parsed = JSON.parse(serialized);
            if (this.finishTask(String(msg.taskId), parsed.response)) {
              this.send({ type: "task.result.ack", taskId: msg.taskId, deviceId: msg.deviceId });
            }
          } catch (err) {
            this.finishTask(String(msg.taskId), {
              ok: false,
              error: { code: "RESULT_PARSE_ERROR", message: `\u7ED3\u679C\u5206\u5757\u91CD\u7EC4\u5931\u8D25\uFF1A${err.message}` }
            });
          }
          return;
        }
        case "task.cancel.result":
          {
            const dsCancel = this.downstreams.get(String(msg.deviceId || ""));
            if (dsCancel) {
              try {
                dsCancel.ws.send(JSON.stringify({ type: "device.task.cancel.result", taskId: msg.taskId, response: msg.response }));
              } catch {
              }
              return;
            }
          }
          this.finishTask(String(msg.taskId), msg.response || { ok: false, canceled: true });
          return;
        default:
          return;
      }
    });
    ws.on("close", (code, reasonBuf) => {
      if (pokeTimer) clearTimeout(pokeTimer);
      clearInterval(pingTimer);
      if (ws.__lfDownstreamId) {
        const goneId = ws.__lfDownstreamId;
        if (this.downstreams.get(goneId)?.ws === ws) {
          this.downstreams.delete(goneId);
          log(`[lf-agent] \u536B\u661F\u9002\u914D\u5668 ${goneId} \u65AD\u5F00\u4E2D\u8F6C`);
          this.broadcastDevices();
          this.send({ type: "device.offline", deviceId: goneId });
        }
        return;
      }
      if (this.client === ws) {
        this.client = null;
        this.clientExtensionId = null;
        const closeReason = String(reasonBuf?.toString?.("utf8") || "");
        this.lastClose = { code: Number(code) || 0, reason: closeReason, at: (/* @__PURE__ */ new Date()).toISOString() };
        if (this.extension.connected) {
          this.extension = { ...this.extension, connected: false };
          this.lastDisconnect = (/* @__PURE__ */ new Date()).toISOString();
          log(`[lf-agent] \u63D2\u4EF6\u65AD\u5F00\uFF08close code=${code}${closeReason ? ` reason="${closeReason}"` : ""}\uFF1B\u7B49\u63D2\u4EF6\u81EA\u52A8\u91CD\u8FDE\uFF1B\u82E5\u957F\u65F6\u95F4\u672A\u6062\u590D\uFF0C\u68C0\u67E5\u63D2\u4EF6\u5F00\u5173/\u91CD\u8F7D\u63D2\u4EF6\uFF09`);
          this.abortPendingTasks();
          this.notifyDownstreamsExtension(false, this.lastClose);
        }
        if (this.awaitingPairing) {
          this.awaitingPairing = false;
          log("[lf-agent] \u5DF2\u590D\u4F4D\u7B49\u5F85\u6279\u51C6\u72B6\u6001\uFF08\u63D2\u4EF6\u91CD\u8FDE\u540E\u6309\u5DF2\u6279\u51C6/\u5F85\u6279\u51C6\u8DEF\u5F84\u91CD\u65B0\u63E1\u624B\uFF09");
        }
      }
    });
  }
  /* ================= ⭐r76 多宿主中转：主 Broker 侧 ================= */
  /** 卫星挂入/摘牌后向插件重发 broker.hello（devices 聚合），插件会自动对新设备发起挑战验签、对消失设备清会话 */
  broadcastDevices() {
    if (!this.client || this.client.readyState !== this.client.OPEN) return;
    const devices = [DEVICE, ...[...this.downstreams.values()].map((d) => d.device)];
    this.send({ type: "broker.hello", protocolVersion: PROTOCOL_VERSION, serverName: "LeadsRadar Agent Adapter", devices });
  }
  /** 插件在线状态变化时通知所有卫星（卫星据此维护自己的 extension.connected / step）；⭐1.2.17 B3：断开时顺带透传 close frame 诊断；
   *  ⭐R56 登录态随状态透传卫星（WorkBuddy 中转实测 loggedIn 恒 null——卫星侧 connection_status 只能兜底，存选题预检失效） */
  notifyDownstreamsExtension(connected, lastClose = null) {
    for (const entry of this.downstreams.values()) {
      try {
        entry.ws.send(JSON.stringify({ type: "device.extension.state", connected: connected === true, lastClose: lastClose ? { code: lastClose.code, reason: lastClose.reason } : null, pendingResults: (this.extension.pendingResults || []).slice(0, 10), account: this.extension.account || null }));
      } catch {
      }
    }
  }
  /** 卫星连接发来的消息路由（device.task.start / device.proof / device.task.cancel） */
  handleDownstreamMessage(ws, msg) {
    const deviceId = ws.__lfDownstreamId;
    const entry = this.downstreams.get(deviceId);
    if (!entry || entry.ws !== ws) return;
    switch (msg.type) {
      case "device.task.start":
        if (!this.client || this.client.readyState !== this.client.OPEN) {
          try {
            ws.send(JSON.stringify({ type: "device.task.result", taskId: msg.taskId, response: { ok: false, error: { code: "EXTENSION_NOT_CONNECTED", message: "\u63D2\u4EF6\u5F53\u524D\u672A\u8FDE\u63A5\u4E3B Broker\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" } } }));
          } catch {
          }
          return;
        }
        this.send({ type: "task.start", taskId: String(msg.taskId || ""), deviceId, task: msg.task });
        log(`[lf-agent] \u4E2D\u8F6C\u4E0B\u53D1\u4EFB\u52A1 ${msg.taskId}\uFF08\u6765\u81EA\u536B\u661F ${deviceId}\uFF09`);
        return;
      // ⭐R96g1bc 中转通道活性探针应答：卫星 frozen 候选时发 device.ping 鉴别「中继半死 vs 插件真冻」
      //   （261104 定谙：workbuddy 卫星与主 Broker 的 TCP 半死——ws.send 写进死连接蒸发不报错，
      //   插件零踪迹零回执，mjs 侧误诊 PLUGIN_FROZEN 冤枉插件；探针秒回 pong=通道活，2.5s 无回=半死）
      case "device.ping":
        try {
          ws.send(JSON.stringify({ type: "device.pong" }));
        } catch {
        }
        return;
      case "device.task.cancel":
        this.send({ type: "task.cancel", taskId: String(msg.taskId || ""), deviceId });
        return;
      case "device.proof":
        this.send({
          type: "session.proof",
          purpose: msg.purpose,
          deviceId,
          challengeId: msg.challengeId,
          signature: msg.signature
        });
        return;
      default:
        return;
    }
  }
  /* ================= ⭐r76 多宿主中转：卫星侧 ================= */
  /**
   * EADDRINUSE 时探测占用者身份：连上端口等它 poke 的 device.hello。
   * - 占用者是本宿主旧实例（孤儿）→ takeover 让位（保留 ⭐412 自愈语义）
   * - 占用者是异宿主家族实例 → 进入卫星中转模式（复用这条连接，不再互踢）
   * - 探测超时/非家族（可能是旧版本不 poke）→ 降级 takeover（旧版收到会让位）
   */
  probeOccupant(fallbackTakeover) {
    return new Promise((resolve) => {
      let probe;
      try {
        probe = new import_websocket.default(`ws://127.0.0.1:${PORT}/extension`);
      } catch {
        resolve("error");
        return;
      }
      let settled = false;
      const finish = (verdict) => {
        if (settled) return;
        settled = true;
        clearTimeout(kill);
        if (verdict === "other") {
          this.enterRelayMode(probe);
        } else {
          try {
            probe.send(JSON.stringify({ type: "broker.takeover", fromDeviceId: DEVICE_ID }));
            setTimeout(() => {
              try {
                probe.close(1e3);
              } catch {
              }
            }, 300);
          } catch {
          }
          if (verdict !== "self") fallbackTakeover?.();
        }
        resolve(verdict);
      };
      const kill = setTimeout(() => {
        try {
          probe.terminate();
        } catch {
        }
        finish("timeout");
      }, 2500);
      probe.on("message", (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.toString());
        } catch {
          return;
        }
        if (msg.type !== "device.hello") return;
        const occ = String(msg.device?.deviceId || "");
        if (occ === DEVICE_ID) finish("self");
        else if (occ.startsWith("leadsradar-agent-")) finish("other");
        else finish("unknown");
      });
      probe.on("open", () => {
      });
      probe.on("error", () => finish("timeout"));
      probe.on("close", () => finish("closed"));
    });
  }
  /** 以卫星身份挂到主 Broker：共享其插件连接，任务经中转双向路由 */
  enterRelayMode(ws) {
    this.relay = { ws, host: "", hostLabel: "", extensionConnected: false };
    this.portBound = false;
    this.awaitingPairing = false;
    log(`[lf-agent] \u7AEF\u53E3 ${PORT} \u88AB\u300C\u53E6\u4E00\u5BBF\u4E3B\u300D\u7684\u9002\u914D\u5668\u5360\u7528 \u2192 \u8FDB\u5165\u536B\u661F\u4E2D\u8F6C\u6A21\u5F0F\uFF08\u591A\u5BBF\u4E3B\u5171\u5B58\uFF0C\u4E0D\u518D\u4E92\u8E22\uFF09`);
    try {
      ws.send(JSON.stringify({ type: "device.attach", deviceId: DEVICE_ID, device: DEVICE, protocolVersion: PROTOCOL_VERSION }));
    } catch {
      this.exitRelayMode();
      return;
    }
    const attachGuard = setTimeout(() => {
      if (this.relay && this.relay.ws === ws && !this.relay.attached) {
        log("[lf-agent] \u4E3B Broker \u672A\u5E94\u7B54 device.attach\uFF08\u7591\u4F3C\u65E7\u7248\u672C\uFF09\u2192 \u964D\u7EA7\u4E3A\u63A5\u7BA1\u6A21\u5F0F");
        try {
          ws.send(JSON.stringify({ type: "broker.takeover", fromDeviceId: DEVICE_ID }));
        } catch {
        }
        this.exitRelayMode();
      }
    }, 3e3);
    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (msg.type === "device.attach.ok") {
        clearTimeout(attachGuard);
        if (!this.relay || this.relay.ws !== ws) return;
        this.relay.attached = true;
        this.relay.host = String(msg.host || "");
        this.relay.hostLabel = String(msg.hostLabel || "");
        this.relay.extensionConnected = msg.extension?.connected === true;
        log(`[lf-agent] \u5DF2\u6302\u4E0A\u4E3B Broker\uFF08${this.relay.hostLabel || this.relay.host}\uFF09\uFF1A\u63D2\u4EF6${this.relay.extensionConnected ? "\u5728\u7EBF" : "\u672A\u8FDE\u63A5"}\uFF0C\u672C\u8BBE\u5907\u7ECF\u4E2D\u8F6C\u5BF9\u63D2\u4EF6\u53EF\u89C1`);
        return;
      }
      this.handleRelayMessage(msg);
    });
    ws.on("close", () => {
      if (this.relay?.ws === ws) this.exitRelayMode();
    });
    ws.on("error", () => {
    });
  }
  /** 卫星中转断开：回到端口竞争（主 Broker 若已退出，3 秒内自动接管成为新主） */
  exitRelayMode() {
    if (!this.relay) return;
    try {
      this.relay.ws.terminate();
    } catch {
    }
    this.relay = null;
    log("[lf-agent] \u4E0E\u4E3B Broker \u7684\u4E2D\u8F6C\u8FDE\u63A5\u65AD\u5F00 \u2192 \u91CD\u65B0\u7ADE\u4E89\u7AEF\u53E3\uFF08\u82E5\u5BF9\u65B9\u5DF2\u9000\u51FA\u4F1A\u81EA\u52A8\u6210\u4E3A\u4E3B Broker\uFF09");
    this.retryBindAfterRelayLoss?.();
  }
  /** ⭐R96g1bc 中转通道活性探针：向主 Broker 发 device.ping 等 pong——waitMs 内无回包=中继半死
   *  （宿主睡眠恢复/网络切换后 TCP 半开：ws.send 写进死连接蒸发不报错、close 永不触发，mjs 零感知，
   *  任务零回执被误诊 PLUGIN_FROZEN 冤枉插件；261104 直连实验坐实：同插件同任务直连 5.5s 回包，
   *  卫星中转零踪迹）。pong 秒回=通道活着，冻结嫌疑回到插件本身 */
  probeRelayAlive(waitMs) {
    return new Promise((resolve) => {
      const relay = this.relay;
      if (!relay || !relay.attached || relay.ws.readyState !== 1) {
        resolve(false);
        return;
      }
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        this._relayPongWaiter = null;
        resolve(ok);
      };
      this._relayPongWaiter = () => done(true);
      try {
        relay.ws.send(JSON.stringify({ type: "device.ping", ts: Date.now() }));
      } catch {
        done(false);
        return;
      }
      setTimeout(() => done(false), waitMs);
    });
  }
  /** 主 Broker 发给卫星的消息处理（挑战签名 / 任务结果 / 插件状态） */
  handleRelayMessage(msg) {
    const relay = this.relay;
    if (!relay) return;
    switch (msg.type) {
      // ⭐R96g1bc 中转活性探针回执：唤醒等待者（probeRelayAlive 的 2.5s 窗内到达=通道活）
      case "device.pong":
        this._relayPongWaiter?.();
        return;
      case "device.extension.state":
        relay.extensionConnected = msg.connected === true;
        if (Array.isArray(msg.pendingResults)) {
          this.extension = { ...this.extension, pendingResults: msg.pendingResults.slice(0, 10), pendingResultCount: msg.pendingResults.length };
        }
        if (msg.account) {
          this.extension = { ...this.extension, account: pickAccountSnapshot(msg.account) };
        }
        if (msg.connected === true && this.awaitingPairing) {
          this.awaitingPairing = false;
          log("[lf-agent] \u536B\u661F\u6A21\u5F0F\u5DF2\u590D\u4F4D\u7B49\u5F85\u6279\u51C6\u72B6\u6001");
        }
        if (this.extension.connected !== relay.extensionConnected) {
          this.extension = { ...this.extension, connected: relay.extensionConnected };
          if (!relay.extensionConnected) {
            this.lastDisconnect = (/* @__PURE__ */ new Date()).toISOString();
            if (relay.lastClose) this.lastClose = { code: relay.lastClose.code || 0, reason: relay.lastClose.reason || "", at: (/* @__PURE__ */ new Date()).toISOString() };
            this.abortPendingTasks();
          }
          log(`[lf-agent] \u4E2D\u8F6C\u901A\u77E5\uFF1A\u63D2\u4EF6${relay.extensionConnected ? "\u5DF2\u8FDE\u63A5" : "\u5DF2\u65AD\u5F00"}`);
        }
        return;
      case "device.pairing.awaiting_approval":
        if (!this.awaitingPairing) {
          this.awaitingPairing = true;
          this.awaitingSince = Date.now();
          log(`[lf-agent] \u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF08\u536B\u661F\u6A21\u5F0F\uFF0C\u7ECF\u4E3B Broker \u4E2D\u8F6C\uFF09`);
          log(`[lf-agent] \u6307\u7EB9\u6838\u5BF9\uFF1A${fingerprint}`);
        }
        return;
      case "device.challenge": {
        this.lastPluginMsgAt = Date.now();
        const purposeNow = String((msg.challenge || {}).purpose ?? "");
        if (purposeNow === "session" && !this.selfPaired) {
          this.selfPaired = true;
          log("[lf-agent] \u536B\u661F\u6A21\u5F0F\uFF1A\u6536\u5230 session \u6311\u6218\uFF08\u63D2\u4EF6\u5DF2\u8BA4\u672C\u8BBE\u5907\u4E3A\u5DF2\u914D\u5BF9\uFF09");
        } else if (purposeNow === "pairing" && this.selfPaired) {
          this.selfPaired = false;
          log("[lf-agent] \u536B\u661F\u6A21\u5F0F\uFF1A\u6536\u5230 pairing \u6311\u6218\uFF08\u672C\u8BBE\u5907\u914D\u5BF9\u5DF2\u5931\u6548\uFF0C\u56DE\u5230\u5F85\u6279\u51C6\uFF09");
        }
        const c = msg.challenge || {};
        const payload = [
          "mediaclaw-agent",
          String(c.purpose ?? ""),
          String(c.deviceId ?? ""),
          String(c.challengeId ?? ""),
          String(c.nonce ?? ""),
          String(c.extensionId ?? ""),
          String(c.protocolVersion ?? PROTOCOL_VERSION)
        ].join("\n");
        try {
          relay.ws.send(JSON.stringify({
            type: "device.proof",
            purpose: c.purpose,
            deviceId: c.deviceId,
            challengeId: c.challengeId,
            signature: signPayload(payload)
          }));
        } catch {
        }
        return;
      }
      case "device.task.progress": {
        this.lastPluginMsgAt = Date.now();
        const p = msg.progress || {};
        if (this.resolveIfQueued(String(msg.taskId), p)) return;
        this.lastProgress.set(String(msg.taskId), p);
        log(`[lf-agent] \u8FDB\u5EA6\uFF08\u4E2D\u8F6C\uFF09${msg.taskId} ${p.status ?? ""}${p.stage ? "/" + p.stage : ""} ${p.message ?? ""}` + (p.processedCount != null ? ` (${p.processedCount}/${p.totalCount ?? "?"})` : ""));
        return;
      }
      case "device.task.result":
        this.lastPluginMsgAt = Date.now();
        this.finishTask(String(msg.taskId), msg.response);
        return;
      case "device.task.result.start":
        this.lastPluginMsgAt = Date.now();
        this.transfers.set(String(msg.transferId), {
          taskId: String(msg.taskId),
          charLength: Number(msg.charLength) || 0,
          chunks: /* @__PURE__ */ new Map()
        });
        return;
      case "device.task.result.chunk": {
        this.lastPluginMsgAt = Date.now();
        const bucket = this.transfers.get(String(msg.transferId));
        if (bucket) bucket.chunks.set(Number(msg.index), String(msg.data ?? ""));
        return;
      }
      case "device.task.result.end": {
        this.lastPluginMsgAt = Date.now();
        const bucket = this.transfers.get(String(msg.transferId));
        this.transfers.delete(String(msg.transferId));
        if (!bucket) return;
        const count = Number(msg.chunkCount) || bucket.chunks.size;
        let serialized = "";
        for (let i = 0; i < count; i += 1) serialized += bucket.chunks.get(i) ?? "";
        try {
          const parsed = JSON.parse(serialized);
          this.finishTask(String(msg.taskId), parsed.response);
        } catch (err) {
          this.finishTask(String(msg.taskId), {
            ok: false,
            error: { code: "RESULT_PARSE_ERROR", message: `\u7ED3\u679C\u5206\u5757\u91CD\u7EC4\u5931\u8D25\uFF1A${err.message}` }
          });
        }
        return;
      }
      case "device.task.cancel.result":
        this.finishTask(String(msg.taskId), msg.response || { ok: false, canceled: true });
        return;
      default:
        return;
    }
  }
  finishTask(taskId, response) {
    const waiter = this.taskWaiters.get(taskId);
    if (!waiter) return false;
    this.taskWaiters.delete(taskId);
    this.lastProgress.delete(taskId);
    clearTimeout(waiter.timer);
    waiter.response = response;
    waiter.resolve(response);
    return true;
  }
  /** ⭐R96gcj 队列忙即时回执（用户实报「搞了半天告诉我没有数据，需要等这么久吗」）：
   *  插件任务通道是全局串行队列，前序任务（深扫/采集）占队期间新任务只有一条 queued
   *  progress 然后沉默——mjs 侧干等到超时才报「任务超时」，用户读作失败+没数据。
   *  改为收到 queued progress 立即 resolve 排队回执（位次+领取路径），宿主秒级拿到
   *  明确交代；任务照跑，完成结果留在插件 pendingResults（角标/claim 可领，不丢）。 */
  resolveIfQueued(taskId, p) {
    if (!p || p.status !== "queued") return false;
    const waiter = this.taskWaiters.get(String(taskId));
    if (!waiter) return false;
    this.taskWaiters.delete(String(taskId));
    this.lastProgress.delete(String(taskId));
    clearTimeout(waiter.timer);
    waiter.resolve({
      ok: true,
      queued: true,
      message: `${String(p.message || "\u63D2\u4EF6\u6B63\u5728\u6267\u884C\u5176\u4ED6\u4EFB\u52A1\uFF0C\u4F60\u7684\u4EFB\u52A1\u5DF2\u6392\u961F")}\u2014\u2014\u524D\u5E8F\u4EFB\u52A1\u5B8C\u6210\u540E\u81EA\u52A8\u5F00\u59CB\uFF0C\u91C7\u96C6\u6570\u636E\u4F1A\u5148\u843D\u63A2\u6817\u672C\u5730\u5E93\u3002\u4E0D\u8981\u91CD\u53D1\u4EFB\u52A1\uFF08\u907F\u514D\u91CD\u590D\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\uFF1B\u7A0D\u7B49 1~2 \u5206\u949F\u540E\u7528 leadsradar_claim_pending_result \u9886\u53D6\u7ED3\u679C\uFF0C\u6216 leadsradar_query_local_data \u76F4\u63A5\u67E5\u672C\u5730\u5E93\u3002`
    });
    return true;
  }
  /** ⭐1.2.17 B3 断开原因诊断：按插件断开的 close frame（code+reason）给精准指引。
   *  返回非空字符串=有诊断（调用方以此为首选指引，跳过 start chrome 类无效指引）；null=无可用诊断（回落旧文案）。
   *  reason 真源在插件 local-agent-connector.ts：stop() 关开关 → "LF Agent disabled"；
   *  stopForAvailability() 桥不可用 → "LF Agent bridge is not publicly available"；
   *  浏览器被关/插件被禁用/重载 = SW 直接被杀无告别帧 → ws 层报 1006（1005/1001 同归异常断） */
  disconnectDiagnosis() {
    const c = this.lastClose;
    if (!c) return null;
    if (Date.now() - new Date(c.at).getTime() > 10 * 60 * 1e3) return null;
    if (c.reason.includes("disabled")) {
      return `\u8BCA\u65AD\uFF1A\u63D2\u4EF6\u7684\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u88AB\u5173\u95ED\uFF08\u6D4F\u89C8\u5668\u8FD8\u5F00\u7740\uFF0C\u65E0\u9700\u91CD\u542F\uFF09\u2014\u2014\u8BF7\u7528\u6237\u5230\u63D2\u4EF6\u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u91CD\u65B0\u6253\u5F00\u9876\u90E8\u5F00\u5173\uFF0C\u914D\u5BF9\u5173\u7CFB\u4FDD\u7559\uFF0C\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5`;
    }
    if (c.reason.includes("not publicly available")) {
      return `\u8BCA\u65AD\uFF1A\u63D2\u4EF6\u4FA7\u5224\u5B9A\u672C\u5730\u6865\u4E0D\u53EF\u7528\u5DF2\u81EA\u52A8\u65AD\u5F00\u2014\u2014\u8BF7\u7528\u6237\u91CD\u542F\u6D4F\u89C8\u5668\uFF0C\u518D\u5230\u63D2\u4EF6\u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5\u91CD\u65B0\u6253\u5F00\u5F00\u5173`;
    }
    if (c.code === 1006 || c.code === 1005 || c.code === 1001) {
      return `\u8BCA\u65AD\uFF1A\u8FDE\u63A5\u88AB\u76F4\u63A5\u5207\u65AD\uFF08\u6D4F\u89C8\u5668\u88AB\u5173\u95ED\uFF0C\u6216\u63D2\u4EF6\u88AB\u7981\u7528/\u91CD\u8F7D\u2014\u2014\u65E0\u544A\u522B\u5E27\uFF09\u2014\u2014\u8BF7\u7528\u6237\u91CD\u5F00\u6D4F\u89C8\u5668\u5E76\u786E\u8BA4\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5`;
    }
    if (c.code === 1e3 && c.reason) {
      return `\u8BCA\u65AD\uFF1A\u63D2\u4EF6\u4E3B\u52A8\u65AD\u5F00\uFF08${c.reason}\uFF09\u2014\u2014\u8BF7\u7528\u6237\u68C0\u67E5\u63D2\u4EF6\u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5\u7684\u5F00\u5173\u72B6\u6001\u540E\u91CD\u8BD5`;
    }
    return null;
  }
  /** ⭐1.2.16 B7：插件连接断开时中止所有等待中的任务（浏览器被关/插件掉线不再傻等 TASK_TIMEOUT，秒级返回失败） */
  abortPendingTasks() {
    if (!this.taskWaiters.size) return;
    const ids = [...this.taskWaiters.keys()];
    log(`[lf-agent] \u63D2\u4EF6\u65AD\u5F00 \u2192 \u79D2\u7EA7\u4E2D\u6B62 ${ids.length} \u4E2A\u7B49\u5F85\u4E2D\u7684\u4EFB\u52A1`);
    for (const id of ids) {
      this.finishTask(id, {
        ok: false,
        error: {
          code: "TASK_ABORTED",
          // ⭐1.2.17 B3：诊断优先（开关关→指开关；被杀→指重开浏览器），无诊断才回落探测命令
          message: `\u63D2\u4EF6\u8FDE\u63A5\u5DF2\u65AD\u5F00\uFF0C\u4EFB\u52A1\u5DF2\u4E2D\u6B62\u3002${this.disconnectDiagnosis() || extensionLaunchHint() || "\u8BF7\u91CD\u5F00\u6D4F\u89C8\u5668\uFF08\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\uFF09\u540E\u91CD\u8BD5\u3002"}`
        }
      });
    }
  }
  /**
   * 下发任务并等待结果。
   * @returns {Promise<{ok:boolean, error?:object, [k:string]:unknown}>}
   */
  startTask(task, timeoutMs = LIST_TASK_TIMEOUT_MS) {
    if (this.relay) return this.startTaskViaRelay(task, timeoutMs);
    if (!this.extension.connected) {
      const diag = this.disconnectDiagnosis();
      return Promise.resolve({
        ok: false,
        error: {
          code: "EXTENSION_NOT_CONNECTED",
          message: this.awaitingPairing ? "\u63D2\u4EF6\u5DF2\u68C0\u6D4B\u5230\u672C\u8BBE\u5907\uFF0C\u4F46\u5C1A\u672A\u6279\u51C6\u914D\u5BF9\u3002\u8BF7\u8BA9\u7528\u6237\u5728\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u4E2D\u6838\u5BF9\u8BBE\u5907\u6307\u7EB9\u5E76\u70B9\u51FB\u6279\u51C6\uFF0C\u7136\u540E\u91CD\u8BD5\u3002" : diag ? `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\uFF08LeadsRadar\uFF09\u6D4F\u89C8\u5668\u63D2\u4EF6\u3002${diag}\u3002` : `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\uFF08LeadsRadar\uFF09\u6D4F\u89C8\u5668\u63D2\u4EF6\u3002${extensionLaunchHint() || "\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\uFF0C\u53EF\u76F4\u63A5\u8FD0\u884C start chrome\uFF08\u6216 start msedge\uFF09\u6253\u5F00\u6D4F\u89C8\u5668\uFF0C\u63D2\u4EF6\u4F1A\u81EA\u52A8\u91CD\u8FDE\uFF08\u7EA6\u7B49 5 \u79D2\u518D\u91CD\u8BD5\uFF09\u2014\u2014\u2B50R96ez \u81EA\u6551\u4EC5\u5C1D\u8BD5\u4E00\u6B21\uFF1A\u6CA1\u8D77\u6765\u6216\u6CA1\u7EC8\u7AEF\u6743\u9650\u5C31\u505C\u624B\uFF0C\u7981\u6362\u59FF\u52BF\uFF08\u627E exe \u8DEF\u5F84\u76F4\u542F/\u6362 shell/\u6362 PowerShell\uFF09\u53CD\u590D\u91CD\u8BD5"}\uFF1B\u505C\u624B\u540E\u8F6C\u7528\u6237\u5F15\u5BFC\uFF0C\u8BF7\u8BA9\u7528\u6237\uFF1A1) \u624B\u52A8\u6253\u5F00\u6D4F\u89C8\u5668\u5E76\u70B9\u4E00\u4E0B\u63A2\u6817\u63D2\u4EF6\u56FE\u6807\uFF1B2) \u63D2\u4EF6\u8BBE\u7F6E\u9875 \u2192\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u2192 \u5F00\u5173\u5173\u4E00\u4E0B\u518D\u5F00\uFF0C\u5F04\u597D\u540E\u91CD\u8BD5\u3002`
        }
      });
    }
    const taskId = `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.taskWaiters.delete(taskId);
        const frozenMs = Date.now() - (this.lastPluginMsgAt || 0);
        const frozen = this.lastPluginMsgAt > 0 && frozenMs > 45e3;
        if (frozen && this.client) {
          try {
            this.client.terminate();
          } catch {
          }
          log("[lf-agent] \u51BB\u7ED3\u786E\u8BCA\uFF1A\u4E3B\u52A8\u56DE\u6536\u50F5\u5C38\u8FDE\u63A5\uFF08\u63D2\u4EF6\u6062\u590D\u8FD0\u884C\u540E\u4F1A\u81EA\u52A8\u91CD\u8FDE\uFF09");
        }
        resolve({
          ok: false,
          error: {
            code: frozen ? "PLUGIN_FROZEN" : "TASK_TIMEOUT",
            message: frozen ? `\u63D2\u4EF6\u901A\u9053\u51BB\u7ED3\uFF1A\u8FDE\u63A5\u867D\u5728\uFF0C\u4F46\u63D2\u4EF6\u5DF2 ${Math.round(frozenMs / 1e3)} \u79D2\u65E0\u4EFB\u4F55\u5E94\u7528\u5C42\u6D88\u606F\uFF08\u4E8B\u4EF6\u5FAA\u73AF\u505C\u6446\uFF0C\u91CD\u8BD5\u4EFB\u52A1/\u67E5\u5E93\u90FD\u4F1A\u8D85\u65F6\uFF0C\u4E0D\u8981\u91CD\u53D1\uFF1B\u2B50R96gr \u9002\u914D\u5668\u5DF2\u81EA\u52A8\u56DE\u6536\u50F5\u5C38\u8FDE\u63A5\uFF0C\u63D2\u4EF6\u6062\u590D\u8FD0\u884C\u540E\u4F1A\u81EA\u52A8\u91CD\u8FDE\uFF09\u3002\u8BF7\u7528\u6237\uFF1A1) \u5207\u56DE\u6D4F\u89C8\u5668\u70B9\u4E00\u4E0B\u4EFB\u610F\u9875\u9762\uFF08\u51BB\u7ED3\u591A\u56E0 Chrome \u540E\u53F0\u8282\u80FD\uFF0C\u524D\u53F0\u4EA4\u4E92\u5373\u89E3\u51BB\uFF09\uFF0C\u6216\u91CD\u542F Chrome/\u5230 chrome://extensions \u91CD\u8F7D\u63A2\u6817\u63D2\u4EF6\uFF1B2) \u6062\u590D\u540E\u56DE\u4E00\u53E5\u300C\u7EE7\u7EED\u300D\uFF0C\u5148 query_local_data \u67E5\u5DF2\u91C7\u5230\u7684\u6570\u636E\uFF08\u5DF2\u843D\u672C\u5730\u5E93\u4E0D\u4E22\uFF09\uFF1B3) \u82E5\u53CD\u590D\u51BB\u7ED3\uFF1A\u5230 chrome://extensions \u2192 \u63A2\u6817 \u2192 \u8BE6\u60C5\u9875\u6253\u5F00\u300C\u5141\u8BB8\u5728\u7F51\u7AD9\u540E\u53F0\u8FD0\u884C\u300D\u7C7B\u5F00\u5173\uFF0C\u6216 Chrome \u8BBE\u7F6E\u2192\u6027\u80FD \u5173\u95ED\u300C\u8282\u80FD\u6A21\u5F0F\u300D\u3002` : `\u4EFB\u52A1\u8D85\u65F6\uFF08${Math.round(timeoutMs / 1e3)}s\uFF09\u3002\u6CE8\u610F\uFF1A\u63D2\u4EF6\u53EF\u80FD\u4ECD\u5728\u6267\u884C\uFF0C\u4E14\u91C7\u96C6\u6570\u636E\u4F1A\u5148\u843D\u63A2\u6817\u672C\u5730\u5E93\u2014\u2014\u8BF7\u5148\u7528 query_local_data \u67E5\u8BE2\u8BE5\u4EFB\u52A1\u7684 keyword/url \u5BF9\u5E94\u7ED3\u679C\uFF0C\u67E5\u5230\u5C31\u76F4\u63A5\u7528\u3001\u4E0D\u8981\u91CD\u53D1\uFF1B\u786E\u5B9E\u6CA1\u6709\u518D\u91CD\u53D1\u4EFB\u52A1\uFF08\u907F\u514D\u91CD\u590D\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\u3002`
          }
        });
      }, timeoutMs);
      this.taskWaiters.set(taskId, { resolve, timer, response: null });
      this.send({ type: "task.start", taskId, deviceId: DEVICE_ID, task });
      log(`[lf-agent] \u4E0B\u53D1\u4EFB\u52A1 ${taskId} ${JSON.stringify(task)}`);
    });
  }
  /** ⭐r76 卫星模式任务下发：device.task.start → 主 Broker → 插件；回执经 device.task.result 回来触发 finishTask */
  startTaskViaRelay(task, timeoutMs) {
    const relay = this.relay;
    if (!relay || !relay.attached || !relay.extensionConnected) {
      const diag = this.disconnectDiagnosis();
      return Promise.resolve({
        ok: false,
        error: {
          code: "EXTENSION_NOT_CONNECTED",
          message: this.awaitingPairing ? `\u63D2\u4EF6\u5DF2\u68C0\u6D4B\u5230\u672C\u8BBE\u5907\uFF08\u536B\u661F\u6A21\u5F0F\uFF09\uFF0C\u4F46\u5C1A\u672A\u6279\u51C6\u914D\u5BF9\u3002\u8BF7\u8BA9\u7528\u6237\u5728\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u4E2D\u6838\u5BF9\u8BBE\u5907\u6307\u7EB9\u5E76\u70B9\u51FB\u6279\u51C6\uFF0C\u7136\u540E\u91CD\u8BD5\u3002\u6307\u7EB9\uFF1A${fingerprint}` : diag ? `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\u63D2\u4EF6\u3002${diag}\u3002` : `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\u63D2\u4EF6\uFF08\u672C\u673A\u591A\u4E2A AI \u52A9\u624B\u5171\u7528\u63D2\u4EF6\u8FDE\u63A5\uFF0C\u76F4\u8FDE\u7AEF\u5F53\u524D\u672A\u8FDE\u4E0A\u2014\u2014\u8FDE\u63A5\u53EF\u80FD\u88AB Trae \u7B49\u522B\u7684 AI \u52A9\u624B\u5360\u7528\uFF0C\u6216\u63D2\u4EF6\u6CA1\u81EA\u52A8\u91CD\u8FDE\uFF09\u3002${extensionLaunchHint() || "\u8BF7\u8BA9\u7528\u6237\uFF1A1) \u786E\u8BA4\u6D4F\u89C8\u5668\u5DF2\u6253\u5F00\u4E14\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\uFF1B2) \u63D2\u4EF6\u8BBE\u7F6E\u9875 \u2192\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u2192 \u5F00\u5173\u5173\u4E00\u4E0B\u518D\u5F00"}\u3002\u2B50R96ez \u7EC8\u7AEF\u81EA\u6551\u4EC5\u5C1D\u8BD5\u4E00\u6B21\uFF1A\u6CA1\u8D77\u6765\u6216\u6CA1\u7EC8\u7AEF\u6743\u9650\u5C31\u505C\u624B\uFF0C\u7981\u6362\u59FF\u52BF\u53CD\u590D\u91CD\u8BD5\uFF1B\u8F6C\u7528\u6237\u5F15\u5BFC\u4E8C\u9009\u4E00\uFF1A1) \u5728\u6D4F\u89C8\u5668\u91CC\u70B9\u4E00\u4E0B\u63A2\u6817\u63D2\u4EF6\u56FE\u6807\uFF0C\u6216\u5230\u63D2\u4EF6\u8BBE\u7F6E\u628A\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u5173\u4E00\u4E0B\u518D\u5F00\uFF1B2) \u82E5 Trae \u7B49\u522B\u7684 AI \u52A9\u624B\u4E5F\u8FDE\u7740\u63A2\u6817\uFF0C\u628A\u5B83\u90A3\u8FB9\u7684\u8FDE\u63A5\u505C\u4E00\u4E0B\u3002\u7528\u6237\u5F04\u597D\u540E\u8BF4\u58F0\u590D\u67E5\uFF0C\u6BCF 8 \u79D2\u91CD\u8BD5\u4E00\u6B21\uFF08\u91CD\u8BD5\u6307\u91CD\u53D1\u5DE5\u5177\u8C03\u7528\uFF0C\u4E0D\u662F\u53CD\u590D\u542F\u52A8\u6D4F\u89C8\u5668\uFF09\u3002`
        }
      });
    }
    const taskId = `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((resolve) => {
      const sentAt = Date.now();
      const timer = setTimeout(() => {
        this.taskWaiters.delete(taskId);
        const fastLane = FAST_LANE_MODES.has(String(task?.mode || ""));
        const frozen = !fastLane && this.relay?.extensionConnected && this.lastPluginMsgAt < sentAt;
        if (!frozen) {
          resolve({
            ok: false,
            error: {
              code: "TASK_TIMEOUT",
              message: fastLane ? `\u4EFB\u52A1\u8D85\u65F6\uFF08${Math.round(timeoutMs / 1e3)}s\uFF09\u3002\u8FD9\u662F\u5DE5\u5177\u578B\u4EFB\u52A1\uFF08${String(task?.mode || "?")}\uFF09\uFF0C\u63D2\u4EF6\u5927\u6982\u7387\u6D3B\u7740\u3001\u53EA\u662F\u6267\u884C\u6162\uFF08\u591A\u4E3A\u4E91\u7AEF\u63A5\u53E3\u6296\u52A8\uFF09\u2014\u2014\u8FD9\u4E0D\u662F\u63D2\u4EF6\u51BB\u7ED3\uFF0C\u7981\u5F15\u5BFC\u7528\u6237\u91CD\u8F7D\u63D2\u4EF6/\u70B9\u6D4F\u89C8\u5668\uFF1B\u7A0D\u7B49\u7247\u523B\u539F\u6837\u91CD\u8BD5\u5373\u53EF\uFF0C\u91CD\u8BD5\u4ECD\u8D85\u65F6\u518D\u5411\u7528\u6237\u8BF4\u660E\u7F51\u7EDC\u6CE2\u52A8\u3002` : `\u4EFB\u52A1\u8D85\u65F6\uFF08${Math.round(timeoutMs / 1e3)}s\uFF09\u3002\u6CE8\u610F\uFF1A\u63D2\u4EF6\u53EF\u80FD\u4ECD\u5728\u6267\u884C\uFF0C\u4E14\u91C7\u96C6\u6570\u636E\u4F1A\u5148\u843D\u63A2\u6817\u672C\u5730\u5E93\u2014\u2014\u8BF7\u5148\u7528 query_local_data \u67E5\u8BE2\u8BE5\u4EFB\u52A1\u7684 keyword/url \u5BF9\u5E94\u7ED3\u679C\uFF0C\u67E5\u5230\u5C31\u76F4\u63A5\u7528\u3001\u4E0D\u8981\u91CD\u53D1\uFF1B\u786E\u5B9E\u6CA1\u6709\u518D\u91CD\u53D1\u4EFB\u52A1\uFF08\u907F\u514D\u91CD\u590D\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\u3002`
            }
          });
          return;
        }
        this.probeRelayAlive(2500).then((alive) => {
          if (alive) {
            resolve({
              ok: false,
              error: {
                code: "PLUGIN_FROZEN",
                message: `\u63D2\u4EF6\u901A\u9053\u51BB\u7ED3\uFF1A\u8FDE\u63A5\u867D\u5728\uFF0C\u4F46\u672C\u4EFB\u52A1\u53D1\u51FA\u540E\u63D2\u4EF6\u96F6\u6D88\u606F\uFF08\u4E8B\u4EF6\u5FAA\u73AF\u505C\u6446\uFF0C\u91CD\u8BD5\u4EFB\u52A1/\u67E5\u5E93\u90FD\u4F1A\u8D85\u65F6\uFF0C\u4E0D\u8981\u91CD\u53D1\uFF09\u3002\u8BF7\u7528\u6237\uFF1A1) \u5207\u56DE\u6D4F\u89C8\u5668\u70B9\u4E00\u4E0B\u4EFB\u610F\u9875\u9762\uFF08\u51BB\u7ED3\u591A\u56E0 Chrome \u540E\u53F0\u8282\u80FD\uFF0C\u524D\u53F0\u4EA4\u4E92\u5373\u89E3\u51BB\uFF1B\u2B50R96gr \u536B\u661F\u7AEF\u65E0\u8FDE\u63A5\u53E5\u67C4\u53EA\u80FD\u6307\u8DEF\uFF0C\u4E3B Broker \u76F4\u8FDE\u7AEF\u5DF2\u81EA\u52A8\u8E22\u50F5\u5C38\u8FDE\u63A5\uFF09\uFF0C\u6216\u91CD\u542F Chrome/\u5230 chrome://extensions \u91CD\u8F7D\u63A2\u6817\u63D2\u4EF6\uFF1B2) \u6062\u590D\u540E\u56DE\u4E00\u53E5\u300C\u7EE7\u7EED\u300D\uFF0C\u5148 query_local_data \u67E5\u5DF2\u91C7\u5230\u7684\u6570\u636E\uFF08\u5DF2\u843D\u672C\u5730\u5E93\u4E0D\u4E22\uFF09\uFF1B3) \u82E5\u53CD\u590D\u51BB\u7ED3\uFF1A\u5230 chrome://extensions \u2192 \u63A2\u6817 \u2192 \u8BE6\u60C5\u9875\u6253\u5F00\u300C\u5141\u8BB8\u5728\u7F51\u7AD9\u540E\u53F0\u8FD0\u884C\u300D\u7C7B\u5F00\u5173\uFF0C\u6216 Chrome \u8BBE\u7F6E\u2192\u6027\u80FD \u5173\u95ED\u300C\u8282\u80FD\u6A21\u5F0F\u300D\u3002`
              }
            });
            return;
          }
          try {
            this.relay?.ws?.terminate();
          } catch {
          }
          resolve({
            ok: false,
            error: {
              code: "RELAY_STALE",
              message: `\u4E2D\u8F6C\u901A\u9053\u534A\u6B7B\uFF1A\u672C\u5BBF\u4E3B\u4E0E\u4E3B Broker \u7684\u4E2D\u7EE7\u8FDE\u63A5\u5DF2\u5931\u6548\uFF08\u5BBF\u4E3B\u7761\u7720\u6062\u590D/\u7F51\u7EDC\u5207\u6362\u540E\u5E38\u89C1\u2014\u2014TCP \u534A\u5F00\u65F6\u6D88\u606F\u5199\u8FDB\u6B7B\u8FDE\u63A5\u84B8\u53D1\uFF0C\u63D2\u4EF6\u65E0\u6059\u3001\u5DF2\u91C7\u6570\u636E\u4E0D\u4E22\uFF09\u3002\u5DF2\u81EA\u52A8\u6390\u7EBF\u5E76\u89E6\u53D1\u91CD\u8FDE\uFF08\u79D2\u7EA7\u6062\u590D\uFF09\uFF1A\u8BF7\u76F4\u63A5\u539F\u6837\u91CD\u8BD5\u672C\u4EFB\u52A1\uFF1B\u82E5\u4ECD\u62A5\u6B64\u9519\uFF0C\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u5F00\u672C\u5BBF\u4E3B\uFF08WorkBuddy/\u8C46\u5305\u7B49\uFF09\u5373\u53EF\u3002\u26A0\uFE0F \u65E0\u9700\u91CD\u8F7D\u63D2\u4EF6\u3001\u65E0\u9700\u91CD\u542F Chrome\u2014\u2014\u8FD9\u4E0D\u662F\u63D2\u4EF6\u51BB\u7ED3\uFF08\u901A\u9053\u6D3B\u6027\u63A2\u9488 2.5s \u65E0\u56DE\u5305\u786E\u8BCA\uFF09\u3002`
            }
          });
        });
      }, timeoutMs);
      this.taskWaiters.set(taskId, { resolve, timer, response: null });
      try {
        relay.ws.send(JSON.stringify({ type: "device.task.start", taskId, task }));
        log(`[lf-agent] \u4E0B\u53D1\u4EFB\u52A1\uFF08\u4E2D\u8F6C\uFF09${taskId} ${JSON.stringify(task)}`);
      } catch {
        this.taskWaiters.delete(taskId);
        clearTimeout(timer);
        resolve({ ok: false, error: { code: "RELAY_BROKEN", message: "\u4E0E\u4E3B Broker \u7684\u4E2D\u8F6C\u8FDE\u63A5\u5DF2\u65AD\u5F00\uFF0C\u6B63\u5728\u91CD\u65B0\u7ADE\u4E89\u7AEF\u53E3\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" } });
      }
    });
  }
  /** connection_status 快照（驱动宿主 AI 的 onboarding 状态机）；⭐403 token 经济版：welcome 全文仅在 step=3 下发，step 1/2 轮询每轮省约 200 tokens */
  /** ⭐B7b-P1 存货提示（主/卫星 hint 共用）：插件侧有已完成未领取结果时，引导 AI 先领取再决定重发 */
  pendingResultsHint() {
    const list = this.extension.pendingResults || [];
    if (!list.length) return "";
    const brief = list.slice(0, 3).map((p) => `${p.mode || "?"}\xB7${p.keyword || p.url || p.taskId}`).join("\u3001");
    return `\u6CE8\u610F\uFF1A\u6709 ${list.length} \u6761\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1\u7ED3\u679C\u672A\u88AB\u9886\u53D6\uFF08${brief}${list.length > 3 ? " \u7B49" : ""}\uFF09\u2014\u2014\u8BF7\u5148\u7528 leadsradar_claim_pending_result \u9886\u53D6\uFF08\u4E0D\u5360\u91C7\u96C6\u9650\u989D\uFF09\uFF0C\u9886\u5230\u76F4\u63A5\u7528\uFF1B\u6CA1\u6709\u9700\u8981\u7684\u518D\u8003\u8651\u65B0\u4EFB\u52A1\uFF0C\u907F\u514D\u91CD\u590D\u6D88\u8017\u989D\u5EA6\u3002`;
  }
  statusSnapshot() {
    const connected = this.relay ? this.relay.extensionConnected : this.extension.connected;
    const awaitingPairing = this.awaitingPairing;
    const step = this.relay ? !connected ? 1 : this.selfPaired ? 3 : 2 : connected ? 3 : awaitingPairing ? 2 : 1;
    const base = {
      ok: true,
      adapter: {
        running: true,
        version: ADAPTER_VERSION,
        host: HOST,
        hostLabel: HOST_LABELS[HOST] || HOST,
        deviceName: DEVICE_NAME,
        deviceId: DEVICE_ID,
        fingerprint,
        port: PORT,
        protocolVersion: PROTOCOL_VERSION,
        // ⭐r76 中转模式标记：true=本设备经另一宿主的主 Broker 共享插件连接
        relayMode: Boolean(this.relay),
        relayThrough: this.relay?.hostLabel || this.relay?.host || null,
        // ⭐R79 自更新三态：idle=未查（无网/低版本 node）/ checking=检查中 / up-to-date=已是最新 /
        //   updated-pending-restart=新版已写入、重启宿主后生效——管家栗报到表格据此渲染升级提示
        update: {
          state: selfUpdate.state,
          currentVersion: ADAPTER_VERSION,
          latestVersion: selfUpdate.latestVersion,
          fromVersion: selfUpdate.fromVersion
        }
      },
      // ⭐R76 五技能最新版本表（宿主技能自检用）：宿主 AI 拿自己技能文件 frontmatter 的 version 对照，
      //   落后就指引用户更新技能——Agent 只能识别+指路，技能安装/更新机制在宿主手里
      // ⭐R96g1be 表源改云端实时缓存（skillsLatestLive）：同步读、connection_status 侧 void 刷新——
      //   进程不重启也能在 TTL 后见新表，破「内置常量冻结锁死技能更新」死锁
      skills_latest: skillsLatestLive.table,
      // ⭐R79b 插件商店最新版（插件发版时同步 bump 此值）：管家栗对照 extension.extensionVersion，
      //   落后=商店还没推到（灰度几小时~几天），提醒用户 chrome://extensions 点「更新」可提前——商店自动更为主，此表只是提速提醒
      plugin_latest: PLUGIN_LATEST,
      extension: {
        connected,
        extensionId: this.extension.extensionId || null,
        extensionVersion: this.extension.extensionVersion || null,
        pendingResultCount: this.extension.pendingResultCount,
        // ⭐B7b-P1 未领取结果摘要透出：非空=插件侧有已完成结果待 leadsradar_claim_pending_result 领取
        pendingResults: this.extension.pendingResults || [],
        lastDisconnectedAt: this.lastDisconnect || null,
        // ⭐1.2.17 B3 断开原因透出：close frame 原文（code+reason）+诊断结论，宿主 AI 可直接读
        lastDisconnectCode: this.lastClose?.code ?? null,
        lastDisconnectReason: this.lastClose?.reason || null,
        disconnectDiagnosis: this.extension.connected ? null : this.disconnectDiagnosis(),
        // ⭐r81 P0-3 登录态透出：save_topic/云端入库等需登录——宿主动手前用 connection_status
        // 预检（wb 实测采完详情才报 CLOUD_ERROR，白消耗采集额度）。注意：握手时点的快照，
        // 中途登录/退出会过期，动作层 LOGIN_REQUIRED 报错是第二道防线
        account: this.extension.account || { loggedIn: null, nickname: null },
        // ⭐R96et 插件所在浏览器透出：detectExtensionProfiles() 现成（扫 Chrome/Edge 各 profile 的
        // Preferences 找 unpacked 探栗，10s 缓存）——closer 五项直核表「浏览器」行的数据源
        // （261031 实报宿主写「待核」=数据源缺失非偷懒）；未连接=空数组
        browsers: this.extension.connected ? detectExtensionProfiles() : []
      }
    };
    if (this.relay) {
      return {
        ...base,
        onboarding: {
          step,
          awaitingPairing,
          portBound: false,
          relayMode: true,
          hint: step === 3 ? `\u5DF2\u8FDE\u63A5\uFF08\u672C\u673A\u591A\u4E2A AI \u52A9\u624B\u5171\u7528\u8FD9\u6761\u63D2\u4EF6\u8FDE\u63A5\uFF09\uFF0C\u53EF\u4EE5\u5F00\u59CB\u91C7\u96C6\u4EFB\u52A1\u3002${this.pendingResultsHint()}` : step === 2 ? `\u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF1A\u628A adapter.fingerprint \u539F\u6837\u8F6C\u544A\u7528\u6237\uFF0C\u8BF7\u5176\u5230\u63D2\u4EF6\u8BBE\u7F6E\u9875\u786E\u8BA4\u662F\u81EA\u5DF1\u7684\u8BBE\u5907\u540E\u70B9\u300C\u6279\u51C6\u300D\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\uFF08\u6CE8\u610F\uFF1A\u6279\u51C6\u524D\u4EFB\u52A1\u4F1A\u88AB\u62D2\u7EDD\uFF0C\u522B\u6025\u7740\u5F00\u5DE5\uFF09\u3002` : `\u4E2D\u8F6C\u6A21\u5F0F\u7B49\u5F85\u63D2\u4EF6\uFF1A${(() => {
            const ok = autoLaunchExtensionHost();
            return ok ? "\u5DF2\u81EA\u52A8\u4E3A\u4F60\u6253\u5F00\u88C5\u63D2\u4EF6\u7684\u6D4F\u89C8\u5668\u7A97\u53E3\u2014\u2014\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\uFF0C\u7A0D\u7B49\u7247\u523B\u558A\u300C\u6817\u5B50\u5728\u5417\u300D\u590D\u67E5\u5373\u53EF" : this.disconnectDiagnosis() || extensionLaunchHint() || "\u8BF7\u8BA9\u7528\u6237\u6253\u5F00\u6D4F\u89C8\u5668\u786E\u8BA4\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\u3001\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u5DF2\u6253\u5F00";
          })()}\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002`
        },
        welcome: step === 3 ? { fixedCopy: WELCOME_FIXED_COPY } : null
      };
    }
    return {
      ...base,
      onboarding: {
        step,
        awaitingPairing,
        portBound: this.portBound,
        // ⭐r85 portBlocked：EADDRINUSE 且占用者探测无应答 → Windows 动态端口保留段圈走端口。
        //   让宿主 AI 直接把根治命令转告用户，而不是一起懵在「连接器连接失败」
        portBlocked: this.portBlocked === true,
        hint: this.portBlocked ? `\u63A2\u6817MCP \u7AEF\u53E3 ${PORT} \u88AB Windows \u52A8\u6001\u7AEF\u53E3\u4FDD\u7559\uFF08Hyper-V/WSL \u6392\u9664\u6BB5\uFF09\u6321\u4F4F\uFF1Abind \u88AB\u62D2\u4F46\u65E0\u8FDB\u7A0B\u5360\u7528\uFF0C\u901A\u5E38\u51E0\u5341\u5206\u949F\u5185\u81EA\u52A8\u6062\u590D\uFF0C\u63A2\u6817MCP \u5728\u6301\u7EED\u91CD\u8BD5\u3002\u8BF7\u628A\u8FD9\u6761\u6839\u6CBB\u547D\u4EE4\u8F6C\u544A\u7528\u6237\uFF08\u7BA1\u7406\u5458 PowerShell \u8FD0\u884C\u4E00\u6B21\u6C38\u4E45\u751F\u6548\uFF09\uFF1Anet stop winnat ; netsh int ipv4 add excludedportrange protocol=tcp startport=${PORT} numberofports=1 ; net start winnat\uFF08\u8FD0\u884C\u5B8C\u91CD\u542F\u672C\u4F1A\u8BDD\u5373\u8FDE\u4E0A\uFF09\u3002\u8F6C\u544A\u540E\u6BCF 30 \u79D2\u590D\u67E5\u4E00\u6B21\u3002` : !this.portBound ? `\u63A2\u6817MCP \u7684\u672C\u673A\u7AEF\u53E3 ${PORT} \u6B63\u5728\u88AB\u5360\u7528\u4E14\u5C1A\u672A\u5B8C\u6210\u4E2D\u8F6C\u534F\u5546\uFF08\u6B63\u5728\u81EA\u52A8\u5904\u7406\uFF1A\u540C\u5BBF\u4E3B\u5B64\u513F\u4F1A\u88AB\u63A5\u7BA1\uFF0C\u5F02\u5BBF\u4E3B\u4F1A\u81EA\u52A8\u8F6C\u5165\u4E2D\u8F6C\u5171\u5B58\uFF09\u3002\u8BF7\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\uFF1B\u82E5\u8D85\u8FC7 1 \u5206\u949F\u4ECD\u505C\u7559\u5728\u6B64\u72B6\u6001\uFF0C\u8BF7\u7528\u6237\u5B8C\u5168\u9000\u51FA\u6240\u6709 AI \u52A9\u624B\uFF08\u542B\u6258\u76D8\uFF09\u540E\u91CD\u5F00\u3002` : step === 1 ? `\u63D2\u4EF6\u672A\u8FDE\u63A5\uFF1A${(() => {
          const ok = autoLaunchExtensionHost();
          return ok ? "\u5DF2\u81EA\u52A8\u4E3A\u4F60\u6253\u5F00\u88C5\u63D2\u4EF6\u7684\u6D4F\u89C8\u5668\u7A97\u53E3\u2014\u2014\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\uFF0C\u7A0D\u7B49\u7247\u523B\u558A\u300C\u6817\u5B50\u5728\u5417\u300D\u590D\u67E5\u5373\u53EF" : this.disconnectDiagnosis() || extensionLaunchHint() || "\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\u53EF\u8FD0\u884C start chrome\uFF08\u6216 start msedge\uFF09\u6253\u5F00\u6D4F\u89C8\u5668\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u5185\u81EA\u52A8\u91CD\u8FDE";
        })()}\uFF1B\u5426\u5219\u8BF7\u7528\u6237\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u63A2\u6817\u63D2\u4EF6 \u2192 \u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u6253\u5F00\u9876\u90E8\u5F00\u5173\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002` : step === 2 ? `\u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF1A\u628A adapter.fingerprint \u539F\u6837\u8F6C\u544A\u7528\u6237\uFF0C\u8BF7\u5176\u5230\u63D2\u4EF6\u8BBE\u7F6E\u9875\u6838\u5BF9\u6307\u7EB9\u4E00\u81F4\u540E\u70B9\u300C\u6279\u51C6\u300D\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002\u6CE8\u610F\uFF1A\u82E5 extension.connected \u4E3A false\uFF0C\u8BF4\u660E\u8FD9\u662F\u63D2\u4EF6\u65AD\u5F00\u524D\u7684\u65E7\u72B6\u6001\u2014\u2014\u8BF7\u63D0\u9192\u7528\u6237\u68C0\u67E5\u63D2\u4EF6\u5F00\u5173\u662F\u5426\u6253\u5F00\uFF08\u6216\u91CD\u65B0\u52A0\u8F7D\u63D2\u4EF6\u540E\u91CD\u65B0\u6253\u5F00\uFF09\uFF0C\u63D2\u4EF6\u91CD\u8FDE\u4F1A\u81EA\u52A8\u91CD\u65B0\u63E1\u624B\u3002` : `\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u91C7\u96C6\u4EFB\u52A1\u3002${this.pendingResultsHint()}`
      },
      // step<3 不下发 welcome（省 token）；step=3 由宿主 AI 原样展示给用户
      welcome: step === 3 ? { fixedCopy: WELCOME_FIXED_COPY } : null
    };
  }
};
var WELCOME_FIXED_COPY = [
  "\u2705 \u63A2\u6817\u5DF2\u8FDE\u63A5\uFF01\u73B0\u5728\u5C31\u53EF\u4EE5\u8BF4\uFF1A",
  "\u300C\u6211\u5728\u505A\u5BB6\u88C5\u83B7\u5BA2\uFF0C\u63A2\u4E00\u4E0B\u5C0F\u7EA2\u4E66\u6700\u8FD1\u4EC0\u4E48\u5185\u5BB9\u8BC4\u8BBA\u533A\u7559\u8D44\u6700\u591A\u300D",
  "\u300C\u63A2\u4E00\u4E0B\u8D77\u53F7\u5FEB\u7684\u5C0F\u7EA2\u4E66\u8D5B\u9053\uFF0C\u7ED9\u6211 10 \u4E2A\u5BF9\u6807\u8D26\u53F7\u300D",
  "\u300C\u63A2\u4E00\u4E0B\u8FD9\u7BC7\u7206\u6B3E\u7684\u8BC4\u8BBA\u533A\uFF0C\u628A\u60F3\u8BE2\u4EF7\u7684\u4EBA\u90FD\u627E\u51FA\u6765\u300D"
].join("\n");
var MCP_INSTRUCTIONS = [
  "\u63A2\u6817\uFF08LeadsRadar\uFF09\u5448\u73B0\u89C4\u8303\u2014\u2014\u5BF9\u6700\u7EC8\u7528\u6237\u8BF4\u8BDD\u65F6\u9075\u5B88\uFF0C\u56DB\u4E2A\u6280\u80FD\u901A\u7528\uFF1A",
  "1. \u65F6\u95F4\u76F8\u5BF9\u5316\uFF1A\u63A5\u53E3\u8FD4\u56DE\u7684 ISO \u65F6\u95F4\u6233\uFF08\u5982 2026-04-16T16:00:00.000Z\uFF09\u4E00\u5F8B\u8F6C\u6210\u4EBA\u8BDD\u2014\u2014\u300C3 \u5929\u524D\u300D\u300C\u4E0A\u5468\u300D\u300C4\u670817\u65E5\u300D\uFF1B\u6570\u636E\u7ED3\u8BBA\u6807\u6CE8\u300C\u622A\u81F3\u91C7\u96C6\u65F6\u300D\uFF0C\u9632\u6B62\u7528\u6237\u5F53\u5B9E\u65F6\u6570\u636E\u3002",
  "2. \u5B57\u6BB5\u767D\u540D\u5355\uFF1Aid\u3001xsec_token\u3001collected_at\u3001note_id\u3001author_id\u3001synced\u3001task_status \u7B49\u6280\u672F\u5B57\u6BB5\u4E0D\u8FDB\u7528\u6237\u89C6\u91CE\uFF1B\u7528\u6237\u53EA\u770B\u6807\u9898/\u4F5C\u8005/\u4E92\u52A8\u6570/\u76F8\u5BF9\u65F6\u95F4/\u94FE\u63A5/\u7ED3\u8BBA\u3002\u5185\u90E8\u5B57\u6BB5\u786E\u9700\u89E3\u91CA\u65F6\u7FFB\u8BD1\u6210\u4EBA\u8BDD\uFF08synced=false\u2192\u8FD8\u6CA1\u540C\u6B65\u5230\u4E91\u7AEF\uFF09\u3002",
  "3. \u94FE\u63A5\u6807\u9898\u5316\uFF1A\u8D85\u957F\u5E26 token \u7684 URL \u6298\u53E0\u6210\u300A\u6807\u9898\u300B+\u300C\u67E5\u770B\u300D\uFF08markdown \u94FE\u63A5\uFF09\uFF0C\u4E0D\u88F8\u8D34\u957F URL \u5237\u5C4F\uFF1B\u62A5\u544A\u94FE\u63A5\u6CE8\u660E\u300C\u7F51\u9875\u7AEF\u770B\u5B8C\u6574\u7248\u300D\u3002",
  "4. \u9519\u8BEF\u4E09\u6001\uFF1A\u5DE5\u5177\u62A5\u9519\u5148\u5F52\u7C7B\u518D\u8BF4\u8BDD\u2014\u2014\u77AC\u65F6\u7C7B\uFF08\u8D85\u65F6/\u7F51\u7EDC\u6296\u52A8\uFF09\u2192\u300C\u6211\u91CD\u8BD5\u4E00\u6B21\u300D\uFF1B\u9700\u7528\u6237\u64CD\u4F5C\u7C7B\uFF08\u672A\u767B\u5F55/\u63D2\u4EF6\u672A\u8FDE/\u9650\u989D\uFF09\u2192\u7ED9\u5177\u4F53\u4E00\u6B65\uFF08\u53BB\u54EA\u70B9\u4EC0\u4E48\uFF09\uFF1B\u80FD\u529B\u672A\u5F00\u901A\u7C7B\uFF08\u5B57\u6BB5\u67E5\u4E0D\u5230/\u529F\u80FD\u672A\u4E0A\u7EBF\uFF09\u2192\u76F4\u8BF4\u300C\u8FD9\u4E2A\u6570\u636E\u73B0\u5728\u62FF\u4E0D\u5230\u300D+\u7ED9\u66FF\u4EE3\u8DEF\u5F84\u3002\u7981\u6B62\u539F\u6837\u590D\u8FF0\u62A5\u9519\u7801\u548C\u5185\u90E8 message \u7ED9\u7528\u6237\u3002",
  "5. \u957F\u4EFB\u52A1\u5148\u62A5\u9884\u671F\uFF1A\u6279\u91CF\u52A8\u4F5C\uFF08\u8BC4\u8BBA\u6316\u51E0\u767E\u6761\u3001\u5DE1 10 \u4E2A\u8D26\u53F7\uFF09\u5F00\u5DE5\u524D\u5148\u8BF4\u300C\u9884\u8BA1\u5206 N \u6279\u3001\u7EA6 X \u5206\u949F\u300D\uFF0C\u4E0D\u8BA9\u7528\u6237\u5E72\u7B49\uFF1B\u6BCF\u6279\u5B8C\u6210\u64AD\u62A5\u4E00\u884C\u8FDB\u5EA6\u3002"
].join("\n");
var broker = new AgentBroker();
if (!HTTP_MODE && process.stdin && !process.stdin.isTTY) {
  process.stdin.resume();
  process.stdin.on("end", () => {
    log("[lf-agent] stdin EOF\uFF08\u5BBF\u4E3B\u5DF2\u9000\u51FA/\u7BA1\u9053\u5173\u95ED\uFF09\u2192 \u81EA\u52A8\u9000\u51FA\uFF0C\u4E0D\u518D\u5360\u7528\u7AEF\u53E3");
    process.exit(0);
  });
}
var MAX_LIST_LIMIT = 300;
var MAX_COMMENT_LIMIT = 500;
function capLimit(value, fallback, max = MAX_LIST_LIMIT) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}
var TOOLS = [
  {
    name: "leadsradar_connection_status",
    description: "\u68C0\u67E5\u63A2\u6817\uFF08LeadsRadar\uFF09\u6D4F\u89C8\u5668\u63D2\u4EF6\u8FDE\u63A5\u72B6\u6001\u4E0E\u63A5\u5165\u8FDB\u5EA6\u3002\u5F00\u59CB\u4EFB\u4F55\u91C7\u96C6\u524D\u3001\u4EE5\u53CA\u914D\u5BF9\u7B49\u5F85\u671F\u95F4\u5E94\u8F6E\u8BE2\u672C\u5DE5\u5177\uFF08\u6BCF 8 \u79D2\u4E00\u6B21\uFF0C\u6700\u591A 12 \u6B21\uFF09\uFF1Aonboarding.step=1 \u8868\u793A\u63D2\u4EF6\u672A\u8FDE\u63A5\uFF08\u9700\u7528\u6237\u5F00\u542F\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\uFF09\uFF1Bstep=2 \u8868\u793A\u7B49\u5F85\u7528\u6237\u5728\u63D2\u4EF6\u4E2D\u6279\u51C6\u914D\u5BF9\uFF1Bstep=3\uFF08extension.connected=true\uFF09\u8868\u793A\u5DF2\u5C31\u7EEA\uFF0C\u53EF\u4EE5\u8C03\u7528\u91C7\u96C6\u5DE5\u5177\u3002extension.account.loggedIn \u4E3A\u767B\u5F55\u6001\uFF08true=\u5DF2\u767B\u5F55/false=\u672A\u767B\u5F55/null=\u672A\u77E5\uFF09\uFF1A\u5B58\u9009\u9898\uFF08save_topic\uFF09\u7B49\u4E91\u7AEF\u5199\u5165\u52A8\u4F5C\u52A8\u624B\u524D\u5FC5\u67E5\u2014\u2014false \u65F6\u5148\u5F15\u5BFC\u7528\u6237\u5728\u63D2\u4EF6\u4E2A\u4EBA\u4E2D\u5FC3\u767B\u5F55\uFF0C\u522B\u5148\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF1BloggedIn=true \u65F6\u987A\u5E26\u53EF\u7528 extension.account.nickname \u79F0\u547C\u7528\u6237\u3002",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "leadsradar_search_notes",
    description: "\u5728\u5C0F\u7EA2\u4E66\u6216\u6296\u97F3\u6309\u5173\u952E\u8BCD\u641C\u7D22\u4F5C\u54C1\u5E76\u91C7\u96C6\u5217\u8868\u6570\u636E\uFF08\u6807\u9898\u3001\u70B9\u8D5E\u3001\u6536\u85CF\u3001\u8BC4\u8BBA\u6570\u3001\u4F5C\u8005\u3001\u94FE\u63A5\uFF09\u3002\u9002\u5408\uFF1A\u8D5B\u9053\u8C03\u7814\u3001\u7206\u6B3E\u53D1\u73B0\u3001\u9009\u9898\u7075\u611F\u3002\u8FD4\u56DE\u6309\u70ED\u5EA6\u6392\u5E8F\u7684\u7B14\u8BB0\u5217\u8868\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u6279\u6700\u591A 300 \u6761\u300130 \u5206\u949F\u5185\u7D2F\u8BA1\u6700\u591A 600 \u6761\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF0C\u5E76\u4E3B\u52A8\u5EFA\u8BAE\u62C6\u6279\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "\u641C\u7D22\u5173\u952E\u8BCD\uFF0C\u4F8B\u5982\u300C\u5BB6\u88C5\u83B7\u5BA2\u300D" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF0C\u9ED8\u8BA4 xiaohongshu" },
        limit: { type: "integer", description: "\u91C7\u96C6\u6761\u6570\u4E0A\u9650\uFF081-300\uFF0C\u9ED8\u8BA4 10\uFF09" }
      },
      required: ["keyword"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_capture_profile",
    description: "\u91C7\u96C6\u67D0\u4F4D\u535A\u4E3B\u4E3B\u9875\u7684\u5168\u90E8/\u8FD1\u671F\u4F5C\u54C1\u5217\u8868\uFF08\u5C0F\u7EA2\u4E66\u6216\u6296\u97F3\uFF09\u3002\u9002\u5408\uFF1A\u5BF9\u6807\u8D26\u53F7\u5206\u6790\u3001\u8D26\u53F7\u5185\u5BB9\u7B56\u7565\u7814\u7A76\u3002\u9700\u63D0\u4F9B\u535A\u4E3B\u4E3B\u9875 URL\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u6279\u6700\u591A 300 \u6761\u300130 \u5206\u949F\u5185\u7D2F\u8BA1\u6700\u591A 600 \u6761\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF0C\u5E76\u4E3B\u52A8\u5EFA\u8BAE\u62C6\u6279\uFF09\u3002\u2B50\u6DF1\u5EA6\u91C7\u96C6\u7248\uFF08deep:true\uFF09\uFF1A\u4E0E\u63D2\u4EF6\u8D26\u53F7 Tab\u300C\u6DF1\u5EA6\u91C7\u96C6\u300D\u6309\u94AE\u540C\u6E90\u540C\u5F15\u64CE\u2014\u2014\u9010\u6761\u8FDB\u8BE6\u60C5\u9875\u91C7\u96C6\u6B63\u6587+\u5168\u90E8\u8BC4\u8BBA\uFF0C\u6536\u5C3E\u81EA\u52A8\u505A\u8BC4\u8BBA\u610F\u5411\u5FEB\u626B\uFF08A3 \u5206\u7EA7\uFF09\u4E0E\u8D26\u53F7\u56DB\u5206\u7C7B\u6253\u5206\uFF1B\u56E0\u9700\u9010\u6761\u7FFB\u9875\u8017\u65F6 5-20 \u5206\u949F\uFF0C\u4F1A\u7ACB\u5373\u8FD4\u56DE pending \u56DE\u6267\uFF08\u4E0D\u963B\u585E\u5BF9\u8BDD\uFF09\uFF0C\u5B8C\u6210\u540E\u5BF9\u6817\u5B50\u8BF4\u300C\u6817\u5B50\u62A5\u544A\u300D\u53D6\u62A5\u544A\u3002\u6DF1\u5EA6\u91C7\u96C6\u540C\u6837\u5FC5\u987B\u524D\u53F0\u6D4F\u89C8\u5668\u7A97\u53E3\u3002\u975E\u4F1A\u5458\u6DF1\u91C7\u9010\u6761\u5360\u91C7\u96C6\u9650\u989D\u3002\u2B50R96cf \u5FEB\u626B\u7248\u9ED8\u8BA4\u8054\u52A8\u63D2\u4EF6\u76D1\u63A7\u9875\u300C\u626B\u63CF\u89C4\u5219\u300D\u7684\u6DF1\u5EA6\u5FEB\u626B\u8BBE\u7F6E\uFF08\u9ED8\u8BA4\u5F00\u3001\u53EF\u5728\u76D1\u63A7\u9875\u5173\uFF09\uFF1A\u5F00\u7740\u65F6\u5217\u8868\u91C7\u5B8C\u81EA\u52A8\u5BF9\u6700\u65B0 4 \u6761\u4F5C\u54C1\u91C7\u8BC4\u8BBA\uFF08\u53EA\u91C7\u8BC4\u8BBA\u4E0D\u505A\u6B63\u6587\u62C6\u89E3\uFF0C\u5DF2\u626B\u8FC7\u81EA\u52A8\u8DF3\u8FC7\u3001\u6BCF\u8F6E\u53EA\u6DF1\u626B\u65B0\u4F5C\u54C1\uFF09\uFF0C\u56DE\u6267\u6DF1\u626B\u884C\u5982\u5B9E\u8F6C\u8FF0\u5373\u53EF\u3001\u65E0\u9700\u989D\u5916\u64CD\u4F5C\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875 URL\uFF08\u5982 https://www.xiaohongshu.com/user/profile/xxx\uFF09" },
        limit: { type: "integer", description: "\u91C7\u96C6\u6761\u6570\u4E0A\u9650\uFF081-300\uFF0C\u9ED8\u8BA4 20\uFF1Bdeep \u6A21\u5F0F\u4E0B\u4E3A\u8BE6\u60C5\u6761\u6570 1-50\uFF0C\u9ED8\u8BA4 20\uFF09" },
        deep: { type: "boolean", description: "\u6DF1\u5EA6\u91C7\u96C6\u5F00\u5173\uFF1Atrue=\u9010\u6761\u8FDB\u8BE6\u60C5+\u91C7\u8BC4\u8BBA+A3 \u5FEB\u626B+\u56DB\u5206\u7C7B\uFF08\u4E0E\u63D2\u4EF6\u300C\u6DF1\u5EA6\u91C7\u96C6\u300D\u6309\u94AE\u540C\u94FE\uFF0C5-20 \u5206\u949F\u5F02\u6B65 pending\u2192\u6817\u5B50\u62A5\u544A\uFF09\uFF1B\u9ED8\u8BA4 false \u4EC5\u4F5C\u54C1\u5217\u8868" },
        comments_limit: { type: "integer", description: "deep \u6A21\u5F0F\u6BCF\u7BC7\u8BC4\u8BBA\u4E0A\u9650\uFF0810-100\uFF0C\u9ED8\u8BA4 50\uFF09" }
      },
      required: ["url"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_capture_note_comments",
    description: "\u91C7\u96C6\u4E00\u7BC7\u7B14\u8BB0/\u89C6\u9891\u7684\u8BC4\u8BBA\u533A\uFF08\u8BC4\u8BBA\u5185\u5BB9\u3001\u70B9\u8D5E\u6570\u3001\u8BC4\u8BBA\u8005\u4FE1\u606F\uFF09\u3002\u9002\u5408\uFF1A\u627E\u5BA2\u6237\u7EBF\u7D22\uFF08\u8BC4\u8BBA\u7559\u8D44/\u6C42\u63A8\u8350/\u95EE\u4EF7\u683C\uFF09\u3001\u6316\u7528\u6237\u9700\u6C42\u4E0E\u75DB\u70B9\u3002\u9700\u63D0\u4F9B\u7B14\u8BB0 URL\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u7BC7\u6700\u591A 500 \u6761\u8BC4\u8BBA\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF09\u3002\u2B50\u89E6\u8FBE/\u56DE\u8BC4\u7B49\u51FA\u5206\u7EA7\u540D\u5355\u7684\u573A\u666F\uFF08\u2B50R96ez\uFF09\uFF1A\u9ED8\u8BA4 limit=30 \u53EA\u8986\u76D6\u70ED\u95E8\u533A\u2014\u2014\u91C7\u96C6\u540E\u987B\u518D\u8C03 query_local_data(source=comments, note_url=\u540C\u94FE\u63A5) \u62C9\u672C\u5730\u5E93\u5DF2\u6709\u8BC4\u8BBA\uFF0C\u6309\u300C\u4F5C\u8005+\u8BC4\u8BBA\u5185\u5BB9\u300D\u53BB\u91CD\u5408\u5E76\uFF0C\u5206\u7EA7\u4E0E\u540D\u5355\u6C38\u8FDC\u57FA\u4E8E\u5408\u5E76\u540E\u5168\u91CF\uFF0C\u7981\u53EA\u7528\u672C\u8F6E\u65B0\u91C7\uFF08\u91CD\u8DD1\u4E0D\u5408\u5E76\u4F1A\u5BFC\u81F4\u540D\u5355\u4E0E\u4F4E\u6863\u8BA1\u6570\u96C6\u4F53\u7F29\u6C34\uFF09\u3002\u2B50\u56DE\u6267\u542B note_meta\uFF08\u2B50R96g1ai\uFF1Atitle/author_name/note_url \u7B49\uFF0C\u672C\u5730\u5E93\u53CD\u67E5\uFF1B\u2B50R96g1aj \u4E92\u52A8\u56DB\u9879\u900F\u5168 like/comment/collect/share count\u2014\u2014\u3010\u4F5C\u54C1\u8BE6\u60C5\u3011\u4E92\u52A8\u884C\u56DB\u9879\u7167\u586B\uFF0C\u5C0F\u7EA2\u4E66\u4E0D\u663E\u8F6C\u3001\u6296\u97F3\u5C3E\u52A0 \u{1F501}\uFF09\u2014\u2014\u51FA\u3010\u56DE\u590D\u4EFB\u52A1\u3011\u5757\u65F6\u4F5C\u54C1\u6807\u9898\u4EE5\u6B64\u4E3A\u51C6\uFF0C\u7981\u81EA\u62FC\u300C\u672A\u8BBE\u6807\u9898\xB7xx\u300D\uFF1B\u2B50R96g1aj \u8D77\u5F15\u64CE\u81EA\u52A8\u8865\u91C7\u8BE6\u60C5\uFF08\u5E93\u5185\u7F3A\u6807\u9898\u65F6\u540C\u9875\u5148\u91C7\u4E00\u6B21\u8BE6\u60C5\u518D\u91C7\u8BC4\u8BBA\uFF0C\u4E00\u6B21\u5F00\u9875\u4E0D\u989D\u5916\u5360\u9650\u989D\uFF09\uFF0Cnote_meta \u6B63\u5E38\u5FC5\u542B\u6807\u9898\uFF1B\u4ECD\u7F3A\u5931\uFF08\u8865\u91C7\u5931\u8D25\uFF09\u5148\u8C03 note_detail \u8865\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL" },
        limit: { type: "integer", description: "\u8BC4\u8BBA\u6761\u6570\u4E0A\u9650\uFF08\u9ED8\u8BA4 30 \u53EA\u8986\u76D6\u70ED\u95E8\u533A\uFF1B\u89E6\u8FBE/\u5206\u7EA7\u540D\u5355\u573A\u666F\u5EFA\u8BAE\u663E\u5F0F\u4F20 50\u2014\u2014\u70ED\u95E8\u533A\u6309\u{1F44D}\u6392\u5E8F A3 \u96C6\u4E2D\u5728\u524D\uFF0C50 \u6761\u224815 \u79D2\uFF1B\u2B50R96gcj \u63D0\u901F\uFF1A100 \u6761\u8981 27 \u79D2\u8D77\uFF0C\u4EC5\u6DF1\u6316/A3 \u660E\u663E\u504F\u5C11\u65F6\u518D\u52A0\u5230 100~200\uFF09" }
      },
      required: ["url"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_note_detail",
    description: "\u91C7\u96C6\u4E00\u7BC7\u7B14\u8BB0/\u89C6\u9891\u7684\u8BE6\u60C5\u6570\u636E\uFF08\u6B63\u6587\u3001\u6807\u7B7E\u3001\u4E92\u52A8\u6570\u636E\u3001\u4F5C\u8005\u4FE1\u606F\u7B49\uFF09\u3002\u9002\u5408\uFF1A\u7206\u6B3E\u62C6\u89E3\u3001\u5355\u7BC7\u6DF1\u5EA6\u5206\u6790\u3002\u9700\u63D0\u4F9B\u7B14\u8BB0 URL\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u6279\u6700\u591A 20 \u7BC7\u300130 \u5206\u949F\u5185\u7D2F\u8BA1\u6700\u591A 100 \u7BC7\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF0C\u5E76\u4E3B\u52A8\u5EFA\u8BAE\u62C6\u6279\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL" }
      },
      required: ["url"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_download_media",
    description: "\u4E0B\u8F7D\u4E00\u7BC7\u7B14\u8BB0/\u89C6\u9891\u7684\u65E0\u6C34\u5370\u7D20\u6750\u5230\u7528\u6237\u7684\u6D4F\u89C8\u5668\u4E0B\u8F7D\u76EE\u5F55\uFF08\u4E0E\u63D2\u4EF6\u300C\u4E0B\u8F7D\u7D20\u6750\u300D\u6309\u94AE\u540C\u6E90\u540C\u94FE\uFF0C\u5B8C\u5168\u514D\u8D39\u3001\u4E0D\u5360\u4F1A\u5458\u6743\u76CA\u3001\u4E0E\u300C\u63D0\u53D6\u6587\u6848\u300D\u65E0\u5173\uFF09\u3002\u89C6\u9891=MP4+\u5C01\u9762\u56FE\uFF0C\u56FE\u6587=\u56FE\u96C6\u56FE\u7247\uFF0C\u7EDF\u4E00\u843D\u5728\u6D4F\u89C8\u5668\u4E0B\u8F7D\u76EE\u5F55\u7684\u72EC\u7ACB\u5B50\u6587\u4EF6\u5939\u3002\u9002\u5408\uFF1A\u7528\u6237\u8981\u62FF\u539F\u7D20\u6750\u505A\u4E8C\u6B21\u521B\u4F5C/\u526A\u8F91\u3002\u53C2\u6570 note \u4F20\u91C7\u96C6\u5DE5\u5177\u8FD4\u56DE\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF08\u6216\u76F4\u63A5\u7ED9 url\uFF09\u3002\u6CE8\u610F\uFF1A\u4E0B\u8F7D\u4F1A\u540E\u53F0\u8BBF\u95EE\u4E00\u6B21\u4F5C\u54C1\u9875\u5237\u65B0\u5730\u5740\uFF0C\u5360\u7528\u4E00\u6B21\u91C7\u96C6\u9650\u989D\uFF1B\u94FE\u63A5\u7B7E\u540D\u6709\u65F6\u6548\uFF0C\u8BF7\u52FF\u7F13\u5B58\u7ED3\u679C\u6279\u91CF\u91CD\u8BD5\u3002",
    inputSchema: {
      type: "object",
      properties: {
        note: { type: "object", description: "\u91C7\u96C6\u7ED3\u679C\u4E2D\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF08\u539F\u6837\u4F20\u56DE\uFF0C\u4F18\u5148\u7528\u5B83\u7684 note_url/platform/\u5C01\u9762\uFF09" },
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL\uFF08\u672A\u4F20 note \u65F6\u5FC5\u586B\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_extract_text",
    description: "\u63D0\u53D6\u4E00\u7BC7\u7B14\u8BB0/\u89C6\u9891\u7684\u6587\u6848\uFF08\u4E0E\u63D2\u4EF6\u300C\u63D0\u53D6\u6587\u6848\u300D\u6309\u94AE\u540C\u6E90\u540C\u94FE\uFF09\uFF1A\u89C6\u9891=\u4E91\u7AEF\u8BED\u97F3\u8F6C\u6587\u5B57\u9010\u5B57\u7A3F\uFF08ASR\uFF09\uFF0C\u56FE\u6587=\u56FE\u7247 OCR\u3002\u9002\u5408\uFF1A\u62A0\u53E3\u64AD\u6587\u6848\u3001\u6587\u6848\u62C6\u89E3\u3001\u4EFF\u5199\u6539\u5199\u3002\u53C2\u6570\u4F20 note \u5BF9\u8C61\uFF08\u6309 work_type \u81EA\u52A8\u5206\u6D41\u89C6\u9891/\u56FE\u6587\uFF09\u6216\u76F4\u63A5\u7ED9 url\uFF08\u9ED8\u8BA4\u6309\u89C6\u9891\u5904\u7406\uFF09\u3002\u9700\u767B\u5F55\u3001\u5360\u300C\u6587\u6848\u63D0\u53D6\u300D\u989D\u5EA6\uFF08\u4F53\u9A8C\u7248 1 \u6B21/\u5929\u3001\u4ED8\u8D39\u6309\u6708\u2014\u2014\u4E0E\u91C7\u96C6\u9650\u989D\u72EC\u7ACB\u4E24\u672C\u8D26\uFF09\uFF1B\u4E91\u7AEF\u8F6C\u5F55\u7EA6 15~60 \u79D2\u6709\u8FDB\u5EA6\u63D0\u793A\u3002\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED \u5E76\u9644\u767B\u5F55\u6307\u5F15\uFF08\u539F\u8BDD\u8F6C\u8FF0\u7ED9\u7528\u6237\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        note: { type: "object", description: "\u91C7\u96C6\u7ED3\u679C\u4E2D\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF08\u539F\u6837\u4F20\u56DE\uFF0C\u7528\u5B83\u7684 work_type/note_url/\u6807\u9898\uFF09" },
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL\uFF08\u672A\u4F20 note \u65F6\u5FC5\u586B\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_note_deep_research",
    description: "\u6DF1\u5EA6\u62C6\u89E3\u4E00\u7BC7\u4F5C\u54C1\uFF08\u4E0E\u63D2\u4EF6\u300C\u6DF1\u5EA6\u62C6\u89E3\u300D\u6309\u94AE\u540C\u6E90\u540C\u5F15\u64CE\uFF0C\u5355\u7BC7\u6DF1\u5EA6\u62C6\u89E3\u6709\u4E14\u53EA\u6709\u8FD9\u4E00\u79CD\uFF09\uFF1A\u81EA\u52A8\u8865\u9F50\u4F5C\u54C1\u8BE6\u60C5/\u6587\u6848/\u8BC4\u8BBA\u540E\u8DD1\u4E91\u7AEF AI \u6DF1\u5EA6\u5206\u6790\uFF08L2 \u7EA7\uFF09\uFF0C\u4EA7\u51FA\u7EBF\u7D22\u6F0F\u6597\uFF08\u{1F7E2}A3\u5F3A/\u{1F7E0}A3\u5F31/\u{1F7E1}A2/\u26AAA1 \u56DB\u7EA7\u5206\u7EA7\uFF09\u3001\u7EBF\u7D22\u6307\u6570\u8BC4\u5206\u3001\u6700\u8BE5\u505A\u7684\u4E8B\u3002\u8BA1\u8D39\uFF1A\u672C\u5730\u5DF2\u6709\u8BE5\u4F5C\u54C1\u7684\u62C6\u89E3\u62A5\u544A\u65F6\u76F4\u63A5\u514D\u8D39\u89E3\u8BFB\uFF08\u4E0D\u6263\u5238\uFF09\uFF1B\u6CA1\u6709\u624D\u53D1\u8D77\u4E91\u7AEF\u5206\u6790\uFF08\u6263 1 \u5F20\u62C6\u89E3\u5238\uFF0C\u7EA6 1~3 \u5206\u949F\uFF09\uFF0Cforce=true \u5F3A\u5236\u91CD\u62C6\uFF08\u4F1A\u518D\u6263\u5238\uFF09\u3002\u9700\u767B\u5F55\u2014\u2014\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED\uFF0C\u8BF7\u628A\u9519\u8BEF\u4E2D\u7684\u767B\u5F55\u6307\u5F15\u539F\u8BDD\u8F6C\u8FF0\u7ED9\u7528\u6237\u3002\u8FD4\u56DE pending=true \u8868\u793A\u4E91\u7AEF\u4ECD\u5728\u5206\u6790\uFF08\u5238\u5DF2\u6263\u3001\u4E0D\u4F1A\u91CD\u590D\u8BA1\u8D39\uFF09\u2014\u2014\u8BF7\u5F15\u5BFC\u7528\u6237\u7A0D\u7B49\u4E00\u4E24\u5206\u949F\u540E\u8BF4\u300C\u6817\u5B50\u62A5\u544A\u300D\u5373\u53EF\u62FF\u5230\u5B8C\u6574\u62A5\u544A\u3002",
    inputSchema: {
      type: "object",
      properties: {
        note: { type: "object", description: "\u91C7\u96C6\u7ED3\u679C\u4E2D\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF08\u539F\u6837\u4F20\u56DE\uFF0C\u7528\u5B83\u7684 note_url/\u6807\u9898\uFF09" },
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL\uFF08\u672A\u4F20 note \u65F6\u5FC5\u586B\uFF09" },
        force: { type: "boolean", description: "true=\u8DF3\u8FC7\u672C\u5730\u5DF2\u6709\u62A5\u544A\u5F3A\u5236\u91CD\u65B0\u62C6\u89E3\uFF08\u518D\u6263 1 \u5F20\u5238\uFF09\uFF1B\u9ED8\u8BA4 false \u5DF2\u6709\u62A5\u544A\u5148\u514D\u8D39\u89E3\u8BFB" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_track_deep_research",
    description: '\u8D5B\u9053\u6DF1\u5EA6\u7814\u7A76\uFF08\u4E0E\u63D2\u4EF6\u8D5B\u9053\u9875\u300C\u8D5B\u9053\u6DF1\u5EA6\u7814\u7A76\u300D\u6309\u94AE\u540C\u6E90\u540C\u5F15\u64CE\uFF0C\u8D5B\u9053\u7EA7\u6DF1\u5EA6\u7814\u7A76\u6709\u4E14\u53EA\u6709\u8FD9\u4E00\u79CD\uFF09\uFF1A\u81EA\u52A8\u641C\u7D22\u5173\u952E\u8BCD\u2192\u91C7 80 \u6761\u4F5C\u54C1\u5217\u8868 + Top20 \u6DF1\u91C7\uFF08\u9010\u6761\u8BE6\u60C5+\u8BC4\u8BBA\uFF09\u2192\u4E91\u7AEF AI \u751F\u6210\u4E09\u6BB5\u5F0F\u62A5\u544A\uFF08\u8D5B\u9053\u8BCA\u65AD\uFF1A\u503C\u4E0D\u503C\u5F97\u505A/\u5E02\u573A\u9636\u6BB5/\u53D8\u73B0\u6F5C\u529B/\u8FDB\u5165\u96BE\u5EA6\uFF1B\u9700\u6C42\u6D1E\u5BDF\uFF1A\u5185\u5BB9\u7F3A\u53E3\uFF1B\u7B56\u7565\u5BF9\u6807\uFF1A\u516D\u7B56\u7565+\u5BF9\u6807\u8D26\u53F7\uFF09\u3002\u8BA1\u8D39\uFF1A\u975E\u4F1A\u5458\u9996\u6B21\u9650\u514D 1 \u6B21\uFF0C\u4E4B\u540E 8 \u79EF\u5206/\u6B21\uFF1B\u9700\u767B\u5F55\u2014\u2014LOGIN_REQUIRED/\u79EF\u5206\u4E0D\u8DB3 QUOTA_EXCEEDED \u4F1A\u63D0\u524D\u8FD4\u56DE\u4E0D\u767D\u7B49\u3002\u65E0\u7F13\u5B58\u65F6\u5168\u7A0B 15-30 \u5206\u949F\uFF1A\u542F\u52A8\u91C7\u96C6\u540E\u7ACB\u5373\u8FD4\u56DE pending \u56DE\u6267\uFF08\u4E0D\u963B\u585E\u5BF9\u8BDD\uFF09\uFF0C\u5B8C\u6210\u540E\u5BF9\u7528\u6237\u8BF4\u300C\u6817\u5B50\u62A5\u544A\u300D\u62FF\u62A5\u544A\u6458\u8981+\u76F4\u8FBE\u94FE\u63A5\uFF1B1 \u5929\u5185\u540C\u5173\u952E\u8BCD\u81EA\u52A8\u590D\u7528\u91C7\u96C6\u7F13\u5B58\uFF08\u8DF3\u8FC7\u91C7\u96C6\u76F4\u63A5 AI\uFF0C\u7EA6 2-6 \u5206\u949F\uFF09\u3002\u2B50\u626B\u63CF\u91CF\u53EF\u8C03\uFF08R96bv\uFF09\uFF1A\u9ED8\u8BA4\u91C7 80 \u6761\u5217\u8868+Top20 \u6DF1\u91C7\uFF0C\u7528\u6237\u4E3B\u52A8\u6307\u5B9A\u626B\u63CF\u91CF/\u6DF1\u91C7\u91CF/\u8BC4\u8BBA\u91CF\u65F6\u624D\u900F\u4F20 sample_count\uFF0820-120\uFF09/top_deep\uFF085-30\uFF09/comment_limit\uFF0810-100\uFF09\uFF0C\u8D85\u8303\u56F4\u5F15\u64CE\u81EA\u52A8\u5939\u56DE\u8FB9\u754C\u2014\u2014\u56DE\u6267 message \u5E26\u5B9E\u9645\u751F\u6548\u53C2\u6570\uFF0Cpending \u8F6C\u8FBE\u7167\u6284\u5373\u53EF\u3002\u8C03\u7528\u7EAA\u5F8B\uFF1A\u5148 query_local_data(source="reports", keyword=\u5173\u952E\u8BCD) \u67E5\u5DF2\u6709\u8D5B\u9053\u62A5\u544A\u2014\u2014\u6709\u5C31\u514D\u8D39\u89E3\u8BFB\uFF0C\u4E0D\u8981\u91CD\u590D\u751F\u6210\uFF1Bforce=true \u5FFD\u7565\u7F13\u5B58\u5F3A\u5236\u91CD\u91C7\uFF08\u4F1A\u518D\u6263\u79EF\u5206\uFF09\u3002',
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "\u8D5B\u9053\u5173\u952E\u8BCD\uFF08\u5982\u300C\u8F85\u98DF\u300D\u300C\u4EB2\u5B50\u9732\u8425\u300D\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF08\u9ED8\u8BA4 xiaohongshu \u5C0F\u7EA2\u4E66\uFF09" },
        force: { type: "boolean", description: "true=\u5FFD\u7565 1 \u5929\u5185\u91C7\u96C6\u7F13\u5B58\u5F3A\u5236\u91CD\u91C7\uFF1B\u9ED8\u8BA4 false \u7F13\u5B58\u547D\u4E2D\u76F4\u63A5 AI" },
        sample_count: { type: "integer", description: "\u5217\u8868\u91C7\u6837\u6761\u6570\uFF0820-120\uFF0C\u9ED8\u8BA4 80\uFF09\u2014\u2014\u7528\u6237\u4E3B\u52A8\u8981\u6C42\u591A\u626B/\u5C11\u626B\u65F6\u900F\u4F20\uFF0C\u9ED8\u8BA4\u4E0D\u4F20" },
        top_deep: { type: "integer", description: "\u6DF1\u91C7\u6761\u6570\uFF085-30\uFF0C\u9ED8\u8BA4 20\uFF09\u2014\u2014\u7528\u6237\u6307\u5B9A\u6DF1\u91C7\u51E0\u6761\u65F6\u900F\u4F20\uFF0C\u9ED8\u8BA4\u4E0D\u4F20" },
        comment_limit: { type: "integer", description: "\u6BCF\u7BC7\u8BC4\u8BBA\u4E0A\u9650\uFF0810-100\uFF0C\u9ED8\u8BA4 20\uFF09\u2014\u2014\u7528\u6237\u6307\u5B9A\u8BC4\u8BBA\u91C7\u591A\u5C11\u65F6\u900F\u4F20\uFF0C\u9ED8\u8BA4\u4E0D\u4F20" }
      },
      required: ["keyword"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_account_deep_research",
    description: '\u8D26\u53F7\u6DF1\u5EA6\u7814\u7A76\uFF08\u4E0E\u63D2\u4EF6\u8D26\u53F7\u9875\u300C\u8D26\u53F7\u6DF1\u5EA6\u7814\u7A76\u300D\u6309\u94AE\u540C\u6E90\u540C\u5F15\u64CE\uFF0C\u8D26\u53F7\u7EA7\u6DF1\u5EA6\u7814\u7A76\u6709\u4E14\u53EA\u6709\u8FD9\u4E00\u79CD\uFF09\u3002\u4E24\u79CD\u89C6\u89D2\uFF1A\u2460 competitor\uFF08\u9ED8\u8BA4\uFF0C\u7814\u7A76\u522B\u4EBA\uFF09\uFF1A\u4F20 url=\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF0C\u672C\u5730\u7D20\u6750\u8DB3\u591F\uFF08\u226510 \u6761\u4F5C\u54C1\u4E14 8 \u6761\u6709\u6B63\u6587\uFF09\u76F4\u63A5 AI \u5206\u6790\uFF08\u7EA6 2-6 \u5206\u949F\uFF09\uFF1B\u4E0D\u8DB3\u81EA\u52A8\u5148\u6DF1\u91C7 20 \u6761\u4F5C\u54C1\uFF08\u8BE6\u60C5+\u8BC4\u8BBA\uFF0C\u5360\u91C7\u96C6\u989D\u5EA6\uFF09\u518D\u5206\u6790\uFF08\u7EA6 6-25 \u5206\u949F\uFF09\u2192\u4E91\u7AEF\u751F\u6210\u62A5\u544A\uFF1A\u8D26\u53F7\u5B9A\u4F4D\uFF08IP \u4E3B\u7EBF\uFF1A\u5B9A\u4F4D/\u53D7\u4F17\u5206\u5C42/\u53D8\u73B0\u6A21\u5F0F\uFF09\u3001\u5185\u5BB9\u652F\u67F1\uFF083-5 \u6839+\u5404\u81EA A3 \u7387\uFF09\u3001\u4EBA\u7FA4\u753B\u50CF\u3001\u6253\u6CD5\u62C6\u89E3\u3001\u83B7\u5BA2\u5EFA\u8BAE\u3002\u2461 self\uFF08\u590D\u76D8\u6211\u81EA\u5DF1\uFF0C\u5373\u300C\u6817\u5B50\u8D26\u53F7\u590D\u76D8\u300D\u751F\u6210\uFF09\uFF1A\u4E0D\u4F20 url\uFF0C\u81EA\u52A8\u7528\u63D2\u4EF6\u300C\u6211\u7684\u8D26\u53F7\u300D\u91CC\u7ED1\u5B9A\u7684\u8D26\u53F7\uFF1B\u591A\u7ED1\u5B9A\u65F6\u4F20 account_name \u70B9\u540D\uFF08\u6216\u5217\u51FA\u6765\u8BA9\u7528\u6237\u9009\uFF0C\u6B67\u4E49\u4F1A\u8FD4\u56DE SELF_TARGET_AMBIGUOUS\uFF09\uFF1B\u81EA\u52A8\u589E\u91CF\u91C7\u96C6\u8BE5\u8D26\u53F7\u6700\u65B0\u4F5C\u54C1+\u8BC4\u8BBA\uFF0C\u6309\u7ED1\u5B9A\u7684 monitor_target_id \u4E91\u7AEF\u62FC\u6599\u5E76\u6CE8\u5165\u4E0A\u671F\u57FA\u7EBF\u505A\u589E\u91CF\u5BF9\u6BD4\uFF08\u9996\u6D4B\u5EFA\u57FA\u7EBF/\u590D\u6D4B\u51FA\u589E\u91CF\uFF09\uFF0C\u62A5\u544A\u81EA\u52A8\u843D web \u5DE5\u4F5C\u53F0\u300C\u7814\u7A76\u62A5\u544A-\u6211\u7684\u8D26\u53F7\u300D+\u300C\u8D26\u53F7\u590D\u76D8\u300Dtab\uFF1B\u6BCF\u6B21\u590D\u76D8\u5B8C\u6210\u540E\u8FD8\u4F1A\u81EA\u52A8\u6309 IP \u5361\u7ED1\u5B9A\u7684\u4E3B/\u526F\u8D5B\u9053\u8BCD\u89E6\u53D1\u4E00\u6B21\u8D5B\u9053\u590D\u76D8\uFF08\u9009\u9898\u5F52\u56E0\u6599\uFF09\u3002\u8BA1\u8D39\uFF1A\u975E\u4F1A\u5458\u9996\u6B21\u9650\u514D\u3001\u4E4B\u540E\u6309\u79EF\u5206\u8BA1\uFF08job \u521B\u5EFA\u5373\u6263\uFF09\uFF1B\u9700\u767B\u5F55\u2014\u2014LOGIN_REQUIRED/\u79EF\u5206\u4E0D\u8DB3 QUOTA_EXCEEDED \u63D0\u524D\u8FD4\u56DE\u3002\u542F\u52A8\u540E\u7ACB\u5373\u8FD4\u56DE pending \u56DE\u6267\uFF08\u4E0D\u963B\u585E\u5BF9\u8BDD\uFF09\uFF0C\u5B8C\u6210\u540E\u5BF9\u7528\u6237\u8BF4\u300C\u6817\u5B50\u62A5\u544A\u300D\u62FF\u62A5\u544A\u6458\u8981+\u76F4\u8FBE\u94FE\u63A5\u3002\u8C03\u7528\u7EAA\u5F8B\uFF1A\u5148 query_local_data(source="reports", keyword=\u8D26\u53F7\u540D) \u67E5\u5DF2\u6709\u8D26\u53F7\u7814\u7A76\u62A5\u544A\uFF08type=account\uFF09\u2014\u2014\u6709\u5C31\u514D\u8D39\u89E3\u8BFB\uFF0C\u4E0D\u8981\u91CD\u590D\u751F\u6210\uFF08\u7528\u6237\u660E\u786E\u8981\u91CD\u65B0\u590D\u76D8\u624D\u518D\u53D1\u8D77\uFF09\u3002',
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF08\u5C0F\u7EA2\u4E66 /user/profile/ \u6216\u6296\u97F3 /user/\uFF09\u2014\u2014competitor \u89C6\u89D2\u5FC5\u4F20\uFF1Bself \u89C6\u89D2\u4E0D\u4F20\uFF08\u7528\u7ED1\u5B9A\u7684\u6211\u7684\u8D26\u53F7\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF08\u9ED8\u8BA4\u6309\u94FE\u63A5\u81EA\u52A8\u8BC6\u522B\uFF09" },
        perspective: { type: "string", enum: ["self", "competitor"], description: "\u89C6\u89D2\uFF1Acompetitor=\u7814\u7A76\u522B\u4EBA\uFF08\u9ED8\u8BA4\uFF0C\u987B\u4F20 url\uFF09\uFF1Bself=\u590D\u76D8\u6211\u81EA\u5DF1\uFF08\u6817\u5B50\u8D26\u53F7\u590D\u76D8\u751F\u6210\uFF0C\u4E0D\u4F20 url\uFF0C\u81EA\u52A8\u7528\u7ED1\u5B9A\u7684\u6211\u7684\u8D26\u53F7\uFF09" },
        account_name: { type: "string", description: "\u4EC5 self \u89C6\u89D2\uFF1A\u7ED1\u5B9A\u591A\u4E2A\u300C\u6211\u7684\u8D26\u53F7\u300D\u65F6\u70B9\u540D\u8D26\u53F7\u6635\u79F0\uFF1B\u5355\u7ED1\u5B9A\u4E0D\u4F20" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_save_topic",
    description: "\u628A\u4E00\u7BC7\u91C7\u96C6\u5230\u7684\u7B14\u8BB0\u5B58\u5165\u7528\u6237\u7684\u9009\u9898\u4ED3\u5E93\uFF08\u4E91\u7AEF\u5165\u5E93\u5F85\u5206\u62E3\uFF0Cweb \u9009\u9898\u4ED3\u5E93\u4E0E\u63D2\u4EF6\u5DE5\u4F5C\u53F0\u5747\u53EF\u89C1\uFF0C\u4E0E\u63D2\u4EF6\u300C\u5B58\u9009\u9898\u300D\u540C\u6E90\uFF09\u3002\u9002\u5408\uFF1A\u4F60\u7B5B\u9009\u51FA\u503C\u5F97\u521B\u4F5C\u8DDF\u8FDB\u7684\u7206\u6B3E/\u7EBF\u7D22\u7B14\u8BB0\u65F6\u843D\u5E93\u5B58\u6863\u3002\u53C2\u6570 note \u76F4\u63A5\u4F20\u91C7\u96C6\u5DE5\u5177\uFF08search_notes / capture_profile / note_detail\uFF09\u8FD4\u56DE\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF0C\u539F\u6837\u4F20\u56DE\u5373\u53EF\u3002\u6CE8\u610F\uFF1A\u6B64\u64CD\u4F5C\u9700\u8981\u7528\u6237\u5DF2\u767B\u5F55\u2014\u2014\u672A\u767B\u5F55\u65F6\u4F1A\u8FD4\u56DE LOGIN_REQUIRED \u9519\u8BEF\uFF0C\u8BF7\u628A\u9519\u8BEF\u4E2D\u7684\u767B\u5F55\u6307\u5F15\u539F\u6837\u8F6C\u8FF0\u7ED9\u7528\u6237\uFF0C\u767B\u5F55\u540E\u91CD\u8BD5\u5373\u53EF\u3002\u53EA\u5199\u4E00\u6B21\u5E93\u3001\u4E0D\u5360\u91C7\u96C6\u9650\u989D\u3002\u56DE\u6267\u5E26 topic_total\uFF08\u4E91\u7AEF\u9009\u9898\u4ED3\u5E93\u5F53\u524D\u603B\u6761\u6570\uFF0C\u670D\u52A1\u7AEF\u771F\u6E90\uFF09\u4E0E topic_url\uFF08\u9009\u9898\u5361\u76F4\u8FBE\u94FE\u63A5\uFF09\u2014\u2014\u6838\u5BF9\u4ED3\u5E93\u603B\u91CF\u76F4\u8BFB topic_total\uFF0C\u52FF\u7528\u672C\u5730 works \u53CD\u67E5\u5145\u5F53\u4ED3\u5E93\u8BA1\u6570\u3002",
    inputSchema: {
      type: "object",
      properties: {
        note: { type: "object", description: "\u91C7\u96C6\u7ED3\u679C\u4E2D\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF08\u539F\u6837\u4F20\u56DE\uFF0C\u987B\u542B title \u5B57\u6BB5\uFF09" },
        remark: { type: "string", description: "\u53EF\u9009\uFF1A\u5B58\u5165\u539F\u56E0\u5907\u6CE8\uFF08\u5982\u300C\u8BC4\u8BBA\u7559\u8D44\u591A\uFF0C\u9002\u5408\u8DDF\u62CD\u300D\uFF09" }
      },
      required: ["note"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_add_monitor",
    description: "\u628A\u4E00\u4E2A\u5BF9\u6807\u8D26\u53F7\u52A0\u5165\u5BF9\u6807\u5E93\u5E76\u5F00\u542F\u76D1\u63A7\uFF08\u4E0E\u63D2\u4EF6\u300C\u7EB3\u5165\u76D1\u63A7\u300D\u540C\u6E90\uFF09\u3002\u53C2\u6570 url=\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF08\u8D26\u53F7\u987B\u5148\u7528 leadsradar_capture_profile \u91C7\u96C6\u8FC7\uFF0C\u672A\u91C7\u96C6\u4F1A\u8FD4\u56DE ACCOUNT_NOT_COLLECTED \u53CA\u6307\u5F15\uFF09\u3002monitor \u542B\u4E49\uFF1A\u7528\u6237\u8BF4\u300C\u76D1\u63A7/\u76EF\u7740\u300D\u65F6\u4F20 true\uFF08\u52A0\u5BF9\u6807\u4E14\u5F00\u76D1\u63A7\uFF0C\u9700\u767B\u5F55\uFF1B\u4E91\u7AEF 24h \u76EF\u76D8\u4E3A\u4F1A\u5458\u6743\u76CA\uFF0C\u672A\u6FC0\u6D3B\u65F6\u5728\u63D2\u4EF6\u76D1\u63A7\u9875\u70B9\u4EAE\u8BE5\u8D26\u53F7\u80F6\u56CA\u53EF\u6FC0\u6D3B\uFF09\uFF1B\u53EA\u8BF4\u300C\u52A0\u5BF9\u6807\u300D\u4F20 false\uFF08\u514D\u767B\u5F55\u5E42\u7B49\uFF09\u3002\u63D0\u793A\uFF1A\u76D1\u63A7\u547D\u4E2D\u4E0E\u62A5\u544A\u5728\u63D2\u4EF6\u76D1\u63A7\u9875 / web \u5DE5\u4F5C\u53F0\u67E5\u770B\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF08capture_profile \u7528\u8FC7\u7684\u540C\u4E00\u6761\uFF09" },
        monitor: { type: "boolean", description: "true=\u52A0\u5BF9\u6807\u4E14\u5F00\u76D1\u63A7\uFF08\u9700\u767B\u5F55\uFF09\uFF1Bfalse/\u4E0D\u4F20=\u53EA\u786E\u8BA4\u5BF9\u6807\u5E93\u6210\u5458\uFF08\u514D\u767B\u5F55\uFF09\u3002\u7528\u6237\u63D0\u5230\u300C\u76D1\u63A7\u300D\u5373 true" }
      },
      required: ["url"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_remove_benchmark",
    description: '\u300C\u6817\u5B50\u5220\u5BF9\u6807\u300D\uFF1A\u4ECE\u5BF9\u6807\u5E93\u5220\u9664\u4E00\u4E2A\u5BF9\u6807\u8D26\u53F7\u817E\u51FA\u5BF9\u6807\u4F4D\uFF08\u4E0E\u63D2\u4EF6\u76D1\u63A7\u9875\u5361\u7247\u5220\u9664\u540C\u6E90\uFF0C\u4E09\u5904\u540C\u5220\uFF1A\u672C\u5730\u5BF9\u6807\u5E93+\u4E91\u7AEF\u76EE\u6807\u8868+\u672C\u673A\u76D1\u63A7\u8FDE\u5E26\u505C\u6B62\uFF09\u3002\u26A0\uFE0F \u7834\u574F\u6027\u64CD\u4F5C\u5FC5\u987B\u5148\u786E\u8BA4\uFF1A\u8C03\u7528\u524D\u628A\u8981\u5220\u7684\u8D26\u53F7\u62A5\u7ED9\u7528\u6237\u786E\u8BA4\u4E00\u53E5\uFF08\u8D26\u53F7\u540D+\u5E73\u53F0+\u7C89\u4E1D\u6570+\u662F\u5426\u76D1\u63A7\u4E2D\uFF09\uFF0C\u7528\u6237\u786E\u8BA4\u540E\u624D\u8C03\u2014\u2014\u7528\u6237\u6307\u4EE4\u91CC\u5DF2\u70B9\u540D\u4E14\u8BED\u4E49\u660E\u786E\u4E5F\u4E0D\u8DF3\u8FC7\u786E\u8BA4\uFF1B\u6279\u91CF\u5220\u9664\u9010\u4E2A\u786E\u8BA4\u9010\u4E2A\u5220\u3002\u56DE\u6267 message \u7167\u6284\uFF08\u542B\u5BF9\u6807\u4F4D N/M \u4E0E\u4E91\u7AEF\u5220\u9664\u8BF4\u660E\uFF09\uFF1B\u8FD4\u56DE ACCOUNT_NOT_FOUND \u65F6\u5148 leadsradar_query_local_data(source="accounts") \u67E5\u5BF9\u6807\u5E93\u6838\u5BF9\u51C6\u786E\u8D26\u53F7\u540D\u518D\u91CD\u8BD5\u3002',
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF08\u4F18\u5148\uFF0C\u7CBE\u786E\u5339\u914D\uFF09" },
        name: { type: "string", description: "\u8D26\u53F7\u540D\uFF08\u65E0\u94FE\u63A5\u65F6\u7528\uFF1B\u91CD\u540D\u65F6\u987B\u5E26 platform \u6D88\u6B67\uFF09" },
        platform: { type: "string", description: "\u5E73\u53F0\uFF08xiaohongshu/douyin\uFF0C\u91CD\u540D\u8D26\u53F7\u6D88\u6B67\u7528\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_pause_monitor",
    description: "\u300C\u6817\u5B50\u5173\u76D1\u63A7/\u53D6\u6D88\u76D1\u63A7\u300D\uFF1A\u5173\u6389\u4E00\u4E2A\u8D26\u53F7\u7684\u4E91\u7AEF\u76D1\u63A7\uFF08status\u2192paused\uFF0C\u4E0E\u63D2\u4EF6\u76D1\u63A7\u9875\u5F00\u5173\u300C\u76D1\u63A7\u6DF1\u2192\u672A\u76D1\u63A7\u300D\u540C\u6E90\uFF09\u3002\u53EA\u505C\u76D1\u63A7\u4E0D\u5220\u5BF9\u6807\u2014\u2014\u8D26\u53F7\u4FDD\u7559\u5728\u5BF9\u6807\u5E93\uFF0C\u672C\u673A\u626B\u63CF\u4E0D\u53D7\u5F71\u54CD\uFF1B\u542B\u300C\u6211\u7684\u8D26\u53F7\u300D\uFF08is_self \u81EA\u5E26\u76D1\u63A7\u4E5F\u80FD\u5173\uFF09\u3002\u9700\u5DF2\u767B\u5F55\uFF08\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED\uFF0C\u5F15\u5BFC\u7528\u6237\u5BF9\u6817\u5B50\u8BF4\u300C\u6817\u5B50\u767B\u5F55\u300D\uFF09\u3002\u53C2\u6570 url \u6216 name \u81F3\u5C11\u5176\u4E00\uFF08\u91CD\u540D\u5E26 platform \u6D88\u6B67\uFF09\u3002\u56DE\u6267 message \u7167\u6284\uFF1B\u8FD4\u56DE TARGET_NOT_FOUND \u8BF4\u660E\u8BE5\u8D26\u53F7\u672C\u6765\u5C31\u6CA1\u5F00\u76D1\u63A7\uFF08\u5982\u5B9E\u544A\u77E5\u7528\u6237\uFF0C\u4E0D\u8981\u91CD\u8BD5\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875\u94FE\u63A5\uFF08\u4F18\u5148\uFF0C\u7CBE\u786E\u5339\u914D\uFF09" },
        name: { type: "string", description: "\u8D26\u53F7\u540D\uFF08\u65E0\u94FE\u63A5\u65F6\u7528\uFF1B\u91CD\u540D\u65F6\u987B\u5E26 platform \u6D88\u6B67\uFF09" },
        platform: { type: "string", description: "\u5E73\u53F0\uFF08xiaohongshu/douyin\uFF0C\u91CD\u540D\u8D26\u53F7\u6D88\u6B67\u7528\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    // ⭐R96dq 「栗子扫描设置」开窗：对话直接改扫描规则，与插件监控页「扫描规则」同份 local_scan_settings
    // ⭐R96dt 升级「扫描/监控设置」：称呼全端统一（首扫→首次扫描/复扫→新增扫描/深扫评论→评论采集）+注册「栗子监控设置」触发词
    // ⭐R96dv 命中判定规则开窗（用户拍板「命中规则还有两条数据，也要可修改」）：hitMode/hitValue/observeHours 三参（语义两条：命中条件+观察期），与插件「命中观察规则」同源 PUT；⭐R96dw 语义校正：命中条件对两端生效、观察期仅云端监控生效（web runner 唯一消费点），需登录
    name: "leadsradar_scan_settings",
    description: "\u300C\u6817\u5B50\u626B\u63CF\u8BBE\u7F6E/\u6817\u5B50\u76D1\u63A7\u8BBE\u7F6E\u300D\uFF1A\u67E5\u770B\u6216\u4FEE\u6539\u626B\u63CF/\u76D1\u63A7\u8BBE\u7F6E\uFF08\u4E0E\u63D2\u4EF6\u76D1\u63A7\u9875\u300C\u626B\u63CF/\u76D1\u63A7\u8BBE\u7F6E\u300D\u540C\u4EFD\u8BBE\u7F6E\uFF0C\u5BF9\u6807\u8D26\u53F7/\u6211\u7684\u8D26\u53F7\u7684\u672C\u673A\u626B\u63CF\u4E0E\u6817\u5B50\u626B\u5BF9\u6807\u73B0\u626B\u6DF1\u626B\u540C\u4EFD\u751F\u6548\uFF1B\u5DF2\u767B\u5F55\u65F6\u56DE\u6267\u9644\u5E26\u547D\u4E2D\u6761\u4EF6/\u89C2\u5BDF\u671F/\u4E91\u7AEF\u76D1\u63A7\u9891\u7387/\u8D77\u626B\u65F6\u95F4\u56DE\u663E\uFF0C\u9891\u7387/\u65F6\u95F4\u53EA\u8BFB\u6307\u8DEF web \u7AEF\u96F7\u8FBE\u9875\uFF09\u3002\u4E0D\u4F20\u4EFB\u4F55\u53C2\u6570=\u67E5\u770B\u5F53\u524D\u8BBE\u7F6E\uFF1B\u4F20\u54EA\u4E2A\u53C2\u6570\u6539\u54EA\u9879\uFF08\u5176\u4F59\u4FDD\u6301\u73B0\u503C\uFF09\uFF1Afirst \u9996\u6B21\u626B\u63CF\u6761\u6570 20-500\uFF08\u9996\u6B21\u626B\u63CF\u4E00\u6B21\u5E72\u6EE1\u5EFA\u6C60\uFF09\u3001rescan \u65B0\u589E\u626B\u63CF\u6761\u6570 5-20\uFF08\u65B0\u589E\u626B\u63CF\u53EA\u8FFD\u65B0\u7EDD\u4E0D\u91CD\u626B\u5DF2\u626B\u4F5C\u54C1\uFF09\u3001deepComments \u8BC4\u8BBA\u91C7\u96C6\u5F00\u5173\uFF08\u9ED8\u8BA4\u5F00\uFF09\u3001deepCommentLimit \u6BCF\u6761\u4F5C\u54C1\u8BC4\u8BBA\u91C7\u96C6\u4E0A\u9650 10-100\u3001hitMode \u547D\u4E2D\u6761\u4EF6\u6A21\u5F0F dynamic=\u5747\u8D5E\xD7N\uFF08\u70B9\u8D5E\u2265\u8BE5\u8D26\u53F7\u8FD1\u671F\u5747\u8D5E\xD7N\uFF09/follower=\u7C89\u4E1D\xD7N\uFF08\u70B9\u8D5E\u2265\u7C89\u4E1D\u6570\xD7N\uFF09/fixed=\u56FA\u5B9A\u8D5E\uFF08\u70B9\u8D5E\u2265\u56FA\u5B9A\u503C N\uFF09\u3001hitValue \u547D\u4E2D\u6761\u4EF6\u9608\u503C\uFF08\u5747\u8D5E\xD7/\u7C89\u4E1D\xD7 0.1-10\uFF0C\u56FA\u5B9A\u8D5E \u22651 \u6574\u6570\uFF0C\u4E0D\u4F20\u6CBF\u7528\u5F53\u524D\u503C\uFF09\u3001observeHours \u65B0\u4F5C\u54C1\u89C2\u5BDF\u671F 1-168 \u5C0F\u65F6\uFF08\u4E91\u7AEF\u76D1\u63A7\u89C2\u5BDF\u7A97\uFF1A\u65B0\u4F5C\u54C1\u7A97\u5185\u8DDF\u8E2A\u5224\u547D\u4E2D\u3001\u8D85\u7A97\u672A\u547D\u4E2D\u8F6C\u89C2\u5BDF\u5B8C\u6210\u2014\u2014\u4EC5\u4E91\u7AEF\u76D1\u63A7\u751F\u6548\uFF0C\u672C\u673A\u626B\u63CF\u4E0D\u5403\uFF09\u3002\u547D\u4E2D\u6761\u4EF6+\u89C2\u5BDF\u671F=\u547D\u4E2D\u5224\u5B9A\u89C4\u5219\uFF0C\u4E0E\u63D2\u4EF6\u76D1\u63A7\u9875\u300C\u547D\u4E2D\u89C2\u5BDF\u89C4\u5219\u300D\u540C\u6E90\uFF08\u547D\u4E2D\u6761\u4EF6\u5BF9\u4E24\u7AEF\u751F\u6548\uFF1A\u672C\u673A\u626B\u63CF\u4E0A\u62A5+\u4E91\u7AEF\u81EA\u52A8\u626B\u63CF\u540C\u4E00\u6C60\uFF1B\u89C2\u5BDF\u671F\u4EC5\u4E91\u7AEF\u76D1\u63A7\u751F\u6548\u2014\u2014\u2B50R96dw \u4EE3\u7801\u5B9E\u67E5\u8BED\u4E49\u6821\u6B63\uFF09\uFF0C\u4FEE\u6539\u9700\u5DF2\u767B\u5F55\uFF08\u672A\u767B\u5F55\u56DE LOGIN_REQUIRED\uFF09\u3002\u8D8A\u754C\u503C\u81EA\u52A8\u5939\u5230\u8FB9\u754C\uFF1B\u56DE\u6267 message \u7167\u6284\uFF08\u542B\u6539\u524D\u2192\u6539\u540E\u5BF9\u7167\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        first: { type: "number", description: "\u9996\u6B21\u626B\u63CF\u6761\u6570\uFF0820-500\uFF0C\u9ED8\u8BA4 50\uFF1B\u9996\u6B21\u626B\u63CF\u4E00\u6B21\u5E72\u6EE1\u5EFA\u6C60\uFF09" },
        rescan: { type: "number", description: "\u65B0\u589E\u626B\u63CF\u6761\u6570\uFF085-20\uFF0C\u9ED8\u8BA4 10\uFF1B\u65B0\u589E\u626B\u63CF\u53EA\u8FFD\u65B0\uFF09" },
        deepComments: { type: "boolean", description: "\u8BC4\u8BBA\u91C7\u96C6\u5F00\u5173\uFF08\u9ED8\u8BA4\u5F00\uFF09" },
        deepCommentLimit: { type: "number", description: "\u6BCF\u6761\u4F5C\u54C1\u8BC4\u8BBA\u91C7\u96C6\u4E0A\u9650\uFF0810-100\uFF0C\u9ED8\u8BA4 30\uFF09" },
        hitMode: { type: "string", enum: ["dynamic", "follower", "fixed"], description: "\u547D\u4E2D\u6761\u4EF6\u6A21\u5F0F\uFF08dynamic=\u5747\u8D5E\xD7N\uFF1A\u70B9\u8D5E\u2265\u8BE5\u8D26\u53F7\u8FD1\u671F\u5747\u8D5E\xD7N / follower=\u7C89\u4E1D\xD7N\uFF1A\u70B9\u8D5E\u2265\u7C89\u4E1D\u6570\xD7N / fixed=\u56FA\u5B9A\u8D5E\uFF1A\u70B9\u8D5E\u2265\u56FA\u5B9A\u503C N\uFF1B\u4E0E\u63D2\u4EF6\u76D1\u63A7\u9875\u300C\u547D\u4E2D\u89C2\u5BDF\u89C4\u5219\u300D\u540C\u6E90\uFF0C\u5BF9\u4E24\u7AEF\u751F\u6548\uFF0C\u9700\u767B\u5F55\uFF09" },
        hitValue: { type: "number", description: "\u547D\u4E2D\u6761\u4EF6\u9608\u503C\uFF08\u5747\u8D5E\xD7/\u7C89\u4E1D\xD7\uFF1A0.1-10\uFF1B\u56FA\u5B9A\u8D5E\uFF1A\u22651 \u6574\u6570\uFF1B\u4E0D\u4F20\u6CBF\u7528\u5F53\u524D\u503C\uFF09" },
        observeHours: { type: "number", description: "\u65B0\u4F5C\u54C1\u89C2\u5BDF\u671F\uFF081-168 \u5C0F\u65F6\uFF0C\u9ED8\u8BA4 72\uFF1B\u4E91\u7AEF\u76D1\u63A7\u89C2\u5BDF\u7A97\uFF1A\u7A97\u5185\u8DDF\u8E2A\u5224\u547D\u4E2D\u3001\u8D85\u7A97\u672A\u547D\u4E2D\u8F6C\u89C2\u5BDF\u5B8C\u6210\u2014\u2014\u4EC5\u4E91\u7AEF\u76D1\u63A7\u751F\u6548\uFF0C\u672C\u673A\u626B\u63CF\u4E0D\u5403\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_pair_login",
    description: "\u300C\u6817\u5B50\u767B\u5F55\u300D\uFF1A\u5E2E\u7528\u6237\u5B8C\u6210\u63D2\u4EF6\u4E0E\u8D26\u53F7\u7684\u767B\u5F55\u8FDE\u63A5\u2014\u2014\u81EA\u52A8\u6253\u5F00\u7F51\u9875\u767B\u5F55\u9875\uFF08app.leadsradar.cn\uFF0C\u626B\u7801\u6216\u8D26\u5BC6\u767B\u5F55\uFF09\uFF0C\u767B\u5F55\u6210\u529F\u540E\u81EA\u52A8\u8FDE\u63A5\u63D2\u4EF6\uFF08JWT \u81EA\u52A8\u56DE\u6D41\uFF0C\u65E0\u9700\u624B\u6284\u914D\u5BF9\u7801\uFF09\uFF0C\u8FD4\u56DE\u767B\u5F55\u8EAB\u4EFD\uFF08\u4F1A\u5458\u6863\u4F4D/\u90AE\u7BB1/\u79EF\u5206\uFF09\u3002\u5DF2\u767B\u5F55\u65F6\u5E42\u7B49\u8FD4\u56DE\u5F53\u524D\u8EAB\u4EFD\u3002\u6CE8\u610F\uFF1A\u8FD9\u662F\u4E00\u4E2A\u6700\u957F\u7B49 5 \u5206\u949F\u7684\u957F\u4EFB\u52A1\uFF08\u7B49\u7528\u6237\u5728\u7F51\u9875\u4E0A\u6162\u6162\u767B\u5F55\uFF09\uFF0C\u671F\u95F4\u4F1A\u6709\u8FDB\u5EA6\u63D0\u793A\uFF1B\u7528\u6237\u6CA1\u767B\u5F55\u5B8C\u5C31\u8D85\u65F6\u7684\u8BDD\uFF0C\u628A\u8FD4\u56DE\u91CC\u7684\u94FE\u63A5\u7ED9\u7528\u6237\u2014\u2014\u4E4B\u540E\u4EFB\u610F\u65F6\u95F4\u767B\u5F55\u90FD\u4F1A\u81EA\u52A8\u8FDE\u63A5\u3002\u4ED8\u6B3E/\u5F00\u901A\u4F1A\u5458\u4E0D\u8D70\u672C\u5DE5\u5177\uFF1A\u76F4\u63A5\u7ED9\u7528\u6237\u4F1A\u5458\u9875\u94FE\u63A5 app.leadsradar.cn/membership\uFF08\u5DF2\u767B\u5F55\u6001\u70B9\u5F00\u652F\u4ED8\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_get_daily_report",
    description: "\u53D6\u83B7\u5BA2\u65E5\u62A5\uFF08\u6BCF\u5929\u81EA\u52A8\u751F\u6210\u7684\u6628\u65E5\u83B7\u5BA2\u7B80\u8BAF\uFF0C\u9700\u5DF2\u767B\u5F55\uFF09\uFF1A\u4E94\u6BB5\u5168\u91CF\u8FD4\u56DE\u2014\u2014hotHits \u7206\u6587\u547D\u4E2D / a3Strong A3 \u5F3A\u610F\u5411\u5BA2\u6237 / system \u7CFB\u7EDF\u62A5\u544A / radarRank \u96F7\u8FBE\u699C / report \u65B0\u62A5\u544A\uFF0C\u6BCF\u6BB5\u5E26\u6761\u76EE\u6570\u7EC4\uFF08\u6B64\u6570\u636E\u4E0D\u6D89\u5BC6\uFF09\u3002\u2B50R96gp \u6E32\u67D3\u5F52\u53E3\uFF1A\u65E5\u62A5\u7C7B\u6307\u4EE4\uFF08\u6817\u5B50\u65E5\u62A5/\u4ECA\u5929\u7684\u65E5\u62A5/\u83B7\u5BA2\u65E5\u62A5/\u6628\u5929\u6709\u4EC0\u4E48\u7EBF\u7D22\uFF09\u4E00\u5F8B\u7531\u7BA1\u5BB6\u6817\uFF08leadsradar-helper SKILL\uFF09\u627F\u63A5\uFF0C\u6309\u5176\u4E94\u4EF6\u5957\u9AA8\u67B6\u6E32\u67D3\uFF08\u{1F4F0} \u62A5\u5934\u5FBD\u7AE0\u884C+--- \u6BB5\u95F4\u5206\u9694+\u{1F534}\u6700\u65B0\u7EBF\u7D22/\u{1F525}\u7206\u6B3E\u699C\u5355/\u{1F3AF}\u5BF9\u6807\u547D\u4E2D/\u2699\uFE0F\u7CFB\u7EDF\u4FE1\u606F \u6BB5\u9996\u951A\u70B9+\u5173\u952E\u6570\u5B57\u52A0\u7C97+\u62A5\u5C3E\u65E5\u671F\u6233\uFF0C\u4E91\u7AEF\u62A5/\u7EAF\u6D3B\u52A8\u7B80\u62A5/\u7A7A\u65E5\u62A5\u4E09\u5F62\u6001\u540C\u6B3E\u9AA8\u67B6\uFF09\u2014\u2014\u60C5\u62A5\u6817\u7B49\u5176\u4ED6\u6817\u63A5\u5230\u65E5\u62A5\u7C7B\u6307\u4EE4\u4E00\u5F8B\u8F6C\u6D3E\u7BA1\u5BB6\u6817\uFF0C\u7981\u81EA\u5DF1\u8C03\u672C\u5DE5\u5177\u81EA\u7531\u53D1\u6325\u683C\u5F0F\u3002\u8FD1 7 \u5929\u6CA1\u6709\u65E5\u62A5\u65F6\u8FD4\u56DE\u7A7A\u5E76\u8BF4\u660E\u539F\u56E0\uFF08\u9700\u8981\u76D1\u63A7\u8D26\u53F7\u5F53\u5929\u6709\u6570\u636E\uFF09\u3002\u672A\u767B\u5F55\u65F6\u5F15\u5BFC\u5148\u300C\u6817\u5B50\u767B\u5F55\u300D\u3002",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_dm_reply",
    description: "AI \u79C1\u4FE1\u8BDD\u672F\uFF08\u6210\u4EA4\u6817\u89E6\u8FBE\u5305\u79C1\u4FE1\u6BB5\uFF09\uFF1A\u4E3A\u6307\u5B9A\u8BC4\u8BBA\u751F\u6210 3 \u6761\u53EF\u76F4\u63A5\u53D1\u7684\u79C1\u4FE1\u5019\u9009\uFF08first \u9996\u89E6/followup \u8FFD\u95EE\uFF09\u3002\u4E0E\u63D2\u4EF6\u8BC4\u8BBA\u5F39\u7A97\u300CAI \u79C1\u4FE1\u300D\u540C\u6E90\u540C\u5F15\u64CE\uFF08\u4E91\u7AEF AI \u751F\u6210+lf_leads \u81EA\u52A8\u5EFA\u6863+aiReply \u4F1A\u5458\u65E5\u9650\uFF09\u3002\u5DF2\u767B\u5F55\u7528\uFF1B\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED \u5F15\u5BFC\u300C\u6817\u5B50\u767B\u5F55\u300D\uFF0C\u7528\u6237\u4E0D\u60F3\u767B\u5F55\u65F6\u6309\u89E6\u8FBE\u5305\u683C\u5F0F\u81EA\u5199\u8BDD\u672F\u964D\u7EA7\u4EA4\u4ED8\u3002\u8BC4\u8BBA\u8005\u4E3B\u9875 URL \u5728\u91C7\u96C6\u56DE\u6267 author_url \u5B57\u6BB5\uFF08\u89E6\u8FBE\u5305\u6BCF\u6761\u5E26\u4E0A\uFF09\u2014\u2014\u7528\u6237\u786E\u8BA4\u6210\u7A3F\u540E\u7528 leadsradar_send_dm \u4E00\u952E\u4EE3\u53D1\u3002",
    inputSchema: {
      type: "object",
      properties: {
        comment_text: { type: "string", description: "\u8BC4\u8BBA\u539F\u6587\uFF08\u5FC5\u586B\u2014\u2014\u79C1\u4FE1\u8981\u8D34\u7740\u5BF9\u65B9\u8BC4\u8BBA\u5199\uFF09" },
        stage: { type: "string", enum: ["first", "followup"], description: "first=\u9996\u89E6\uFF08\u9ED8\u8BA4\uFF09/followup=\u8FFD\u95EE\uFF08\u5BF9\u65B9\u672A\u56DE\u590D\u65F6\u6362\u89D2\u5EA6\u518D\u89E6\u8FBE\uFF09" },
        commenter_name: { type: "string", description: "\u8BC4\u8BBA\u8005\u6635\u79F0\uFF08\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF09" },
        note_title: { type: "string", description: "\u7B14\u8BB0\u6807\u9898\uFF08\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF08\u9ED8\u8BA4 xiaohongshu\uFF09" },
        intent_level: { type: "string", enum: ["A3_strong", "A3_weak", "A3", "A2"], description: "\u610F\u5411\u6863\u4F4D\uFF08\u9ED8\u8BA4 A3\uFF1B\u300CA3\u300D\u4E3A\u5B58\u91CF\u5408\u5E76\u503C\uFF0C\u7167\u6284\u65E7\u540D\u5355\u65F6\u7528\uFF09" },
        lead_id: { type: "string", description: "\u5DF2\u6709\u7EBF\u7D22 ID\uFF08\u2B50233 fallback \u81EA\u52A8\u5EFA\u6863\u65F6\u4E8C\u89E6\u4EE5\u4E0A\u4F20\uFF0C\u514D\u91CD\u590D\u5EFA\uFF09" }
      },
      required: ["comment_text"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_comment_reply",
    description: "AI \u56DE\u8BC4\u8BDD\u672F\uFF08\u6210\u4EA4\u6817\u56DE\u8BC4\u6BB5\uFF0C\u2B50R96dr \u5F00\u7A97\uFF09\uFF1A\u4E3A\u6307\u5B9A\u8BC4\u8BBA\u751F\u6210 3 \u6761\u53EF\u76F4\u63A5\u53D1\u7684\u8BC4\u8BBA\u533A\u56DE\u590D\u5019\u9009\u3002\u4E0E\u63D2\u4EF6\u8BC4\u8BBA\u5F39\u7A97\u300CAI \u56DE\u590D\u300D\u540C\u6E90\u540C\u5F15\u64CE\uFF08\u4E91\u7AEF AI \u751F\u6210\uFF0C\u8D34\u8BC4\u8BBA\u539F\u6587+\u610F\u5411\u6863\u4F4D\u5199\u8BED\u6C14\uFF0CaiReply \u4F1A\u5458\u65E5\u9650\u540C\u6C60\uFF09\u3002\u5DF2\u767B\u5F55\u7528\uFF1B\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED \u5F15\u5BFC\u300C\u6817\u5B50\u767B\u5F55\u300D\uFF0C\u65E5\u9650\u7528\u5B8C(429)\u6309\u56DE\u8BC4\u5305\u683C\u5F0F\u81EA\u5199\u8BDD\u672F\u964D\u7EA7\u4EA4\u4ED8\uFF08\u6807\u6CE8\u300C\u81EA\u5199\u7248\xB7\u672A\u8D70\u63A2\u6817\u610F\u5411\u5F15\u64CE\u300D\uFF09\u3002\u786E\u8BA4\u5236\u6D41\u7A0B\uFF1A\u5148\u751F\u6210\u7ED9\u7528\u6237\u9009\uFF0C\u7528\u6237\u786E\u8BA4\u53D1\u51FA\u540E\u7528 leadsradar_send_reply \u4E00\u952E\u4EE3\u53D1\uFF08\u6216 leadsradar_mark_lead \u6807\u5DF2\u56DE\u843D\u6863\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        comment_text: { type: "string", description: "\u8BC4\u8BBA\u539F\u6587\uFF08\u5FC5\u586B\u2014\u2014\u56DE\u8BC4\u8981\u8D34\u7740\u5BF9\u65B9\u8BC4\u8BBA\u5199\uFF09" },
        note_title: { type: "string", description: "\u7B14\u8BB0\u6807\u9898\uFF08AI \u4E0A\u4E0B\u6587\uFF0C\u9009\u586B\uFF09" },
        commenter_name: { type: "string", description: "\u8BC4\u8BBA\u8005\u6635\u79F0\uFF08\u9009\u586B\uFF09" },
        intent_level: { type: "string", enum: ["A3_strong", "A3_weak", "A3", "A2", "A1"], description: "\u610F\u5411\u6863\u4F4D\uFF08A3 \u7CFB=\u5BA2\u6237\u8BED\u6C14/A2=\u6F5C\u5728/\u9ED8\u8BA4 A1 \u566A\u97F3\u6863\u515C\u5E95\u8BED\u6C14\uFF1B\u300CA3\u300D\u4E3A\u5B58\u91CF\u5408\u5E76\u503C\uFF09" }
      },
      required: ["comment_text"],
      additionalProperties: false
    }
  },
  {
    // ⭐R96g1af 评论能力迁移 WorkBuddy（任务2·插件调用版一键代发）：复用 R96g1ae 已实测双平台回评引擎
    //   （开作品页→定位目标评论楼→注入→发送→页面核验）——「探栗插件引擎不代发」红线退役
    name: "leadsradar_send_reply",
    description: "\u56DE\u8BC4\u4E00\u952E\u4EE3\u53D1\uFF08\u2B50R96g1af \u63D2\u4EF6\u5F15\u64CE\u7248\uFF09\uFF1A\u628A\u4E00\u6761\u7528\u6237\u5DF2\u786E\u8BA4\u7684\u56DE\u8BC4\u6210\u7A3F\u7531\u63D2\u4EF6\u5F15\u64CE\u53D1\u5230\u76EE\u6807\u8BC4\u8BBA\u697C\u4E0B\u2014\u2014\u81EA\u52A8\u5F00\u4F5C\u54C1\u9875\u2192\u5B9A\u4F4D\u8BE5\u8BC4\u8BBA\u2192\u8D34\u5165\u6210\u7A3F\u2192\u53D1\u9001\u2192\u9875\u9762\u6838\u9A8C\u300C\u8FD9\u6761\u56DE\u590D\u771F\u5B9E\u51FA\u73B0\u300D\uFF0C\u6838\u9A8C\u901A\u8FC7\u624D\u7B97\u53D1\u51FA\uFF08\u5148\u6838\u540E\u6807\uFF09\uFF0C\u5E76\u81EA\u52A8\u8BB0\u8D26 lf_leads\uFF08\u6807\u5DF2\u56DE+\u7559\u75D5\u8BDD\u672F\uFF0C\u56DE\u6267\u5E26 lead_id\uFF09\u3002\u53EA\u53D1\u7528\u6237\u786E\u8BA4\u8FC7\u7684\u6210\u7A3F\uFF08\u4E00\u5B57\u4E0D\u6539\uFF09\uFF1B\u4E00\u6B21\u8C03\u7528=\u53D1\u4E00\u6761\uFF0C\u6279\u5185\u4E0B\u4E00\u6761\u95F4\u9694 8-40 \u79D2\u6309\u7A3F\u957F\uFF08\u2B50R96g1am \u6A21\u62DF\u771F\u4EBA\u6253\u5B57\u8282\u594F\uFF1A30 \u5B57\u7A3F\u224819s\u300160 \u5B57\u224829s\u300180 \u5B57+\u5C01\u9876 40s\u2014\u2014\u56DE\u8BC4=\u535A\u4E3B\u5728\u81EA\u5DF1\u4F5C\u54C1\u4E0B\u4E92\u52A8\uFF0C\u5E73\u53F0\u9F13\u52B1\u3001\u98CE\u63A7\u5224\u5185\u5BB9\u4E0D\u5224\u9891\u7387\uFF1B\u8282\u594F\u7531\u4F60\u63A7\u5236\uFF0C\u5DE5\u5177\u4E0D\u7BA1\u6279\u95F4\u7B49\u5F85\uFF0C\u6279\u95F4 1 \u5206\u949F\u8C61\u5F81\u6027\u5206\u6BB5\uFF09\u3002\u2B50R96g1ao \u9632\u8BEF\u53D1\u53CC\u95F8\uFF1A\u2460\u8BC4\u8BBA\u6761\u76EE\u6709 id/comment_id \u65F6\u5FC5\u4F20 comment_id\uFF08\u5C0F\u7EA2\u4E66 id \u7CBE\u786E\u547D\u4E2D+\u6635\u79F0\u786C\u95F8\u2014\u2014\u540C\u8D28\u8BC4\u8BBA\u5982\u5168\u300C\u591A\u5C11\u94B1\u300D\u53EA\u9760\u6587\u672C\u4F1A\u649E\u8F66\u9519\u53D1\uFF1B\u6296\u97F3 DOM \u65E0 id \u81EA\u52A8\u5FFD\u7565\uFF09\uFF1B\u2461\u56DE\u6267\u542B matched_commenter/matched_comment_text\uFF08\u5B9E\u9645\u5B9A\u4F4D\u5230\u7684\u8BC4\u8BBA\u4F5C\u8005+\u5185\u5BB9\uFF09\u2014\u2014\u6BCF\u6761\u53D1\u5B8C\u5FC5\u987B\u4E0E\u540D\u5355\u5BA2\u6237\u6838\u5BF9\uFF0C\u4E0D\u4E00\u81F4=\u8BEF\u53D1\uFF0C\u7ACB\u5373\u505C\u624B\u544A\u77E5\u7528\u6237\u5E76\u5982\u5B9E\u6807\u6CE8\u8DDF\u8FDB\u5361\u3002\u2B50R96gl \u9632\u9519\u4F4D\u8FDE\u53D1\uFF08261103 \u5B9E\u62A5 3 \u8FDE\u8BEF\u53D1\u5237\u5C4F\u7684\u6839\u4FEE\uFF09\uFF1A\u8C03\u7528\u53C2\u6570\uFF08commenter_name/comment_text/comment_id/lead_id\uFF09\u5FC5\u987B\u4ECE\u786E\u8BA4\u5355\u884C\u9010\u5B57\u590D\u5236\uFF0C\u7981\u53D1\u9001\u65F6\u91CD\u65B0\u635E\u5E93\u6309\u5E8F\u53F7\u53D6\u884C\u91CD\u7EC4\u2014\u2014\u786E\u8BA4\u5355\u6240\u89C1=\u5F15\u64CE\u6240\u53D1\uFF1B\u56DE\u6267\u5230\u8FBE\u7ACB\u5373\u6838\u5BF9\uFF08\u7981\u6512\u6279\u672B\uFF09\u3002\u9519\u8BEF\u53E3\u5F84\uFF1AREPLY_INPUT_TIMEOUT/TARGET_COMMENT_NOT_FOUND \u53EF\u539F\u6837\u91CD\u8BD5 1 \u6B21\uFF1BUNCERTAIN_AFTER_SEND=\u5DF2\u63D0\u4EA4\u672A\u6838\u5230\uFF0C\u7981\u81EA\u52A8\u91CD\u53D1\uFF08\u4EBA\u5DE5\u6838\u5BF9\u9875\u9762\uFF0C\u5DF2\u53D1\u51FA\u5C31\u522B\u518D\u53D1\uFF09\uFF1BDUPLICATE_REPLY=\u5F15\u64CE\u9632\u91CD\u590D\u89E6\u8FBE\u62E6\u622A\uFF08\u540C\u8BC4\u8BBA 10 \u5206\u949F\u5185\u5DF2\u53D1\u8FC7/\u8BE5\u697C\u4E0B\u5DF2\u6709\u540C\u6587\u672C\u56DE\u590D\u2014\u2014\u7591\u4F3C\u91CD\u590D\u8C03\u7528\u6216\u53C2\u6570\u9519\u4F4D\uFF0C\u5148\u4E0E\u7528\u6237\u6838\u5BF9\u7981\u7ED5\u8FC7\uFF09\uFF1BBUSY=\u8BE5\u6761\u6B63\u5728\u53D1\u9001\u4E2D\u52FF\u91CD\u590D\u8C03\u3002\u4E0E\u63D2\u4EF6\u8BC4\u8BBA\u5F39\u7A97\u300C\u53D1\u9001\u300D\u6309\u94AE\u540C\u6E90\u540C\u5F15\u64CE\uFF08\u5C0F\u7EA2\u4E66/\u6296\u97F3\u53CC\u5E73\u53F0\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        note_url: { type: "string", description: "\u4F5C\u54C1\u94FE\u63A5\uFF08\u5FC5\u586B\u2014\u2014\u56DE\u8BC4\u6302\u5728\u8FD9\u7BC7\u4F5C\u54C1\u4E0B\uFF09" },
        commenter_name: { type: "string", description: "\u5BA2\u6237\u6635\u79F0\uFF08\u5FC5\u586B\u2014\u2014\u5B9A\u4F4D\u76EE\u6807\u8BC4\u8BBA\u697C\uFF09" },
        comment_text: { type: "string", description: "\u5BF9\u65B9\u8BC4\u8BBA\u539F\u6587\uFF08\u5FC5\u586B\u2014\u2014\u5B9A\u4F4D\u76EE\u6807\u8BC4\u8BBA+\u8BB0\u8D26\u81EA\u52A8\u5EFA\u6863\u7528\uFF09" },
        reply_text: { type: "string", description: "\u7528\u6237\u786E\u8BA4\u8FC7\u7684\u56DE\u8BC4\u6210\u7A3F\uFF08\u5FC5\u586B\u2014\u2014\u4E00\u5B57\u4E0D\u6539\u539F\u6837\u53D1\u51FA\uFF09" },
        comment_id: { type: "string", description: "\u8BC4\u8BBA\u6761\u76EE ID\uFF08\u2B50R96g1ao \u5F3A\u70C8\u5EFA\u8BAE\uFF1A\u91C7\u96C6\u6570\u636E\u8BC4\u8BBA\u6761\u76EE\u6709 id/comment_id/platform_comment_id \u5B57\u6BB5\u5C31\u5FC5\u4F20\u2014\u2014\u5C0F\u7EA2\u4E66\u7CBE\u786E\u547D\u4E2D\u9632\u540C\u8D28\u8BC4\u8BBA\u649E\u8F66\uFF1B\u6296\u97F3\u81EA\u52A8\u5FFD\u7565\uFF09" },
        author_id: { type: "string", description: "\u8BC4\u8BBA\u8005\u7528\u6237 ID\uFF08\u2B50R96g1ba \u5F3A\u70C8\u5EFA\u8BAE\uFF1A\u91C7\u96C6\u6761\u76EE\u6709 author_id/user_id \u5B57\u6BB5\u5C31\u4F20\u2014\u2014\u5C0F\u7EA2\u4E66 uid \u7CBE\u786E\u5339\u914D\u901A\u9053\uFF08\u6635\u79F0 data-user-id \u6BD4\u5BF9\uFF09\uFF0C\u4E0E comment_id \u53CC\u4FDD\u9669\u9632\u540C\u8D28\u8BC4\u8BBA\u649E\u8F66\u9519\u53D1\u3001\u63D0\u5347\u5343\u6761\u7EA7\u6DF1\u697C\u5B9A\u4F4D\u547D\u4E2D\u7387\uFF1B\u6296\u97F3\u81EA\u52A8\u5FFD\u7565\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF08\u9ED8\u8BA4\u6309 note_url \u81EA\u52A8\u8BC6\u522B\uFF09" },
        note_title: { type: "string", description: "\u7B14\u8BB0\u6807\u9898\uFF08\u8BB0\u8D26\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF09" },
        intent_level: { type: "string", enum: ["A3_strong", "A3_weak", "A3", "A2"], description: "\u610F\u5411\u6863\u4F4D\uFF08\u8BB0\u8D26\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF1B\u300CA3\u300D\u4E3A\u5B58\u91CF\u5408\u5E76\u503C\uFF09" },
        lead_id: { type: "string", description: "\u5DF2\u6709\u7EBF\u7D22 ID\uFF08\u8BB0\u8D26\u514D\u91CD\u590D\u5EFA\u6863\uFF0C\u9009\u586B\uFF1B\u65E0\u5219\u6309\u8BC4\u8BBA\u539F\u6587\u81EA\u52A8\u5EFA\u6863\uFF09" }
      },
      required: ["note_url", "commenter_name", "comment_text", "reply_text"],
      additionalProperties: false
    }
  },
  {
    // ⭐R96g1af 私信一键代发：复用 R96g1ae 已实测双平台私信引擎（XHS openUid 直达会话页/DY 主页私信钮
    //   → 注入→Enter 发送→会话核验）——双平台各真发一条「你好」验证过
    name: "leadsradar_send_dm",
    description: "\u79C1\u4FE1\u4E00\u952E\u4EE3\u53D1\uFF08\u2B50R96g1af \u63D2\u4EF6\u5F15\u64CE\u7248\uFF09\uFF1A\u628A\u4E00\u6761\u7528\u6237\u5DF2\u786E\u8BA4\u7684\u79C1\u4FE1\u6210\u7A3F\u7531\u63D2\u4EF6\u5F15\u64CE\u53D1\u7ED9\u8BC4\u8BBA\u8005\u2014\u2014\u81EA\u52A8\u6253\u5F00\u4E0E\u8BE5\u7528\u6237\u7684\u79C1\u4FE1\u4F1A\u8BDD\uFF08\u5C0F\u7EA2\u4E66\u76F4\u8FBE\u4F1A\u8BDD\u9875/\u6296\u97F3\u4E3B\u9875\u79C1\u4FE1\u9762\u677F\uFF09\u2192\u8D34\u5165\u6210\u7A3F\u2192\u53D1\u9001\u2192\u6838\u9A8C\u300C\u4F1A\u8BDD\u91CC\u771F\u5B9E\u51FA\u73B0\u8FD9\u6761\u6D88\u606F\u300D\uFF0C\u6838\u9A8C\u901A\u8FC7\u624D\u7B97\u53D1\u51FA\uFF08\u5148\u6838\u540E\u6807\uFF09\uFF0C\u5E76\u81EA\u52A8\u8BB0\u8D26 lf_leads\uFF08\u6807\u5DF2\u56DE+\u7559\u75D5\u8BDD\u672F\uFF0C\u56DE\u6267\u5E26 lead_id\uFF09\u3002\u53EA\u53D1\u7528\u6237\u786E\u8BA4\u8FC7\u7684\u6210\u7A3F\uFF08\u4E00\u5B57\u4E0D\u6539\uFF09\uFF1B\u4E00\u6B21\u8C03\u7528=\u53D1\u4E00\u6761\uFF0C\u6279\u5185\u4E0B\u4E00\u6761\u95F4\u9694 45-90 \u79D2\uFF08\u2B50R96g1am MC v0.4.0 OUTREACH_POLICY \u540C\u6B3E\u5B9E\u8BC1\uFF1B\u8282\u594F\u7531\u4F60\u63A7\u5236\uFF0C\u6279\u95F4 1 \u5206\u949F\u8C61\u5F81\u6027\u5206\u6BB5\uFF0C\u79C1\u4FE1\u65E5 \u226480 \u4EBA\uFF09\u3002\u9519\u8BEF\u53E3\u5F84\uFF1AUNCERTAIN_AFTER_SEND=\u5DF2\u63D0\u4EA4\u672A\u6838\u5230\uFF0C\u7981\u81EA\u52A8\u91CD\u53D1\uFF08\u79C1\u4FE1\u91CD\u590D\u53D1\u6700\u4F24\u53F7\uFF0C\u4EBA\u5DE5\u6838\u5BF9\u4F1A\u8BDD\u9875\uFF0C\u5DF2\u53D1\u51FA\u5C31\u522B\u518D\u53D1\uFF09\uFF1BDUPLICATE_REPLY=\u5F15\u64CE\u9632\u91CD\u590D\u89E6\u8FBE\u62E6\u622A\uFF08\u8BE5\u7528\u6237 10 \u5206\u949F\u5185\u5DF2\u53D1\u8FC7\u79C1\u4FE1\u2014\u2014\u7591\u4F3C\u91CD\u590D\u8C03\u7528\uFF0C\u5148\u4E0E\u7528\u6237\u6838\u5BF9\u7981\u7ED5\u8FC7\uFF09\uFF1BBUSY=\u8BE5\u7528\u6237\u79C1\u4FE1\u6B63\u5728\u53D1\u9001\u4E2D\u52FF\u91CD\u590D\u8C03\u3002\u4E0E\u63D2\u4EF6\u8BC4\u8BBA\u5F39\u7A97\u300C\u79C1\u4FE1\u300D\u4E00\u952E\u4EE3\u53D1\u540C\u6E90\u540C\u5F15\u64CE\uFF08\u5C0F\u7EA2\u4E66/\u6296\u97F3\u53CC\u5E73\u53F0\uFF0C261102 \u5B9E\u6D4B\u4EA4\u4ED8\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        author_url: { type: "string", description: "\u8BC4\u8BBA\u8005\u4E3B\u9875\u94FE\u63A5\uFF08\u5FC5\u586B\u2014\u2014\u53D6\u91C7\u96C6\u56DE\u6267\u8BC4\u8BBA\u6761\u76EE\u7684 author_url \u5B57\u6BB5\uFF09" },
        dm_text: { type: "string", description: "\u7528\u6237\u786E\u8BA4\u8FC7\u7684\u79C1\u4FE1\u6210\u7A3F\uFF08\u5FC5\u586B\u2014\u2014\u4E00\u5B57\u4E0D\u6539\u539F\u6837\u53D1\u51FA\uFF09" },
        author_name: { type: "string", description: "\u8BC4\u8BBA\u8005\u6635\u79F0\uFF08\u9009\u586B\u2014\u2014\u5C0F\u7EA2\u4E66\u4FA7\u6821\u9A8C\u4F1A\u8BDD\u5BF9\u8C61\u7528\uFF0C\u5EFA\u8BAE\u5E26\u4E0A\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u5E73\u53F0\uFF08\u9ED8\u8BA4\u6309 author_url \u81EA\u52A8\u8BC6\u522B\uFF09" },
        comment_text: { type: "string", description: "\u5BF9\u65B9\u8BC4\u8BBA\u539F\u6587\uFF08\u8BB0\u8D26\u81EA\u52A8\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF09" },
        note_title: { type: "string", description: "\u7B14\u8BB0\u6807\u9898\uFF08\u8BB0\u8D26\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF09" },
        intent_level: { type: "string", enum: ["A3_strong", "A3_weak", "A3", "A2"], description: "\u610F\u5411\u6863\u4F4D\uFF08\u8BB0\u8D26\u5EFA\u6863\u7528\uFF0C\u9009\u586B\uFF1B\u300CA3\u300D\u4E3A\u5B58\u91CF\u5408\u5E76\u503C\uFF09" },
        lead_id: { type: "string", description: "\u5DF2\u6709\u7EBF\u7D22 ID\uFF08\u8BB0\u8D26\u514D\u91CD\u590D\u5EFA\u6863\uFF0C\u9009\u586B\uFF1B\u65E0\u5219\u6309\u8BC4\u8BBA\u539F\u6587\u81EA\u52A8\u5EFA\u6863\uFF09" }
      },
      required: ["author_url", "dm_text"],
      additionalProperties: false
    }
  },
  {
    // ⭐R96g1ah 五问批 Q1：栗子触达设置 Agent 化（用户原话「关键词要不就叫栗子触达设置」）——
    //   对话宿主查/改全局触达设置，与插件 options「触达设置」页完全同源（改完插件端生成立即生效）
    name: "leadsradar_touch_settings",
    description: "\u6817\u5B50\u89E6\u8FBE\u8BBE\u7F6E\uFF1A\u67E5\u770B/\u4FEE\u6539\u5168\u5C40\u89E6\u8FBE\u8BDD\u672F\u8BBE\u7F6E\uFF08\u624B\u52A8\u56FA\u5B9A\u56DE\u8BC4\u7A3F/\u56FA\u5B9A\u79C1\u4FE1\u7A3F\u3001AI \u751F\u6210\u8981\u6C42\u3001AI \u5B57\u6570\u3001\u6210\u4EA4\u6587\u6863/\u4EBA\u8BBE\u6863\u6848\u5F00\u5173\uFF09\u3002\u7528\u6237\u8BF4\u300C\u6817\u5B50\u89E6\u8FBE\u8BBE\u7F6E\u300D\u300C\u89E6\u8FBE\u8BBE\u7F6E\u300D\u300C\u6539\u56DE\u8BC4\u8BDD\u672F\u8BBE\u7F6E\u300D\u300C\u56FA\u5B9A\u56DE\u8BC4\u7A3F\u6539\u6210\u2026\u300D\u65F6\u7528\uFF1B\u751F\u6210\u8BDD\u672F\u524D\u4E5F\u5EFA\u8BAE\u5148 get \u770B\u4E00\u773C\u624B\u52A8\u7A3F\u4E0E AI \u8981\u6C42\u73B0\u72B6\uFF08\u624B\u52A8\u7A3F\u5DF2\u8BBE\u65F6\u8981\u5148\u95EE\u7528\u6237\u672C\u6B21\u7528\u56FA\u5B9A\u7A3F\u8FD8\u662F AI \u751F\u6210\uFF09\u3002get \u5448\u73B0\u6309\u56DE\u8BC4/\u79C1\u4FE1\u62C6\u4E24\u5F20\u8868\uFF08\u2B50R96g1an\uFF1A\u3010\u56DE\u8BC4\u8BBE\u7F6E\u3011+\u3010\u79C1\u4FE1\u8BBE\u7F6E\u3011\u5404\u81EA\u72EC\u7ACB\uFF1B\u2B50R96g1ao \u8D77\u6210\u4EA4\u6587\u6863/\u4EBA\u8BBE\u6863\u6848\u6309\u6E20\u9053\u72EC\u7ACB\u8FDB\u5404\u81EA\u8868\u5185\u2014\u2014\u56DE\u8BC4\u8868\u663E\u300C\u6210\u4EA4\u6587\u6863\u6CE8\u5165\uFF08\u56DE\u8BC4\uFF09/\u4EBA\u8BBE\u6863\u6848\u6CE8\u5165\uFF08\u56DE\u8BC4\uFF09\u300D\u3001\u79C1\u4FE1\u8868\u540C\uFF0C\u4E0D\u518D\u662F\u516C\u5171\u9879\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["get", "set"], description: "get=\u67E5\u770B\u5168\u91CF\uFF08\u9ED8\u8BA4\uFF09/set=\u4FEE\u6539\uFF08\u81F3\u5C11\u4F20\u4E00\u4E2A\u8981\u6539\u7684\u5B57\u6BB5\uFF0C\u5176\u4F59\u4E0D\u52A8\uFF09" },
        fixed_reply: { type: "string", description: "\u624B\u52A8\u56DE\u8BC4\u7A3F\uFF08\u6279\u91CF\u53D1\u9001\u4F18\u5148\u7528\u5B83\u4E0D\u6263 AI \u989D\u5EA6\uFF1B\u7A7A\u4E32=\u6E05\u7A7A\u505C\u7528\uFF09" },
        fixed_dm: { type: "string", description: "\u624B\u52A8\u79C1\u4FE1\u7A3F\uFF08\u7A7A\u4E32=\u6E05\u7A7A\u505C\u7528\uFF09" },
        reply_requirements: { type: "string", description: "AI \u56DE\u8BC4\u751F\u6210\u9644\u52A0\u8981\u6C42\uFF08\u5B57\u6570/\u8BED\u6C14/\u7981\u8BCD\u7B49\u4E00\u53E5\u8BDD\uFF0C\u968F\u8BF7\u6C42\u6CE8\u5165 prompt\uFF09" },
        dm_requirements: { type: "string", description: "AI \u79C1\u4FE1\u751F\u6210\u9644\u52A0\u8981\u6C42" },
        reply_length: { type: "string", description: "AI \u56DE\u8BC4\u6BCF\u6761\u5B57\u6570\uFF0810-80 \u6570\u5B57\u4E32\uFF0C\u9ED8\u8BA4 20\uFF1B\u975E\u6CD5\u81EA\u52A8\u56DE\u843D\u9ED8\u8BA4\uFF09" },
        dm_length: { type: "string", description: "AI \u79C1\u4FE1\u6BCF\u6761\u5B57\u6570\uFF0810-80 \u6570\u5B57\u4E32\uFF0C\u9ED8\u8BA4 60\uFF1B\u975E\u6CD5\u81EA\u52A8\u56DE\u843D\u9ED8\u8BA4\uFF09" },
        use_deal_doc_reply: { type: "boolean", description: "\u6210\u4EA4\u6587\u6863\u6CE8\u5165\xB7\u4EC5\u56DE\u8BC4\u751F\u6210\uFF08\u2B50R96g1ao \u6E20\u9053\u72EC\u7ACB\uFF0C\u9ED8\u8BA4 true\uFF09" },
        use_deal_doc_dm: { type: "boolean", description: "\u6210\u4EA4\u6587\u6863\u6CE8\u5165\xB7\u4EC5\u79C1\u4FE1\u751F\u6210\uFF08\u2B50R96g1ao \u6E20\u9053\u72EC\u7ACB\uFF0C\u9ED8\u8BA4 true\uFF09" },
        use_persona_doc_reply: { type: "boolean", description: "\u4EBA\u8BBE\u6863\u6848\u6CE8\u5165\xB7\u4EC5\u56DE\u8BC4\u751F\u6210\uFF08\u2B50R96g1ao \u6E20\u9053\u72EC\u7ACB\uFF0C\u9ED8\u8BA4 true\uFF09" },
        use_persona_doc_dm: { type: "boolean", description: "\u4EBA\u8BBE\u6863\u6848\u6CE8\u5165\xB7\u4EC5\u79C1\u4FE1\u751F\u6210\uFF08\u2B50R96g1ao \u6E20\u9053\u72EC\u7ACB\uFF0C\u9ED8\u8BA4 true\uFF09" },
        use_deal_doc: { type: "boolean", description: "\uFF08\u65E7\u540D\u517C\u5BB9\uFF09\u6210\u4EA4\u6587\u6863\u6CE8\u5165\u4E24\u6E20\u9053\u540C\u8BBE\u2014\u2014\u65B0\u8C03\u7528\u8BF7\u7528 use_deal_doc_reply/_dm \u5206\u5F00\u63A7\u5236" },
        use_persona_doc: { type: "boolean", description: "\uFF08\u65E7\u540D\u517C\u5BB9\uFF09\u4EBA\u8BBE\u6863\u6848\u6CE8\u5165\u4E24\u6E20\u9053\u540C\u8BBE\u2014\u2014\u65B0\u8C03\u7528\u8BF7\u7528 use_persona_doc_reply/_dm \u5206\u5F00\u63A7\u5236" }
      },
      additionalProperties: false
    }
  },
  {
    // ⭐R30 执行闭环：web 农场「待回队列」装填的云端任务 → 宿主一句话「处理待发清单」逐条代发。
    //   插件引擎链：agent-tasks executeTouchTasks（拉 lf_touch_tasks pending → 逐条
    //   executeAgentSendReply/SendDm（内含核验+自动记账）→ PATCH 回写任务状态）
    name: "leadsradar_touch_tasks",
    description: "\u5904\u7406\u5F85\u53D1\u6E05\u5355\uFF08\u2B50R30 \u6267\u884C\u95ED\u73AF\u6273\u673A\uFF09\uFF1A\u62C9\u53D6 web \u7EBF\u7D22\u519C\u573A\u88C5\u586B\u7684\u4E91\u7AEF\u5F85\u53D1\u4EFB\u52A1\uFF08\u56DE\u8BC4/\u79C1\u4FE1\uFF09\uFF0C\u9010\u6761\u7531\u63D2\u4EF6\u5F15\u64CE\u4EE3\u53D1\uFF08\u81EA\u52A8\u5F00\u9875\u5B9A\u4F4D\u2192\u53D1\u9001\u2192\u6838\u9A8C\u2192\u8BB0\u8D26 lf_leads\u2192\u4EFB\u52A1\u51FA\u961F\uFF09\uFF0C\u5168\u6D41\u7A0B\u81EA\u52A8\u3002\u7528\u6237\u8BF4\u300C\u5904\u7406\u5F85\u53D1\u6E05\u5355\u300D\u300C\u628A\u5F85\u53D1\u7684\u53D1\u4E86\u300D\u300C\u6267\u884C\u5F85\u53D1\u4EFB\u52A1\u300D\u65F6\u7528\u3002\u7F6E\u9876\u8BC4\u8BBA\u4EFB\u52A1\u4E0D\u4EE3\u53D1\uFF08\u7F6E\u9876\u9700\u4EBA\u5DE5\uFF0C\u56DE\u6267\u4F1A\u63D0\u793A\u53BB\u63D2\u4EF6\u4FE1\u7BB1\u624B\u52A8\u6267\u884C\uFF09\u3002\u6279\u91CF\u8282\u594F\u7531\u5F15\u64CE\u5185\u5EFA\u9632\u98CE\u63A7\u95F4\u9694\uFF08\u56DE\u8BC4 8-40s/\u79C1\u4FE1 45-90s\uFF09\uFF0C\u4EFB\u52A1\u591A\u65F6\u53EF\u7528 limit \u5206\u6279\uFF08\u9ED8\u8BA4\u5168\u91CF\u3001\u4E0A\u9650 20 \u6761/\u6B21\uFF0C\u53D1\u5B8C\u518D\u558A\u4E00\u6B21\u7EE7\u7EED\uFF09\u3002\u5931\u8D25\u7684\u4EFB\u52A1\u7559\u961F\u53EF\u91CD\u8BD5\uFF0C\u56DE\u6267\u5E26\u6210\u529F/\u5931\u8D25\u660E\u7EC6\u3002",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "\u672C\u6B21\u6700\u591A\u6267\u884C\u6761\u6570\uFF081-20\uFF0C\u9ED8\u8BA4\u5168\u90E8\u5F85\u53D1\uFF1B\u6E05\u5355\u957F\u5EFA\u8BAE\u5206\u6279\u9632\u4F1A\u8BDD\u8D85\u65F6\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_mark_lead",
    description: "\u89E6\u8FBE\u7ED3\u679C\u6807\u8BB0\uFF08\u2B50R96dr \u5F00\u7A97\uFF0C\u62CD\u677F\u2462\uFF09\uFF1A\u628A\u4E00\u6761\u7EBF\u7D22\u7684\u8DDF\u8FDB\u72B6\u6001\u5199\u56DE\u4E91\u7AEF lf_leads \u8D26\u672C\uFF08web \u7EBF\u7D22\u519C\u573A\u4E0E\u63D2\u4EF6\u6536\u4EF6\u7BB1\u540C\u6E90\uFF0C\u8DE8\u5BBF\u4E3B\u53EF\u67E5\uFF09\u3002action=mark_replied \u6807\u5DF2\u56DE\uFF08\u53EF\u5E26 text \u7559\u75D5\u53D1\u51FA\u7684\u8BDD\u672F\uFF1B\u65E0 lead_id \u65F6\u5E26 comment_text \u7B49\u4E0A\u4E0B\u6587\u81EA\u52A8\u5EFA\u6863\uFF09/ mark_converted \u5DF2\u7559\u8D44 / mark_lost \u5DF2\u6D41\u5931 / reopen \u91CD\u5F00\u5F85\u5904\u7406\uFF08\u540E\u4E09\u8005\u9700 lead_id\uFF0C\u5148\u7528 leadsradar_lead_records \u67E5\uFF09\u3002\u56DE\u8BC4\u6216\u79C1\u4FE1\u300C\u5B9E\u9645\u53D1\u51FA\u540E\u300D\u8C03\u7528\u2014\u2014\u8FD9\u662F\u89E6\u8FBE\u95ED\u73AF\u7684\u8BB0\u8D26\u52A8\u4F5C\u3002",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["mark_replied", "mark_converted", "mark_lost", "reopen"], description: "mark_replied=\u6807\u5DF2\u56DE\uFF08\u9ED8\u8BA4\uFF09/mark_converted=\u5DF2\u7559\u8D44/mark_lost=\u5DF2\u6D41\u5931/reopen=\u91CD\u5F00\u5F85\u5904\u7406" },
        lead_id: { type: "string", description: "\u7EBF\u7D22 ID\uFF08mark_replied \u53EF\u7F3A\u7701\u8D70\u81EA\u52A8\u5EFA\u6863\uFF1B\u5176\u4F59\u52A8\u4F5C\u5FC5\u586B\uFF09" },
        text: { type: "string", description: "mark_replied \u7559\u75D5\uFF1A\u5B9E\u9645\u53D1\u51FA\u7684\u56DE\u8BC4/\u79C1\u4FE1\u8BDD\u672F\uFF08\u9009\u586B\uFF09" },
        comment_text: { type: "string", description: "\u65E0 lead_id \u81EA\u52A8\u5EFA\u6863\u65F6\u5FC5\u586B\uFF1A\u8BC4\u8BBA\u539F\u6587" },
        commenter_name: { type: "string", description: "\u81EA\u52A8\u5EFA\u6863\u7528\uFF1A\u8BC4\u8BBA\u8005\u6635\u79F0\uFF08\u9009\u586B\uFF09" },
        note_title: { type: "string", description: "\u81EA\u52A8\u5EFA\u6863\u7528\uFF1A\u7B14\u8BB0\u6807\u9898\uFF08\u9009\u586B\uFF09" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u81EA\u52A8\u5EFA\u6863\u7528\uFF1A\u5E73\u53F0\uFF08\u9ED8\u8BA4 xiaohongshu\uFF09" },
        intent_level: { type: "string", enum: ["A3_strong", "A3_weak", "A3", "A2"], description: "\u81EA\u52A8\u5EFA\u6863\u7528\uFF1A\u610F\u5411\u6863\u4F4D\uFF08\u9009\u586B\uFF1B\u300CA3\u300D\u4E3A\u5B58\u91CF\u5408\u5E76\u503C\uFF09" }
      },
      required: ["action"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_lead_records",
    description: "\u67E5\u7EBF\u7D22\u8D26\u672C\uFF08\u2B50R96dr \u5F00\u7A97\uFF0C\u62CD\u677F\u2461\uFF1B\u2B50R96gar \u52A0 source=own\uFF0C\u2B50R96gas \u66F4\u540D\u300C\u6817\u5B50\u6211\u7684\u7EBF\u7D22\u300D\u539F\u300C\u6817\u5B50\u5B88\u5BB6\u300D\uFF09\uFF1A\u4E91\u7AEF lf_leads \u7EBF\u7D22\u8BB0\u5F55\u2014\u2014\u5F85\u5904\u7406/\u5DF2\u56DE/\u5DF2\u7559\u8D44/\u5DF2\u6D41\u5931\u56DB\u6863\u7EDF\u8BA1+\u660E\u7EC6\uFF08\u8BC4\u8BBA\u8005/\u8BC4\u8BBA\u5185\u5BB9/\u610F\u5411\u6863/\u4F5C\u54C1/\u4E3B\u9875\u94FE\u63A5\uFF09\uFF0C\u6309\u65F6\u95F4\u5012\u5E8F\uFF08\u6700\u8FD1\u64CD\u4F5C\u5728\u524D\uFF09\u3002\u540C\u4E00\u63A2\u6817\u8D26\u53F7\u5168\u7EC8\u7AEF\u805A\u5408\uFF1A\u63D2\u4EF6\u6536\u4EF6\u7BB1\u6807\u7684\u3001\u6817\u5B50\u6807\u8BB0\u7684\u90FD\u5728\uFF08\u6362\u5BBF\u4E3B/\u6362\u7535\u8111\u8BB0\u5F55\u90FD\u5728\uFF09\u3002source=own\uFF08\u6817\u5B50\u6211\u7684\u7EBF\u7D22\uFF09\u53EA\u770B\u300C\u6211\u7684\u8D26\u53F7\u300D\u7EBF\u7D22\uFF08\u5BF9\u6807\u8D26\u53F7\u4E0D\u8FDB\uFF0C\u5BF9\u9F50\u63D2\u4EF6\u6536\u4EF6\u7BB1\u53E3\u5F84\uFF09\uFF0C\u9002\u5408\u300C\u6211\u7684\u5F85\u56DE\u5E94\u7EBF\u7D22/\u56DE\u81EA\u5DF1\u8BC4\u8BBA\u533A\u7684\u5BA2\u6237\u300D\u573A\u666F\uFF1B\u4E0D\u4F20=\u5168\u91CF\uFF08\u542B\u5BF9\u6807\u622A\u6D41\u7EBF\u7D22\uFF09\u3002\u9002\u5408\u300C\u8C01\u8FD8\u6CA1\u56DE\u300D\u300C\u89E6\u8FBE\u8BB0\u5F55\u300D\u300C\u672A\u5B8C\u6210\u4EFB\u52A1\u300D\u7C7B\u67E5\u8BE2\u3002\u9700\u5DF2\u767B\u5F55\uFF08\u672A\u767B\u5F55\u8FD4\u56DE LOGIN_REQUIRED \u5F15\u5BFC\u300C\u6817\u5B50\u767B\u5F55\u300D\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["new", "contacted", "converted", "lost"], description: "\u7B5B\u9009\uFF1Anew=\u5F85\u5904\u7406\uFF08\u672A\u5B8C\u6210\uFF09/contacted=\u5DF2\u56DE/converted=\u5DF2\u7559\u8D44/lost=\u5DF2\u6D41\u5931\uFF1B\u4E0D\u4F20=\u5168\u90E8" },
        source: { type: "string", enum: ["own"], description: "\u2B50R96gas \u6817\u5B50\u6211\u7684\u7EBF\u7D22\uFF08\u539F\u6817\u5B50\u5B88\u5BB6\uFF09\uFF1A\u4F20 own \u53EA\u770B\u300C\u6211\u7684\u8D26\u53F7\u300D\u7EBF\u7D22\uFF08\u5BF9\u6807\u8D26\u53F7\u4E0D\u8FDB\uFF09\uFF1B\u4E0D\u4F20=\u5168\u91CF" },
        limit: { type: "integer", description: "\u8FD4\u56DE\u6761\u6570\u4E0A\u9650\uFF081-200\uFF0C\u9ED8\u8BA4 50\uFF09" }
      },
      additionalProperties: false
    }
  },
  {
    // ⭐R96ew 平台登录账号现核：closer「回复主体 ⭐已核」数据源（261101 用户两轮实报「回复账号还是
    //   没检测到 chrome 登录的平台账号」——回执只有名下账号列表，closer 只能列候选反问）。零采集：
    //   只读已打开的平台页面数据（不滚动不占风控限额）。⭐R96ex 查不到分两分支引导——没开平台页=
    //   引导先开页面；开了未登录=引导先完成登录（复查核到才出稿，closer 1.4.11 前置阻断闭环配套）；
    //   部分平台核到时 message 附 missNote 提示未登录平台。⭐R96ey 新增 open_url：没开任何平台页
    //   时插件自动代开该作品页（前台可见）等 boot 再读一次——用户拍板「读到了插件，但是不能唤起
    //   网页？」，旧「不自动开 tab」边界退役（依旧零采集：只开页不滚动不抓数据）。
    name: "leadsradar_whoami",
    description: "\u73B0\u6838\u5F53\u524D\u6D4F\u89C8\u5668\u767B\u5F55\u7684\u5C0F\u7EA2\u4E66/\u6296\u97F3\u8D26\u53F7\uFF08closer \u56DE\u590D\u4EFB\u52A1\u8868\u300C\u56DE\u590D\u4E3B\u4F53\u300D\u884C\u6570\u636E\u6E90\uFF0C\u2B50R96ew \u65B0\u589E\u3001\u2B50R96ex \u5347\u7EA7\u4E24\u5206\u652F\u5F15\u5BFC\u3001\u2B50R96ey \u52A0 open_url \u4EE3\u5F00\uFF09\u3002\u53EA\u8BFB\u5DF2\u6253\u5F00\u7684\u5E73\u53F0\u9875\u9762\u6570\u636E\uFF08\u96F6\u91C7\u96C6\uFF1A\u4E0D\u6EDA\u52A8\u3001\u4E0D\u5360\u91C7\u96C6\u9650\u989D\uFF09\u3002\u8FD4\u56DE\u5F53\u524D\u767B\u5F55\u7684\u5E73\u53F0+\u6635\u79F0\uFF1B\u67E5\u4E0D\u5230\u5206\u4E24\u79CD\u5F15\u5BFC\uFF08\u2B50R96ex\uFF09\uFF1A\u6CA1\u5F00\u5E73\u53F0\u9875\u2192\u4F20\u4E86 open_url \u5219\u63D2\u4EF6\u81EA\u52A8\u4EE3\u5F00\u8BE5\u9875\u9762\u518D\u8BFB\uFF08\u672A\u4F20\u624D\u5F15\u5BFC\u7528\u6237\u624B\u52A8\u5F00\uFF09\uFF1B\u5F00\u4E86\u672A\u767B\u5F55\u2192message \u5F15\u5BFC\u300C\u5148\u5728\u8BE5\u9875\u9762\u5B8C\u6210\u767B\u5F55\uFF08\u53F3\u4E0A\u89D2\u80FD\u770B\u5230\u81EA\u5DF1\u5934\u50CF=\u5DF2\u767B\u5F55\uFF09\uFF0C\u767B\u5F55\u540E\u518D\u590D\u67E5\u300D\uFF1B\u90E8\u5206\u5E73\u53F0\u6838\u5230\u65F6 message \u9644\u300C\u53E6\uFF1AX \u9875\u9762\u5DF2\u5F00\u4F46\u672A\u68C0\u6D4B\u5230\u767B\u5F55\u300D\u3002closer \u51FA\u56DE\u8BC4/\u79C1\u4FE1\u7A3F\u524D\u5FC5\u8C03\uFF08\u4F20 open_url=\u4F5C\u54C1\u94FE\u63A5\uFF09\uFF0C\u6838\u5230\u586B\u300C\u2B50\u5DF2\u6838 @\u771F\u6635\u79F0\u300D\u3001\u6838\u4E0D\u5230\u672C\u6B65\u963B\u65AD\u6309 message \u5F15\u5BFC\u7528\u6237\u3001\u590D\u67E5\u6838\u5230\u624D\u51FA\u7A3F\uFF08closer 1.4.12 \u524D\u7F6E\u963B\u65AD\u95ED\u73AF\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        open_url: {
          type: "string",
          description: "\u53EF\u9009\u2014\u2014\u6CA1\u5F00\u4EFB\u4F55\u5E73\u53F0\u9875\u65F6\u8BA9\u63D2\u4EF6\u81EA\u52A8\u6253\u5F00\u7684\u9875\u9762 URL\uFF08\u4E00\u822C\u4F20\u4F5C\u54C1\u94FE\u63A5\uFF0C\u4EC5\u63A5\u53D7\u5C0F\u7EA2\u4E66/\u6296\u97F3\u57DF\u540D https \u94FE\u63A5\uFF09\uFF1B\u4F20\u4E86\u5B83\u300C\u6CA1\u5F00\u9875\u300D\u5206\u652F\u4E0D\u518D\u8BA9\u7528\u6237\u624B\u52A8\u5F00\u9875\uFF0C\u63D2\u4EF6\u4EE3\u5F00\u540E\u76F4\u63A5\u8BFB\u767B\u5F55\u6001"
        }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_query_local_data",
    description: "\u67E5\u8BE2\u63A2\u6817\u63D2\u4EF6\u672C\u5730\u6570\u636E\u5E93\u4E0E\u4E91\u7AEF\u7ED1\u5B9A\u6570\u636E\uFF08\u53EA\u8BFB\uFF0C\u4E0D\u5360\u91C7\u96C6\u9650\u989D\uFF09\u3002\u9002\u5408\uFF1A\u67E5\u770B/\u7EDF\u8BA1\u5386\u53F2\u91C7\u96C6\u7684\u4F5C\u54C1\u3001\u8D26\u53F7\u3001\u5DF2\u5B58\u9009\u9898\u3001\u67D0\u7BC7\u7B14\u8BB0\u7684\u8BC4\u8BBA\uFF0C\u672C\u5730\u7F13\u5B58\u7684 AI \u7814\u7A76\u62A5\u544A\uFF08\u4F5C\u54C1\u62C6\u89E3/\u8D26\u53F7\u7814\u7A76/\u8D5B\u9053\u7814\u7A76/\u8D26\u53F7\u590D\u76D8\uFF09\uFF0C\u76D1\u63A7\u6C60\u8FD1 7 \u5929\u52A8\u6001\uFF0C\u4EE5\u53CA IP \u5361\u7ED1\u5B9A\u7684\u8D5B\u9053\u8BCD\u72B6\u6001\u3002\u8FD4\u56DE\u6309\u65F6\u95F4\u5012\u5E8F\u7684\u8BB0\u5F55\u5217\u8868\uFF08\u6761\u6570\u4E0A\u9650 200\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          enum: ["works", "notes", "accounts", "comments", "reports", "monitor", "ip_cards"],
          description: "\u6570\u636E\u6E90\uFF1Aworks=\u5DF2\u5B58\u9009\u9898\u8BB0\u5F55\uFF0Cnotes=\u5168\u90E8\u91C7\u96C6\u8FC7\u7684\u4F5C\u54C1\uFF0Caccounts=\u91C7\u96C6\u8FC7\u7684\u8D26\u53F7\uFF0Ccomments=\u67D0\u7BC7\u7B14\u8BB0\u7684\u8BC4\u8BBA\uFF08\u987B\u914D note_url\uFF09\uFF0Creports=\u672C\u5730\u7F13\u5B58\u7684 AI \u7814\u7A76\u62A5\u544A\uFF08\u8FD4\u56DE\u7C7B\u578B/\u6807\u9898/\u4E00\u53E5\u8BDD\u5EFA\u8BAE/\u62A5\u544A\u76F4\u8FBE\u94FE\u63A5\uFF0C\u5168\u6587\u5728 web \u7AEF\u6253\u5F00\uFF1B\u2B50R96bw \u4E0D\u4F20 keyword=\u5168\u90E8\u62A5\u544A\u6309\u65F6\u95F4\u5012\u5E8F\u2014\u2014\u300C\u6817\u5B50\u62A5\u544A\u300D\u5217\u8868\u53E3\u5F84\uFF0C\u914D limit=7 \u51FA\u6700\u8FD1\u4E00\u89C8\uFF09\uFF0Cmonitor=\u4E91\u7AEF\u76D1\u63A7\u6C60\u8FD1 7 \u5929\u52A8\u6001\uFF08\u2B50R96bo \u6817\u5B50\u626B\u5BF9\u6807\u6570\u636E\u6E90\uFF09\uFF0Cip_cards=IP \u5361\u7ED1\u5B9A\u7684\u8D5B\u9053\u8BCD\u72B6\u6001\uFF08\u2B50R180 \u6817\u5B50\u8D5B\u9053\u590D\u76D8\u6570\u636E\u6E90\uFF1A\u6BCF\u5361\u4E3B/\u526F\u8D5B\u9053\u8BCD + \u6709\u65E0\u62A5\u544A/\u5E73\u53F0/\u66F4\u65B0\u65F6\u95F4\u2014\u2014platform=null \u987B\u4E0E\u7528\u6237\u786E\u8BA4\u5E73\u53F0\u540E\u53D1\u8D77\uFF09"
        },
        keyword: { type: "string", description: "\u53EF\u9009\uFF1A\u6A21\u7CCA\u5339\u914D\u6807\u9898/\u4F5C\u8005\u540D/\u6635\u79F0" },
        platform: { type: "string", enum: ["xiaohongshu", "douyin"], description: "\u53EF\u9009\uFF1A\u6309\u5E73\u53F0\u8FC7\u6EE4" },
        note_url: { type: "string", description: "source=comments \u65F6\u5FC5\u586B\uFF1A\u76EE\u6807\u7B14\u8BB0 URL" },
        limit: { type: "integer", description: "\u8FD4\u56DE\u6761\u6570\u4E0A\u9650\uFF081-200\uFF0C\u9ED8\u8BA4 50\uFF09" }
      },
      required: ["source"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_claim_pending_result",
    description: '\u9886\u53D6\u63A2\u6817\u63D2\u4EF6\u4FA7\u5DF2\u5B8C\u6210\u4F46\u672A\u88AB\u8BA4\u9886\u7684\u4EFB\u52A1\u7ED3\u679C\uFF08\u4E0D\u5360\u91C7\u96C6\u9650\u989D\u3001\u79D2\u56DE\uFF09\u3002\u4F55\u65F6\u7528\uFF1A\u2460\u4EFB\u52A1\u8D85\u65F6\u540E\uFF08\u63D2\u4EF6\u53EF\u80FD\u5DF2\u8DD1\u5B8C\uFF0C\u5148\u9886\u518D\u51B3\u5B9A\u662F\u5426\u91CD\u53D1\uFF0C\u907F\u514D\u53CC\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\uFF1B\u2461\u5BBF\u4E3B/\u4F1A\u8BDD\u91CD\u542F\u540E\u56DE\u6765\uFF1B\u2462connection_status \u7684 extension.pendingResults \u5217\u8868\u975E\u7A7A\u65F6\u3002\u9886\u53D6\u7ED3\u679C\u91CC results \u4E3A\u7ED3\u679C\u672C\u4F53\u53EF\u76F4\u63A5\u4F7F\u7528\uFF0Cpending \u4E3A\u5269\u4F59\u672A\u9886\u53D6\u6458\u8981\u3002\u9886\u4E0D\u5230\u518D\u7528 query_local_data \u67E5\u672C\u5730\u5E93\uFF0C\u90FD\u6CA1\u6709\u624D\u8003\u8651\u91CD\u53D1\u4EFB\u52A1\u3002\u2B50R96bw \u7528\u6237\u558A\u300C\u6817\u5B50\u62A5\u544A\u300D\u65F6\u7684\u5408\u4E00\u5165\u53E3\uFF1A\u5148\u8C03\u672C\u5DE5\u5177\u9886 pending \u7ED3\u679C\uFF08\u6709\u521A\u5B8C\u6210\u7684\u62A5\u544A\u5148\u4EA4\u4ED8\u6700\u65B0\u4E00\u4EFD\uFF09\uFF1B\u65E0 pending/\u9886\u5B8C\u518D query_local_data(source="reports") \u5217\u6700\u8FD1\u62A5\u544A\u4E00\u89C8\uFF08\u22647 \u6761\uFF09\u6536\u5C3E\u3002',
    inputSchema: {
      type: "object",
      properties: {
        taskId: { type: "string", description: "\u53EF\u9009\uFF1A\u8981\u9886\u53D6\u7684 taskId\uFF08\u6765\u81EA connection_status \u7684 extension.pendingResults\uFF09\uFF1B\u4E0D\u4F20=\u9886\u53D6\u5168\u90E8\u672A\u9886\u53D6\u7ED3\u679C" }
      },
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_get_latest_skills",
    description: "\u83B7\u53D6\u63A2\u6817\u4E94\u6280\u80FD\uFF08\u60C5\u62A5\u6817 radar / \u6D1E\u5BDF\u6817 insights / \u521B\u4F5C\u6817 creator / \u6210\u4EA4\u6817 closer / \u7BA1\u5BB6\u6817 helper\uFF09\u4E91\u7AEF\u6700\u65B0\u7248 SKILL.md\u3002\u4F55\u65F6\u7528\uFF1Aconnection_status \u7684 skills_latest \u5BF9\u7167\u5BBF\u4E3B\u6280\u80FD\u6587\u4EF6 frontmatter version \u53D1\u73B0\u843D\u540E\u65F6\u2014\u2014\u6280\u80FD\u6587\u4EF6\u88C5\u5728\u5BBF\u4E3B\u6280\u80FD\u5E93\u91CC\uFF08\u63A2\u6817MCP \u591F\u4E0D\u7740\uFF09\uFF0C\u672C\u5DE5\u5177\u628A\u6700\u65B0 SKILL.md \u5168\u6587\u9012\u4E0A\u6765\uFF0C\u5BBF\u4E3B AI \u5C55\u793A\u7ED9\u7528\u6237\u6574\u4F53\u590D\u5236\u3001\u6309\u5BBF\u4E3B\u81EA\u5DF1\u7684\u6280\u80FD\u5B89\u88C5\u65B9\u5F0F\u8986\u76D6\u65E7\u6587\u4EF6\u5373\u53EF\u5B8C\u6210\u6280\u80FD\u5347\u7EA7\u3002\u4E0D\u4F20 name \u8FD4\u56DE\u4E94\u6280\u80FD\u7684\u4E91\u7AEF\u6700\u65B0\u7248\u672C\u8868\u4E0E\u66F4\u65B0\u6307\u5F15\uFF1B\u4F20 name \u8FD4\u56DE\u8BE5\u6280\u80FD SKILL.md \u5168\u6587\uFF08content \u5B57\u6BB5\uFF09\u4E0E\u4ECE frontmatter \u63D0\u53D6\u7684 version\u3002",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", enum: ["radar", "insights", "creator", "closer", "helper"], description: "\u6280\u80FD\u540D\uFF08\u4E94\u6817\u4E4B\u4E00\uFF09\uFF1B\u4E0D\u4F20=\u8FD4\u56DE\u7248\u672C\u8868+\u66F4\u65B0\u6307\u5F15" }
      },
      additionalProperties: false
    }
  }
];
var SVC_IPC_PORT = 17374;
var svcWakeFailed = false;
function isTcpOpen(port) {
  return new Promise((resolve) => {
    const s = createConnection({ port, host: "127.0.0.1" });
    const done = (ok) => {
      s.destroy();
      resolve(ok);
    };
    s.setTimeout(600, () => done(false));
    s.once("connect", () => done(true));
    s.once("error", () => done(false));
  });
}
async function wakeLocalService() {
  try {
    if (process.platform !== "win32" || svcWakeFailed) return;
    if (await isTcpOpen(SVC_IPC_PORT)) return;
    const regKeys = [
      "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com.leadsradar.service",
      "HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\com.leadsradar.service"
    ];
    for (const k of regKeys) {
      try {
        const { stdout } = await new Promise((res, rej) => execFile("reg", ["query", k, "/ve"], { windowsHide: true }, (e, so) => e ? rej(e) : res({ stdout: so })));
        const m = stdout.match(/REG_SZ\s+(\S.*com\.leadsradar\.service\.json)/i);
        if (!m) continue;
        const conf = JSON.parse(readFileSync(m[1].trim(), "utf8"));
        const exe = conf && conf.path;
        if (!exe || !existsSync(exe)) continue;
        const child = spawn(exe, ["--woken-by-agent"], { detached: true, stdio: "ignore", windowsHide: true });
        child.unref();
        log(`[lf-agent] AI \u5524\u9192\uFF1A\u63A2\u6817 MCP \u672A\u8FD0\u884C\uFF0C\u5DF2\u62C9\u8D77 ${exe}`);
        return;
      } catch {
      }
    }
    svcWakeFailed = true;
  } catch {
  }
}
var SELF_FILE = fileURLToPath(import.meta.url);
var UPDATE_STATE_FILE = join(homedir(), ".leadsradar-agent-update.json");
var UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1e3;
var UPDATE_FRESH_INTERVAL_MS = 3 * 60 * 1e3;
var REGISTRY_VERSION_APIS = [
  "https://data.jsdelivr.com/v1/packages/npm/leadsradar-agent",
  "https://registry.npmjs.org/leadsradar-agent/latest",
  "https://registry.npmmirror.com/leadsradar-agent/latest"
];
var SKILL_NAMES = ["radar", "insights", "creator", "closer", "helper"];
var selfUpdate = { state: "idle", latestVersion: null, fromVersion: null, checkedAt: null };
function compareVersions(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d;
  }
  return 0;
}
function readUpdateStateFile() {
  try {
    return JSON.parse(readFileSync(UPDATE_STATE_FILE, "utf8")) || {};
  } catch {
    return {};
  }
}
async function fetchLatestNpmVersion() {
  for (const api of REGISTRY_VERSION_APIS) {
    try {
      const res = await fetch(api, { signal: AbortSignal.timeout(8e3) });
      if (!res.ok) continue;
      const j = await res.json();
      const ver = j && String(j.version || j.tags && j.tags.latest || "");
      if (/^\d+\.\d+\.\d+/.test(ver)) return ver;
    } catch {
    }
  }
  return null;
}
async function fetchRemoteText(path) {
  if (typeof fetch !== "function") return null;
  const guard = (t) => t && t.length > 1e3 && !t.trimStart().startsWith("<");
  const tryFetch = async (url, primary) => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15e3), redirect: "follow" });
      if (!res.ok) return null;
      const text = await res.text();
      return guard(text) ? { text, primary } : null;
    } catch {
      return null;
    }
  };
  const toPrimary = (p) => p.then((v) => v || Promise.reject(new Error("miss")));
  const fallback = tryFetch(`https://cdn.jsdelivr.net/npm/leadsradar-agent${path}`, false);
  const viaExact = fetchLatestNpmVersion().then(
    (exact) => exact ? Promise.any([
      toPrimary(tryFetch(`https://unpkg.com/leadsradar-agent@${exact}${path}`, true)),
      toPrimary(tryFetch(`https://cdn.jsdelivr.net/npm/leadsradar-agent@${exact}${path}`, true))
    ]).catch(() => null) : null
  );
  try {
    return await toPrimary(viaExact);
  } catch {
  }
  return await fallback;
}
async function maybeSelfUpdate() {
  if (selfUpdate.state === "checking") return;
  const saved = readUpdateStateFile();
  const foundNewer = saved.latestVersion && compareVersions(saved.latestVersion, ADAPTER_VERSION) > 0;
  const throttleMs = foundNewer ? UPDATE_CHECK_INTERVAL_MS : UPDATE_FRESH_INTERVAL_MS;
  if (saved.lastChecked && Date.now() - saved.lastChecked < throttleMs) {
    if (saved.latestVersion && selfUpdate.state !== "updated-pending-restart") {
      selfUpdate.state = "up-to-date";
      selfUpdate.latestVersion = saved.latestVersion;
      selfUpdate.checkedAt = saved.lastChecked;
    }
    return;
  }
  selfUpdate.state = "checking";
  try {
    const remote = await fetchRemoteText("/leadsradar-agent.mjs");
    const m = remote && remote.text.match(/ADAPTER_VERSION\s*=\s*["'](\d+\.\d+\.\d+)["']/);
    if (!m) throw new Error("fetch latest mjs failed");
    if (!remote.primary && compareVersions(m[1], ADAPTER_VERSION) <= 0) {
      selfUpdate.state = "idle";
      log(`[lf-agent] \u5907\u6E90(${m[1]})\u7591\u4F3C CDN \u6EDE\u540E\uFF08\u8FDB\u7A0B ${ADAPTER_VERSION}\uFF09\uFF0C\u672C\u8F6E\u4E0D\u5224\u5B9A\uFF0C\u4E0B\u8F6E\u518D\u67E5`);
      return;
    }
    selfUpdate.latestVersion = m[1];
    selfUpdate.checkedAt = Date.now();
    if (compareVersions(m[1], ADAPTER_VERSION) <= 0) {
      if (selfUpdate.state !== "updated-pending-restart") selfUpdate.state = "up-to-date";
      try {
        writeFileSync(UPDATE_STATE_FILE, JSON.stringify({ ...saved, lastChecked: selfUpdate.checkedAt, latestVersion: m[1] }), "utf8");
      } catch {
      }
      return;
    }
    const tmpFile = SELF_FILE + ".tmp";
    writeFileSync(tmpFile, remote.text, "utf8");
    renameSync(tmpFile, SELF_FILE);
    selfUpdate.fromVersion = ADAPTER_VERSION;
    selfUpdate.state = "updated-pending-restart";
    log(`[lf-agent] \u81EA\u66F4\u65B0\uFF1A${ADAPTER_VERSION} \u2192 ${m[1]} \u5DF2\u5199\u5165 ${SELF_FILE}\uFF0C\u91CD\u542F\u5BBF\u4E3B\u540E\u751F\u6548`);
    try {
      writeFileSync(UPDATE_STATE_FILE, JSON.stringify({ lastChecked: selfUpdate.checkedAt, latestVersion: m[1], lastUpdate: { from: ADAPTER_VERSION, to: m[1], at: (/* @__PURE__ */ new Date()).toISOString() } }), "utf8");
    } catch {
    }
  } catch (e) {
    if (selfUpdate.state !== "updated-pending-restart") selfUpdate.state = "idle";
    try {
      writeFileSync(UPDATE_STATE_FILE, JSON.stringify({ ...saved, lastChecked: Date.now(), lastError: String(e?.message || e).slice(0, 200) }), "utf8");
    } catch {
    }
  }
}
function checkDiskSelfNewer() {
  try {
    const disk = readFileSync(SELF_FILE, "utf8");
    const m = disk.match(/ADAPTER_VERSION\s*=\s*["'](\d+\.\d+\.\d+)["']/);
    if (!m || compareVersions(m[1], ADAPTER_VERSION) <= 0) return;
    selfUpdate.fromVersion = ADAPTER_VERSION;
    selfUpdate.latestVersion = m[1];
    selfUpdate.state = "updated-pending-restart";
    log(`[lf-agent] \u78C1\u76D8 mjs \u5DF2\u662F\u65B0\u7248 ${m[1]}\uFF08\u8FDB\u7A0B ${ADAPTER_VERSION}\uFF09\uFF0C\u91CD\u542F\u5BBF\u4E3B\u540E\u751F\u6548`);
  } catch {
  }
}
var skillsLatestLive = { at: 0, table: SKILLS_LATEST };
var skillsLatestRefreshing = null;
async function refreshSkillsLatestLive() {
  if (Date.now() - skillsLatestLive.at < 10 * 60 * 1e3) return skillsLatestLive.table;
  if (skillsLatestRefreshing) return skillsLatestRefreshing;
  skillsLatestRefreshing = (async () => {
    try {
      const fetched = await fetchRemoteText(`/leadsradar-agent.mjs`);
      const text = fetched?.text;
      const block = text && text.match(/const SKILLS_LATEST = \{[\s\S]*?\};/)?.[0];
      const table = {};
      if (block) for (const m of block.matchAll(/(\w+):\s*"([\d.]+)"/g)) table[m[1]] = m[2];
      if (SKILL_NAMES.every((k) => table[k])) {
        skillsLatestLive = { at: Date.now(), table };
        return table;
      }
    } catch {
    }
    skillsLatestLive = { at: Date.now(), table: skillsLatestLive.table };
    return skillsLatestLive.table;
  })().finally(() => {
    skillsLatestRefreshing = null;
  });
  return skillsLatestRefreshing;
}
async function fetchLatestSkillMd(name) {
  const fetched = await fetchRemoteText(`/skills/leadsradar-${name}/SKILL.md`);
  const text = fetched?.text;
  if (!text) return null;
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const version = m && m[1].match(/version:\s*["']?([\d.]+)/)?.[1] || null;
  return { content: text, version };
}
async function callTool(name, args) {
  if (typeof name === "string" && name && !name.startsWith("leadsradar_")) {
    name = `leadsradar_${name}`;
  }
  switch (name) {
    case "leadsradar_connection_status":
      void wakeLocalService();
      if (selfUpdate.state === "idle") void maybeSelfUpdate();
      checkDiskSelfNewer();
      void refreshSkillsLatestLive();
      return broker.statusSnapshot();
    case "leadsradar_search_notes": {
      const keyword = String(args.keyword || "").trim();
      if (!keyword) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 keyword" } };
      const platform = args.platform === "douyin" ? "douyin" : "xiaohongshu";
      return broker.startTask({
        mode: "search_results",
        platform,
        keyword,
        limit: capLimit(args.limit, 10),
        source: HOST,
        agentContext: { host: HOST }
      });
    }
    case "leadsradar_capture_profile": {
      const url = String(args.url || "").trim();
      if (!/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u6709\u6548\u7684\u535A\u4E3B\u4E3B\u9875 url" } };
      const deep = args.deep === true;
      return broker.startTask(
        {
          mode: "profile_posts",
          url,
          limit: deep ? capLimit(args.limit, 20, 50) : capLimit(args.limit, 20),
          ...deep ? { deep: true, comments_limit: capLimit(args.comments_limit, 50, 100) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        // ⭐R96cf 快扫版默认联动深扫（引擎读 local_scan_settings.deepComments 决定，默认开）：
        //   列表 ~60s + 深扫条数×45s；⭐R96dq 阴阳规则首扫一轮干满设置条数（≤50 条），50 条≈39min，
        //   引擎窗按 ruleLimit 动态计算（见 agent-tasks.ts deepTimeoutMs），此 broker 窗只是兜底
        //   （防引擎失联回执永不回），15min→45min 覆盖首扫最大值；纯快扫提前完成不受影响
        45 * 60 * 1e3
      );
    }
    case "leadsradar_capture_note_comments": {
      const url = String(args.url || "").trim();
      if (!/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u6709\u6548\u7684\u7B14\u8BB0 url" } };
      return broker.startTask({
        mode: "comments",
        url,
        limit: capLimit(args.limit, 30, MAX_COMMENT_LIMIT),
        source: HOST,
        agentContext: { host: HOST }
      });
    }
    case "leadsradar_note_detail": {
      const url = String(args.url || "").trim();
      if (!/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u6709\u6548\u7684\u7B14\u8BB0 url" } };
      return broker.startTask(
        { mode: "current_note", url, source: HOST, agentContext: { host: HOST } },
        NOTE_DETAIL_TIMEOUT_MS
      );
    }
    case "leadsradar_download_media": {
      const note = args.note && typeof args.note === "object" && !Array.isArray(args.note) ? args.note : null;
      const url = String(note && (note.note_url || note.url || note.share_url) || args.url || "").trim();
      if (!note && !/^https?:\/\//.test(url)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "\u9700\u63D0\u4F9B note \u5BF9\u8C61\uFF08\u91C7\u96C6\u8FD4\u56DE\u539F\u6837\u4F20\u56DE\uFF09\u6216 url \u53C2\u6570" } };
      }
      return broker.startTask(
        {
          mode: "download_media",
          ...note ? { note } : { url, platform: args.platform === "douyin" ? "douyin" : "xiaohongshu" },
          source: HOST,
          agentContext: { host: HOST }
        },
        6 * 60 * 1e3
        // ⭐r80 提取（后台开页刷新 ~15s）+ 大文件真实下载完成监听（5min 超时保护）
      );
    }
    case "leadsradar_extract_text": {
      const note = args.note && typeof args.note === "object" && !Array.isArray(args.note) ? args.note : null;
      const url = String(note && (note.note_url || note.url || note.share_url) || args.url || "").trim();
      if (!note && !/^https?:\/\//.test(url)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "\u9700\u63D0\u4F9B note \u5BF9\u8C61\uFF08\u91C7\u96C6\u8FD4\u56DE\u539F\u6837\u4F20\u56DE\uFF09\u6216 url \u53C2\u6570" } };
      }
      return broker.startTask(
        {
          mode: "extract_text",
          ...note ? { note } : { url },
          source: HOST,
          agentContext: { host: HOST }
        },
        21e4
        // ⭐R96ak 云端 ASR 转录轮询（90×2s）+ 提交余量
      );
    }
    case "leadsradar_note_deep_research": {
      const note = args.note && typeof args.note === "object" && !Array.isArray(args.note) ? args.note : null;
      const url = String(note && (note.note_url || note.url || note.share_url) || args.url || "").trim();
      if (!note && !/^https?:\/\//.test(url)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "\u9700\u63D0\u4F9B note \u5BF9\u8C61\uFF08\u91C7\u96C6\u8FD4\u56DE\u539F\u6837\u4F20\u56DE\uFF09\u6216 url \u53C2\u6570" } };
      }
      return broker.startTask(
        {
          mode: "note_deep",
          ...note ? { note } : { url },
          force: args.force === true,
          source: HOST,
          agentContext: { host: HOST }
        },
        3e5
        // ⭐R96at 缺口现采（scratch 三连 ~60s）+ 云端 job 同步等 180s + 余量；超时后插件后台续等完成自动回灌待领取（「栗子报告」）
      );
    }
    case "leadsradar_track_deep_research": {
      const keyword = String(args.keyword || "").trim();
      if (!keyword) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u8D5B\u9053\u5173\u952E\u8BCD keyword\uFF08\u5982\u300C\u8F85\u98DF\u300D\uFF09" } };
      const numOrUndef = (v) => Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : void 0;
      return broker.startTask(
        {
          mode: "track_deep",
          keyword,
          platform: args.platform === "douyin" ? "douyin" : "xiaohongshu",
          force: args.force === true,
          ...numOrUndef(args.sample_count) != null ? { sample_count: numOrUndef(args.sample_count) } : {},
          ...numOrUndef(args.top_deep) != null ? { top_deep: numOrUndef(args.top_deep) } : {},
          ...numOrUndef(args.comment_limit) != null ? { comment_limit: numOrUndef(args.comment_limit) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        3e5
        // ⭐R96bp draft 命中走 AI 需长等；无 draft 采集启动后秒回 pending，后台 15-30 分钟完成后 lateResultSink 回灌——「栗子报告」取报告
      );
    }
    case "leadsradar_account_deep_research": {
      const isSelf = args.perspective === "self";
      const url = String(args.url || "").trim();
      if (isSelf) {
        if (/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: "self \u590D\u76D8\u4E0D\u9700\u8981 url\u2014\u2014\u81EA\u52A8\u7528\u300C\u6211\u7684\u8D26\u53F7\u300D\u91CC\u7ED1\u5B9A\u7684\u8D26\u53F7\uFF1B\u8981\u7814\u7A76\u522B\u4EBA\u8BF7\u7528 competitor \u89C6\u89D2\u4F20 url" } };
      } else {
        if (!/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: '\u7F3A\u5C11\u535A\u4E3B\u4E3B\u9875 url\uFF08\u5C0F\u7EA2\u4E66 /user/profile/ \u6216\u6296\u97F3 /user/\uFF09\uFF1B\u590D\u76D8\u81EA\u5DF1\u7684\u8D26\u53F7\u8BF7\u4F20 perspective="self"' } };
      }
      return broker.startTask(
        {
          mode: "account_deep",
          ...url ? { url } : {},
          ...args.platform === "douyin" || args.platform === "xiaohongshu" ? { platform: args.platform } : {},
          ...isSelf ? { perspective: "self" } : {},
          ...isSelf && String(args.account_name || "").trim() ? { account_name: String(args.account_name).trim() } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        3e5
        // ⭐R96br 快路径装料+job 提交同步段；慢路径深采启动后秒回 pending，后台 6-25 分钟完成后 lateResultSink 回灌——「栗子报告」取报告
      );
    }
    case "leadsradar_save_topic": {
      const note = args.note;
      if (!note || typeof note !== "object" || Array.isArray(note) || !String(note.title || "").trim()) {
        return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 note \u5BF9\u8C61\uFF08\u987B\u542B title \u5B57\u6BB5\uFF0C\u6765\u81EA\u91C7\u96C6\u5DE5\u5177\u8FD4\u56DE\u7684\u7B14\u8BB0\u6570\u636E\uFF09" } };
      }
      return broker.startTask(
        { mode: "save_topic", note, remark: String(args.remark || ""), source: HOST, agentContext: { host: HOST } },
        3e4
      );
    }
    case "leadsradar_add_monitor": {
      const url = String(args.url || "").trim();
      if (!/^https?:\/\//.test(url)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u6709\u6548\u7684\u535A\u4E3B\u4E3B\u9875 url" } };
      return broker.startTask(
        { mode: "add_monitor", url, monitor: args.monitor === true, source: HOST, agentContext: { host: HOST } },
        3e4
      );
    }
    case "leadsradar_remove_benchmark": {
      const url = String(args.url || "").trim();
      const name2 = String(args.name || "").trim();
      const platform = String(args.platform || "").trim();
      if (!/^https?:\/\//.test(url) && !name2) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u8D26\u53F7\u5B9A\u4F4D\uFF1A\u9700\u8981\u4E3B\u9875 url \u6216\u8D26\u53F7\u540D name\uFF08\u81F3\u5C11\u5176\u4E00\uFF0C\u91CD\u540D\u65F6\u5E26 platform \u6D88\u6B67\uFF09" } };
      return broker.startTask(
        { mode: "remove_benchmark", url, name: name2, platform, source: HOST, agentContext: { host: HOST } },
        3e4
      );
    }
    case "leadsradar_pause_monitor": {
      const url = String(args.url || "").trim();
      const name2 = String(args.name || "").trim();
      const platform = String(args.platform || "").trim();
      if (!/^https?:\/\//.test(url) && !name2) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u8D26\u53F7\u5B9A\u4F4D\uFF1A\u9700\u8981\u4E3B\u9875 url \u6216\u8D26\u53F7\u540D name\uFF08\u81F3\u5C11\u5176\u4E00\uFF0C\u91CD\u540D\u65F6\u5E26 platform \u6D88\u6B67\uFF09" } };
      return broker.startTask(
        { mode: "pause_monitor", url, name: name2, platform, source: HOST, agentContext: { host: HOST } },
        3e4
      );
    }
    case "leadsradar_scan_settings": {
      const has = (v) => v !== void 0 && v !== null && String(v) !== "";
      return broker.startTask(
        {
          mode: "scan_settings",
          ...has(args.first) ? { first: Number(args.first) } : {},
          ...has(args.rescan) ? { rescan: Number(args.rescan) } : {},
          ...args.deepComments !== void 0 ? { deepComments: args.deepComments === true || args.deepComments === "true" } : {},
          ...has(args.deepCommentLimit) ? { deepCommentLimit: Number(args.deepCommentLimit) } : {},
          ...has(args.hitMode) ? { hitMode: String(args.hitMode) } : {},
          ...has(args.hitValue) ? { hitValue: Number(args.hitValue) } : {},
          ...has(args.observeHours) ? { observeHours: Number(args.observeHours) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        15e3
      );
    }
    case "leadsradar_pair_login": {
      return broker.startTask(
        { mode: "pair_login", source: HOST, agentContext: { host: HOST } },
        33e4
      );
    }
    case "leadsradar_get_daily_report": {
      return broker.startTask(
        { mode: "get_daily_report", source: HOST, agentContext: { host: HOST } },
        6e4
      );
    }
    case "leadsradar_dm_reply": {
      const commentText = String(args.comment_text || "").trim();
      if (!commentText) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 comment_text\uFF08\u8BC4\u8BBA\u539F\u6587\u5FC5\u586B\u2014\u2014\u79C1\u4FE1\u8981\u8D34\u7740\u5BF9\u65B9\u8BC4\u8BBA\u5199\uFF09" } };
      return broker.startTask(
        {
          mode: "dm_reply",
          comment_text: commentText.slice(0, 500),
          ...args.stage === "followup" ? { stage: "followup" } : {},
          ...args.commenter_name ? { commenter_name: String(args.commenter_name).slice(0, 100) } : {},
          ...args.note_title ? { note_title: String(args.note_title).slice(0, 200) } : {},
          platform: args.platform === "douyin" ? "douyin" : "xiaohongshu",
          ...args.intent_level ? { intent_level: String(args.intent_level) } : {},
          ...args.lead_id ? { lead_id: String(args.lead_id) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        9e4
      );
    }
    case "leadsradar_comment_reply": {
      const commentText = String(args.comment_text || "").trim();
      if (!commentText) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 comment_text\uFF08\u8BC4\u8BBA\u539F\u6587\u5FC5\u586B\u2014\u2014\u56DE\u8BC4\u8981\u8D34\u7740\u5BF9\u65B9\u8BC4\u8BBA\u5199\uFF09" } };
      return broker.startTask(
        {
          mode: "comment_reply",
          comment_text: commentText.slice(0, 500),
          ...args.note_title ? { note_title: String(args.note_title).slice(0, 200) } : {},
          ...args.commenter_name ? { commenter_name: String(args.commenter_name).slice(0, 100) } : {},
          ...args.intent_level ? { intent_level: String(args.intent_level) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        9e4
      );
    }
    case "leadsradar_send_reply": {
      const noteUrl = String(args.note_url || "").trim();
      const commenterName = String(args.commenter_name || "").trim();
      const commentText = String(args.comment_text || "").trim();
      const replyText = String(args.reply_text || "").trim();
      if (!/^https?:\/\//.test(noteUrl)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u6709\u6548\u7684\u4F5C\u54C1\u94FE\u63A5 note_url" } };
      if (!commenterName || !commentText || !replyText) {
        return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 commenter_name / comment_text\uFF08\u5BF9\u65B9\u8BC4\u8BBA\u539F\u6587\uFF09/ reply_text\uFF08\u786E\u8BA4\u8FC7\u7684\u6210\u7A3F\uFF09\u2014\u2014\u4E09\u9879\u5FC5\u586B" } };
      }
      return broker.startTask(
        {
          mode: "send_reply",
          note_url: noteUrl,
          commenter_name: commenterName.slice(0, 100),
          comment_text: commentText.slice(0, 500),
          reply_text: replyText.slice(0, 1e3),
          ...args.comment_id ? { comment_id: String(args.comment_id).slice(0, 64) } : {},
          ...args.author_id ? { author_id: String(args.author_id).slice(0, 64) } : {},
          ...args.platform === "douyin" || args.platform === "xiaohongshu" ? { platform: args.platform } : {},
          ...args.note_title ? { note_title: String(args.note_title).slice(0, 200) } : {},
          ...args.intent_level ? { intent_level: String(args.intent_level) } : {},
          ...args.lead_id ? { lead_id: String(args.lead_id) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        12e4
      );
    }
    case "leadsradar_send_dm": {
      const authorUrl = String(args.author_url || "").trim();
      const dmText = String(args.dm_text || "").trim();
      if (!/^https?:\/\//.test(authorUrl)) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11\u8BC4\u8BBA\u8005\u4E3B\u9875\u94FE\u63A5 author_url\uFF08\u53D6\u91C7\u96C6\u56DE\u6267\u8BC4\u8BBA\u6761\u76EE\u7684 author_url \u5B57\u6BB5\uFF09" } };
      if (!dmText) return { ok: false, error: { code: "BAD_ARGS", message: "\u7F3A\u5C11 dm_text\uFF08\u7528\u6237\u786E\u8BA4\u8FC7\u7684\u79C1\u4FE1\u6210\u7A3F\uFF09" } };
      return broker.startTask(
        {
          mode: "send_dm",
          author_url: authorUrl,
          dm_text: dmText.slice(0, 1e3),
          ...args.author_name ? { author_name: String(args.author_name).slice(0, 100) } : {},
          ...args.platform === "douyin" || args.platform === "xiaohongshu" ? { platform: args.platform } : {},
          ...args.comment_text ? { comment_text: String(args.comment_text).slice(0, 500) } : {},
          ...args.note_title ? { note_title: String(args.note_title).slice(0, 200) } : {},
          ...args.intent_level ? { intent_level: String(args.intent_level) } : {},
          ...args.lead_id ? { lead_id: String(args.lead_id) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        12e4
      );
    }
    case "leadsradar_touch_tasks": {
      const limitRaw = Number(args.limit);
      return broker.startTask(
        {
          mode: "touch_tasks",
          ...Number.isFinite(limitRaw) && limitRaw >= 1 ? { limit: Math.min(20, Math.floor(limitRaw)) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        36e5
      );
    }
    case "leadsradar_touch_settings": {
      const action = String(args.action || "get") === "set" ? "set" : "get";
      const setFields = [
        "fixed_reply",
        "fixed_dm",
        "reply_requirements",
        "dm_requirements",
        "reply_length",
        "dm_length",
        "use_deal_doc_reply",
        "use_deal_doc_dm",
        "use_persona_doc_reply",
        "use_persona_doc_dm",
        "use_deal_doc",
        "use_persona_doc"
      ];
      if (action === "set" && !setFields.some((k) => args[k] !== void 0)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "set \u9700\u81F3\u5C11\u4F20\u4E00\u4E2A\u8981\u6539\u7684\u5B57\u6BB5\uFF08fixed_reply/fixed_dm/reply_requirements/dm_requirements/reply_length/dm_length/use_deal_doc_reply/use_deal_doc_dm/use_persona_doc_reply/use_persona_doc_dm\uFF09" } };
      }
      return broker.startTask(
        {
          mode: "touch_settings",
          action,
          ...action === "set" ? {
            ...args.fixed_reply !== void 0 ? { fixed_reply: String(args.fixed_reply).slice(0, 500) } : {},
            ...args.fixed_dm !== void 0 ? { fixed_dm: String(args.fixed_dm).slice(0, 500) } : {},
            ...args.reply_requirements !== void 0 ? { reply_requirements: String(args.reply_requirements).slice(0, 300) } : {},
            ...args.dm_requirements !== void 0 ? { dm_requirements: String(args.dm_requirements).slice(0, 300) } : {},
            ...args.reply_length !== void 0 ? { reply_length: String(args.reply_length).slice(0, 3) } : {},
            ...args.dm_length !== void 0 ? { dm_length: String(args.dm_length).slice(0, 3) } : {},
            ...args.use_deal_doc_reply !== void 0 ? { use_deal_doc_reply: Boolean(args.use_deal_doc_reply) } : {},
            ...args.use_deal_doc_dm !== void 0 ? { use_deal_doc_dm: Boolean(args.use_deal_doc_dm) } : {},
            ...args.use_persona_doc_reply !== void 0 ? { use_persona_doc_reply: Boolean(args.use_persona_doc_reply) } : {},
            ...args.use_persona_doc_dm !== void 0 ? { use_persona_doc_dm: Boolean(args.use_persona_doc_dm) } : {},
            ...args.use_deal_doc !== void 0 ? { use_deal_doc: Boolean(args.use_deal_doc) } : {},
            ...args.use_persona_doc !== void 0 ? { use_persona_doc: Boolean(args.use_persona_doc) } : {}
          } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        15e3
      );
    }
    case "leadsradar_mark_lead": {
      const action = String(args.action || "mark_replied");
      if (!["mark_replied", "mark_converted", "mark_lost", "reopen"].includes(action)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "action \u987B\u4E3A mark_replied / mark_converted / mark_lost / reopen" } };
      }
      return broker.startTask(
        {
          mode: "mark_lead",
          action,
          ...args.lead_id ? { lead_id: String(args.lead_id) } : {},
          ...args.text ? { text: String(args.text).slice(0, 500) } : {},
          ...args.comment_text ? { comment_text: String(args.comment_text).slice(0, 500) } : {},
          ...args.commenter_name ? { commenter_name: String(args.commenter_name).slice(0, 100) } : {},
          ...args.note_title ? { note_title: String(args.note_title).slice(0, 200) } : {},
          platform: args.platform === "douyin" ? "douyin" : "xiaohongshu",
          ...args.intent_level ? { intent_level: String(args.intent_level) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        45e3
      );
    }
    case "leadsradar_lead_records": {
      return broker.startTask(
        {
          mode: "lead_records",
          ...args.status ? { status: String(args.status) } : {},
          ...args.source === "own" ? { lead_source: "own" } : {},
          ...args.limit ? { limit: Math.min(Math.max(Math.floor(Number(args.limit)) || 50, 1), 200) } : {},
          source: HOST,
          agentContext: { host: HOST }
        },
        45e3
      );
    }
    // ⭐R96ew 平台登录账号现核（closer 1.4.10「回复账号 ⭐已核」数据源）：查已打开的小红书/抖音页读
    //   当前登录账号——零采集不占风控限额（工具型任务秒回，10s 超时足够）
    case "leadsradar_whoami": {
      return broker.startTask(
        {
          mode: "whoami",
          openUrl: typeof args?.open_url === "string" ? args.open_url : void 0,
          source: HOST,
          agentContext: { host: HOST }
        },
        15e3
      );
    }
    case "leadsradar_query_local_data": {
      const querySource = String(args.source || "");
      if (!["works", "notes", "accounts", "comments", "reports"].includes(querySource)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "source \u987B\u4E3A works / notes / accounts / comments / reports" } };
      }
      if (querySource === "comments" && !/^https?:\/\//.test(String(args.note_url || ""))) {
        return { ok: false, error: { code: "BAD_ARGS", message: "source=comments \u9700\u63D0\u4F9B\u6709\u6548\u7684\u7B14\u8BB0 note_url" } };
      }
      const limit = Math.min(Math.max(Math.floor(Number(args.limit) || 50), 1), 200);
      const platform = args.platform === "douyin" ? "douyin" : args.platform === "xiaohongshu" ? "xiaohongshu" : "";
      return broker.startTask(
        {
          mode: "query_local_data",
          querySource,
          keyword: String(args.keyword || "").trim(),
          platform,
          noteUrl: String(args.note_url || "").trim(),
          limit,
          source: HOST,
          agentContext: { host: HOST }
        },
        3e4
      );
    }
    case "leadsradar_claim_pending_result": {
      const claimTaskId = String(args.taskId || "").trim();
      return broker.startTask(
        {
          mode: "claim_pending_result",
          ...claimTaskId ? { claimTaskId } : { claimAll: true },
          source: HOST,
          agentContext: { host: HOST }
        },
        3e4
      );
    }
    case "leadsradar_get_latest_skills": {
      const skillName = String(args.name || "").trim();
      if (!skillName) {
        await refreshSkillsLatestLive();
        return {
          ok: true,
          note: "\u4F20 name\uFF08radar/insights/creator/closer/helper\uFF09\u53D6\u8BE5\u6280\u80FD\u6700\u65B0 SKILL.md \u5168\u6587\uFF1A\u5BBF\u4E3B\u6709\u5199\u6587\u4EF6\u80FD\u529B\uFF08coding \u5BBF\u4E3B\uFF09\u76F4\u63A5\u628A content \u5199\u5165\u8BE5\u6280\u80FD SKILL.md \u539F\u8DEF\u5F84\u8986\u76D6\u5373\u81EA\u52A8\u66F4\u65B0\uFF1B\u7EAF\u5BF9\u8BDD\u5BBF\u4E3B\u5C55\u793A\u7ED9\u7528\u6237\u6574\u4F53\u590D\u5236\u6309\u5BBF\u4E3B\u6280\u80FD\u5B89\u88C5\u65B9\u5F0F\u8986\u76D6\u3002",
          skills_latest: skillsLatestLive.table,
          adapter_update: selfUpdate.state
        };
      }
      if (!SKILL_NAMES.includes(skillName)) {
        return { ok: false, error: { code: "BAD_ARGS", message: "name \u987B\u4E3A radar / insights / creator / closer / helper" } };
      }
      const md = await fetchLatestSkillMd(skillName);
      if (!md) {
        return { ok: false, error: { code: "FETCH_FAILED", message: `\u4E91\u7AEF\u62C9\u53D6 leadsradar-${skillName} SKILL.md \u5931\u8D25\uFF08unpkg \u4E0E jsdelivr \u53CC\u6E90\u5747\u672A\u547D\u4E2D\u2014\u2014npm \u53EF\u80FD\u5C1A\u672A\u53D1\u5E03\u65B0\u7248\uFF09\u2014\u2014\u7A0D\u540E\u518D\u8BD5\uFF0C\u6216\u53BB\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u91CD\u65B0\u4E0B\u8F7D\u6280\u80FD\u6587\u4EF6` } };
      }
      return {
        ok: true,
        name: skillName,
        version: md.version,
        latestKnown: skillsLatestLive.table[skillName] || null,
        // ⭐R96g1be 表源同 CDN 缓存
        content: md.content,
        note: `\u4EE5\u4E0A\u662F leadsradar-${skillName} SKILL.md \u5168\u6587\uFF08frontmatter version=${md.version || "?"}\uFF09\u2014\u2014\u4F60\u6709\u5199\u6587\u4EF6\u80FD\u529B\uFF08coding \u5BBF\u4E3B\uFF09\u5C31\u628A content \u5168\u6587\u5199\u5165\u8BE5\u6280\u80FD SKILL.md \u539F\u8DEF\u5F84\u8986\u76D6\uFF08\u5373\u5F53\u521D\u5B89\u88C5\u65F6\u5199\u7684\u6587\u4EF6\uFF09\uFF0C\u5199\u5B8C\u62A5\u300C\u5DF2\u81EA\u52A8\u66F4\u65B0\u5230 v${md.version || "?"}\u300D\uFF1B\u7EAF\u5BF9\u8BDD\u5BBF\u4E3B\u624D\u628A\u5185\u5BB9\u5C55\u793A\u7ED9\u7528\u6237\u6574\u4F53\u590D\u5236\u3001\u6309\u5BBF\u4E3B\u6280\u80FD\u5B89\u88C5\u65B9\u5F0F\u8986\u76D6\u3002`
      };
    }
    default:
      return { ok: false, error: { code: "UNKNOWN_TOOL", message: `\u672A\u77E5\u5DE5\u5177 ${name}` } };
  }
}
var MCP_PROTOCOL_VERSION = "2025-03-26";
function writeRpc(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}
async function dispatchRpc(req) {
  if (req.id === void 0 || req.id === null) return null;
  const { method, params = {} } = req;
  switch (method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id: req.id,
        result: {
          protocolVersion: params.protocolVersion || MCP_PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: "leadsradar-agent-adapter", version: ADAPTER_VERSION, title: "\u63A2\u6817MCP" },
          instructions: MCP_INSTRUCTIONS
          // ⭐r82 呈现规范随 initialize 注入宿主系统提示
        }
      };
    case "ping":
      return { jsonrpc: "2.0", id: req.id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id: req.id, result: { tools: TOOLS } };
    case "tools/call": {
      const name = String(params.name || "");
      const args = params.arguments || {};
      let response;
      try {
        response = await callTool(name, args);
      } catch (err) {
        response = { ok: false, error: { code: "TOOL_CRASH", message: String(err?.message || err) } };
      }
      return {
        jsonrpc: "2.0",
        id: req.id,
        result: {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          isError: response && response.ok === false
        }
      };
    }
    case "resources/list":
      return { jsonrpc: "2.0", id: req.id, result: { resources: [] } };
    case "prompts/list":
      return { jsonrpc: "2.0", id: req.id, result: { prompts: [] } };
    default:
      return { jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `method not found: ${method}` } };
  }
}
var httpServer = null;
if (!HTTP_MODE) {
  const rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    const text = line.trim();
    if (!text) return;
    let req;
    try {
      req = JSON.parse(text);
    } catch {
      return;
    }
    Promise.resolve(dispatchRpc(req)).then((resp) => {
      if (resp) writeRpc(resp);
    });
  });
  log(`[lf-agent] MCP STDIO server \u5DF2\u542F\u52A8\uFF08host=${HOST} device="${DEVICE_NAME}"\uFF09`);
} else {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id",
    "Access-Control-Expose-Headers": "mcp-session-id",
    "Access-Control-Max-Age": "86400"
  };
  httpServer = createHttpServer((req, res) => {
    const url = (req.url || "").split("?")[0];
    if (url !== "/mcp" && url !== "/") {
      res.writeHead(404, CORS_HEADERS);
      res.end();
      return;
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }
    if (req.method !== "POST") {
      res.writeHead(405, { ...CORS_HEADERS, Allow: "POST, OPTIONS" });
      res.end("method not supported");
      return;
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }));
        return;
      }
      Promise.resolve(dispatchRpc(body)).then((resp) => {
        if (!resp) {
          res.writeHead(202, CORS_HEADERS);
          res.end();
          return;
        }
        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify(resp));
      });
    });
  });
  httpServer.listen(HTTP_PORT, "127.0.0.1", () => {
    log(`[lf-agent] MCP HTTP server \u5DF2\u542F\u52A8 http://127.0.0.1:${HTTP_PORT}/mcp\uFF08host=${HOST} device="${DEVICE_NAME}"\uFF0CStreamable HTTP stateless\uFF1APOST \u5373\u7B54\uFF0C\u65E0\u4F1A\u8BDD\u65E0\u63A8\u9001\uFF09`);
  });
  httpServer.on("error", (err) => {
    log(`[lf-agent] HTTP \u7AEF\u53E3 ${HTTP_PORT} \u542F\u52A8\u5931\u8D25\uFF1A${err?.code || err?.message || err}\u2014\u2014\u82E5\u5DF2\u6709\u4E00\u4E2A\u5B9E\u4F8B\u5728\u8DD1\uFF0C\u5B83\u4ECD\u5728\u6B63\u5E38\u670D\u52A1\uFF08\u6263\u5B50\u8FDE\u7684\u5C31\u662F\u5B83\uFF09\uFF0C\u65E0\u9700\u91CD\u590D\u542F\u52A8\uFF1B\u786E\u9700\u6539\u7AEF\u53E3\u7528 LEADSRADAR_AGENT_HTTP_PORT\u3002\u672C\u8FDB\u7A0B\u9000\u51FA\u3002`);
    process.exit(1);
  });
}
log(`[lf-agent] \u5DE5\u5177\uFF1A${TOOLS.map((t) => t.name).join(", ")}`);
void maybeSelfUpdate();
process.on("exit", () => {
  try {
    broker.wss.close();
  } catch {
  }
  try {
    if (httpServer) httpServer.close();
  } catch {
  }
});
