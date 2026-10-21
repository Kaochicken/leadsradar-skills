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
import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync, unlinkSync } from "node:fs";
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
var ADAPTER_VERSION = "1.2.19";
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
      return `\u5DF2\u6309\u63A2\u6817 MCP \u8BBE\u7F6E\u56FA\u5B9A ${pref === "edge" ? "Edge" : "Chrome"} \u4E3A\u9ED8\u8BA4\u6D4F\u89C8\u5668\u2014\u2014\u8FD0\u884C ${cmd2} \u6253\u5F00\u5B83\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5`;
    }
  }
  const cmd = found.map((f) => `start ${f.browser} '-profile-directory="${f.profile}"'`).join(" \u6216 ");
  return `\u5DF2\u63A2\u6D4B\u5230\u63D2\u4EF6\u88C5\u5728 ${found.map((f) => `${f.browser === "msedge" ? "Edge" : "Chrome"} \u7684 ${f.profile}`).join(" \u548C ")}\u2014\u2014\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\uFF0C\u8FD0\u884C ${cmd} \u6253\u5F00\u5BF9\u5E94\u7A97\u53E3\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u81EA\u52A8\u91CD\u8FDE\u540E\u91CD\u8BD5`;
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
    const attach = (server) => {
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
            server.close();
          } catch {
          }
          setTimeout(() => {
            if (!this.relay) tryListen();
          }, 3e3);
        } else {
          log(`[lf-agent] Broker error: ${err?.message}`);
        }
      });
    };
    const tryListen = () => {
      if (this.relay) return;
      listenAttempts += 1;
      const server = new import_websocket_server.default({ host: "127.0.0.1", port: PORT, path: "/extension" }, () => {
        listenAttempts = 0;
        this.portBound = true;
        this.portBlocked = false;
        this.wss = server;
        log(`[lf-agent] Broker \u5DF2\u76D1\u542C ws://127.0.0.1:${PORT}/extension`);
        log(`[lf-agent] \u8BBE\u5907\u300C${DEVICE_NAME}\u300D\u6307\u7EB9\uFF1A${fingerprint}`);
        log(`[lf-agent] \u7B49\u5F85\u63D2\u4EF6\u8FDE\u63A5\uFF08\u63D2\u4EF6 \u2192 \u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u6253\u5F00\u5F00\u5173\uFF09\u2026`);
      });
      attach(server);
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
        // ⭐R56 卫星挂入即推一次当前插件状态（含登录态）——否则插件一直在线无状态变化时，卫星要等到下次断/连才拿得到 account
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
            account: msg.account ? { loggedIn: msg.account.loggedIn === true, nickname: String(msg.account.nickname || "") || null } : this.extension.account || null
          };
          log(`[lf-agent] \u5DF2\u8FDE\u63A5\u63D2\u4EF6 ${this.extension.extensionId} v${this.extension.extensionVersion}`);
          this.notifyDownstreamsExtension(true);
          return;
        }
        case "extension.account.update": {
          if (msg.account) {
            this.extension = {
              ...this.extension,
              account: {
                loggedIn: msg.account.loggedIn === true,
                nickname: String(msg.account.nickname || "") || null
              }
            };
            log(`[lf-agent] \u767B\u5F55\u6001\u66F4\u65B0\uFF1A${msg.account.loggedIn === true ? `\u5DF2\u767B\u5F55\uFF08${msg.account.nickname || "?"}\uFF09` : "\u672A\u767B\u5F55"}`);
            // ⭐R56 登录态变化实时转发卫星（幂等重推 connected/pendingResults 无副作用）
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
          this.lastProgress.set(String(msg.taskId), p);
          log(`[lf-agent] \u8FDB\u5EA6 ${msg.taskId} ${p.status ?? ""}${p.stage ? "/" + p.stage : ""} ${p.message ?? ""}` + (p.processedCount != null ? ` (${p.processedCount}/${p.totalCount ?? "?"})` : ""));
          return;
        }
        case "task.result": {
          this.send({ type: "task.result.ack", taskId: msg.taskId, deviceId: msg.deviceId });
          const dsResult = this.downstreams.get(String(msg.deviceId || ""));
          if (dsResult) {
            try {
              dsResult.ws.send(JSON.stringify({ type: "device.task.result", taskId: msg.taskId, response: msg.response }));
            } catch {
            }
            return;
          }
          this.finishTask(String(msg.taskId), msg.response);
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
          this.send({ type: "task.result.ack", taskId: msg.taskId, deviceId: msg.deviceId });
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
            this.finishTask(String(msg.taskId), parsed.response);
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
  /** 主 Broker 发给卫星的消息处理（挑战签名 / 任务结果 / 插件状态） */
  handleRelayMessage(msg) {
    const relay = this.relay;
    if (!relay) return;
    switch (msg.type) {
      case "device.extension.state":
        relay.extensionConnected = msg.connected === true;
        if (Array.isArray(msg.pendingResults)) {
          this.extension = { ...this.extension, pendingResults: msg.pendingResults.slice(0, 10), pendingResultCount: msg.pendingResults.length };
        }
        // ⭐R56 登录态随中转状态到达（对齐 extension.hello 消费范式；旧主 Broker 不带此字段=保留上次值防清丢）
        if (msg.account) {
          this.extension = { ...this.extension, account: { loggedIn: msg.account.loggedIn === true, nickname: String(msg.account.nickname || "") || null } };
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
        const p = msg.progress || {};
        this.lastProgress.set(String(msg.taskId), p);
        log(`[lf-agent] \u8FDB\u5EA6\uFF08\u4E2D\u8F6C\uFF09${msg.taskId} ${p.status ?? ""}${p.stage ? "/" + p.stage : ""} ${p.message ?? ""}` + (p.processedCount != null ? ` (${p.processedCount}/${p.totalCount ?? "?"})` : ""));
        return;
      }
      case "device.task.result":
        this.finishTask(String(msg.taskId), msg.response);
        return;
      case "device.task.result.start":
        this.transfers.set(String(msg.transferId), {
          taskId: String(msg.taskId),
          charLength: Number(msg.charLength) || 0,
          chunks: /* @__PURE__ */ new Map()
        });
        return;
      case "device.task.result.chunk": {
        const bucket = this.transfers.get(String(msg.transferId));
        if (bucket) bucket.chunks.set(Number(msg.index), String(msg.data ?? ""));
        return;
      }
      case "device.task.result.end": {
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
    if (!waiter) return;
    this.taskWaiters.delete(taskId);
    this.lastProgress.delete(taskId);
    clearTimeout(waiter.timer);
    waiter.response = response;
    waiter.resolve(response);
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
          message: this.awaitingPairing ? "\u63D2\u4EF6\u5DF2\u68C0\u6D4B\u5230\u672C\u8BBE\u5907\uFF0C\u4F46\u5C1A\u672A\u6279\u51C6\u914D\u5BF9\u3002\u8BF7\u8BA9\u7528\u6237\u5728\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u4E2D\u6838\u5BF9\u8BBE\u5907\u6307\u7EB9\u5E76\u70B9\u51FB\u6279\u51C6\uFF0C\u7136\u540E\u91CD\u8BD5\u3002" : diag ? `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\uFF08LeadsRadar\uFF09\u6D4F\u89C8\u5668\u63D2\u4EF6\u3002${diag}\u3002` : `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\uFF08LeadsRadar\uFF09\u6D4F\u89C8\u5668\u63D2\u4EF6\u3002${extensionLaunchHint() || "\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\uFF0C\u53EF\u76F4\u63A5\u8FD0\u884C start chrome\uFF08\u6216 start msedge\uFF09\u6253\u5F00\u6D4F\u89C8\u5668\uFF0C\u63D2\u4EF6\u4F1A\u81EA\u52A8\u91CD\u8FDE\uFF08\u7EA6\u7B49 5 \u79D2\u518D\u91CD\u8BD5\uFF09"}\uFF1B\u5426\u5219\u8BF7\u8BA9\u7528\u6237\uFF1A1) \u6253\u5F00\u6D4F\u89C8\u5668\u5E76\u786E\u8BA4\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\uFF1B2) \u63D2\u4EF6\u8BBE\u7F6E\u9875 \u2192\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u2192 \u5F00\u542F\u9876\u90E8\u5F00\u5173\uFF0C\u7136\u540E\u91CD\u8BD5\u3002`
        }
      });
    }
    const taskId = `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.taskWaiters.delete(taskId);
        resolve({
          ok: false,
          error: {
            code: "TASK_TIMEOUT",
            message: `\u4EFB\u52A1\u8D85\u65F6\uFF08${Math.round(timeoutMs / 1e3)}s\uFF09\u3002\u6CE8\u610F\uFF1A\u63D2\u4EF6\u53EF\u80FD\u4ECD\u5728\u6267\u884C\uFF0C\u4E14\u91C7\u96C6\u6570\u636E\u4F1A\u5148\u843D\u63A2\u6817\u672C\u5730\u5E93\u2014\u2014\u8BF7\u5148\u7528 query_local_data \u67E5\u8BE2\u8BE5\u4EFB\u52A1\u7684 keyword/url \u5BF9\u5E94\u7ED3\u679C\uFF0C\u67E5\u5230\u5C31\u76F4\u63A5\u7528\u3001\u4E0D\u8981\u91CD\u53D1\uFF1B\u786E\u5B9E\u6CA1\u6709\u518D\u91CD\u53D1\u4EFB\u52A1\uFF08\u907F\u514D\u91CD\u590D\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\u3002`
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
          message: this.awaitingPairing ? `\u63D2\u4EF6\u5DF2\u68C0\u6D4B\u5230\u672C\u8BBE\u5907\uFF08\u536B\u661F\u6A21\u5F0F\uFF09\uFF0C\u4F46\u5C1A\u672A\u6279\u51C6\u914D\u5BF9\u3002\u8BF7\u8BA9\u7528\u6237\u5728\u63D2\u4EF6\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u4E2D\u6838\u5BF9\u8BBE\u5907\u6307\u7EB9\u5E76\u70B9\u51FB\u6279\u51C6\uFF0C\u7136\u540E\u91CD\u8BD5\u3002\u6307\u7EB9\uFF1A${fingerprint}` : diag ? `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\u63D2\u4EF6\uFF08\u591A\u5BBF\u4E3B\u4E2D\u8F6C\u6A21\u5F0F\uFF09\u3002${diag}\u3002` : `\u672A\u8FDE\u63A5\u5230\u63A2\u6817\u63D2\u4EF6\u3002\u5F53\u524D\u4E3A\u591A\u5BBF\u4E3B\u4E2D\u8F6C\u6A21\u5F0F\uFF08\u7AEF\u53E3\u88AB ${relay?.hostLabel || "\u53E6\u4E00\u5BBF\u4E3B"} \u7684\u9002\u914D\u5668\u5360\u7528\uFF0C\u672C\u8BBE\u5907\u7ECF\u5176\u4E2D\u8F6C\uFF09\u3002${extensionLaunchHint() || "\u8BF7\u8BA9\u7528\u6237\uFF1A1) \u786E\u8BA4\u6D4F\u89C8\u5668\u5DF2\u6253\u5F00\u4E14\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\uFF1B2) \u63D2\u4EF6\u8BBE\u7F6E\u9875 \u2192\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u2192 \u5F00\u542F\u9876\u90E8\u5F00\u5173"}\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u91CD\u8BD5\u4E00\u6B21\u3002`
        }
      });
    }
    const taskId = `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.taskWaiters.delete(taskId);
        resolve({
          ok: false,
          error: {
            code: "TASK_TIMEOUT",
            message: `\u4EFB\u52A1\u8D85\u65F6\uFF08${Math.round(timeoutMs / 1e3)}s\uFF0C\u7ECF\u4E3B Broker \u4E2D\u8F6C\uFF09\u3002\u6CE8\u610F\uFF1A\u63D2\u4EF6\u53EF\u80FD\u4ECD\u5728\u6267\u884C\uFF0C\u4E14\u91C7\u96C6\u6570\u636E\u4F1A\u5148\u843D\u63A2\u6817\u672C\u5730\u5E93\u2014\u2014\u8BF7\u5148\u7528 query_local_data \u67E5\u8BE2\u8BE5\u4EFB\u52A1\u7684 keyword/url \u5BF9\u5E94\u7ED3\u679C\uFF0C\u67E5\u5230\u5C31\u76F4\u63A5\u7528\u3001\u4E0D\u8981\u91CD\u53D1\uFF1B\u786E\u5B9E\u6CA1\u6709\u518D\u91CD\u53D1\u4EFB\u52A1\uFF08\u907F\u514D\u91CD\u590D\u6D88\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\u3002`
          }
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
        relayThrough: this.relay?.hostLabel || this.relay?.host || null
      },
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
        account: this.extension.account || { loggedIn: null, nickname: null }
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
          hint: step === 3 ? `\u5DF2\u8FDE\u63A5\uFF08\u591A\u5BBF\u4E3B\u4E2D\u8F6C\u6A21\u5F0F\uFF1A\u7ECF\u300C${this.relay.hostLabel || this.relay.host}\u300D\u7684\u8FDE\u63A5\u5668\u5171\u4EAB\u63D2\u4EF6\u8FDE\u63A5\uFF0C\u8C46\u5305\u5DE5\u4F5C/WorkBuddy \u53EF\u540C\u65F6\u5728\u7EBF\uFF09\uFF0C\u53EF\u4EE5\u5F00\u59CB\u91C7\u96C6\u4EFB\u52A1\u3002${this.pendingResultsHint()}` : step === 2 ? `\u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF08\u536B\u661F\u6A21\u5F0F\uFF0C\u7ECF\u300C${this.relay.hostLabel || this.relay.host}\u300D\u4E2D\u8F6C\uFF09\uFF1A\u628A adapter.fingerprint \u539F\u6837\u8F6C\u544A\u7528\u6237\uFF0C\u8BF7\u5176\u5230\u63D2\u4EF6\u8BBE\u7F6E\u9875\u786E\u8BA4\u662F\u81EA\u5DF1\u7684\u8BBE\u5907\u540E\u70B9\u300C\u6279\u51C6\u300D\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\uFF08\u6CE8\u610F\uFF1A\u6279\u51C6\u524D\u4EFB\u52A1\u4F1A\u88AB\u62D2\u7EDD\uFF0C\u522B\u6025\u7740\u5F00\u5DE5\uFF09\u3002` : `\u4E2D\u8F6C\u6A21\u5F0F\u7B49\u5F85\u63D2\u4EF6\uFF1A\u8BF7\u8BA9\u7528\u6237\u6253\u5F00\u6D4F\u89C8\u5668\u786E\u8BA4\u63A2\u6817\u63D2\u4EF6\u5DF2\u542F\u7528\u3001\u8BBE\u7F6E\u9875\u300C\u667A\u80FD\u4F53\u8FDE\u63A5\u300D\u5F00\u5173\u5DF2\u6253\u5F00\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002`
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
        hint: this.portBlocked ? `\u9002\u914D\u5668\u7AEF\u53E3 ${PORT} \u88AB Windows \u52A8\u6001\u7AEF\u53E3\u4FDD\u7559\uFF08Hyper-V/WSL \u6392\u9664\u6BB5\uFF09\u6321\u4F4F\uFF1Abind \u88AB\u62D2\u4F46\u65E0\u8FDB\u7A0B\u5360\u7528\uFF0C\u901A\u5E38\u51E0\u5341\u5206\u949F\u5185\u81EA\u52A8\u6062\u590D\uFF0C\u9002\u914D\u5668\u5728\u6301\u7EED\u91CD\u8BD5\u3002\u8BF7\u628A\u8FD9\u6761\u6839\u6CBB\u547D\u4EE4\u8F6C\u544A\u7528\u6237\uFF08\u7BA1\u7406\u5458 PowerShell \u8FD0\u884C\u4E00\u6B21\u6C38\u4E45\u751F\u6548\uFF09\uFF1Anet stop winnat ; netsh int ipv4 add excludedportrange protocol=tcp startport=${PORT} numberofports=1 ; net start winnat\uFF08\u8FD0\u884C\u5B8C\u91CD\u542F\u672C\u4F1A\u8BDD\u5373\u8FDE\u4E0A\uFF09\u3002\u8F6C\u544A\u540E\u6BCF 30 \u79D2\u590D\u67E5\u4E00\u6B21\u3002` : !this.portBound ? `\u672C\u9002\u914D\u5668\u7684\u672C\u673A\u7AEF\u53E3 ${PORT} \u6B63\u5728\u88AB\u5360\u7528\u4E14\u5C1A\u672A\u5B8C\u6210\u4E2D\u8F6C\u534F\u5546\uFF08\u6B63\u5728\u81EA\u52A8\u5904\u7406\uFF1A\u540C\u5BBF\u4E3B\u5B64\u513F\u4F1A\u88AB\u63A5\u7BA1\uFF0C\u5F02\u5BBF\u4E3B\u4F1A\u81EA\u52A8\u8F6C\u5165\u4E2D\u8F6C\u5171\u5B58\uFF09\u3002\u8BF7\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\uFF1B\u82E5\u8D85\u8FC7 1 \u5206\u949F\u4ECD\u505C\u7559\u5728\u6B64\u72B6\u6001\uFF0C\u8BF7\u7528\u6237\u5B8C\u5168\u9000\u51FA\u6240\u6709 AI \u52A9\u624B\uFF08\u542B\u6258\u76D8\uFF09\u540E\u91CD\u5F00\u3002` : step === 1 ? `\u63D2\u4EF6\u672A\u8FDE\u63A5\uFF1A${this.disconnectDiagnosis() || extensionLaunchHint() || "\u82E5\u4F60\u6709\u7EC8\u7AEF\u6743\u9650\u53EF\u8FD0\u884C start chrome\uFF08\u6216 start msedge\uFF09\u6253\u5F00\u6D4F\u89C8\u5668\uFF0C\u63D2\u4EF6\u7EA6 5 \u79D2\u5185\u81EA\u52A8\u91CD\u8FDE"}\uFF1B\u5426\u5219\u8BF7\u7528\u6237\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u63A2\u6817\u63D2\u4EF6 \u2192 \u8BBE\u7F6E \u2192 \u667A\u80FD\u4F53\u8FDE\u63A5 \u2192 \u6253\u5F00\u9876\u90E8\u5F00\u5173\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002` : step === 2 ? `\u7B49\u5F85\u7528\u6237\u6279\u51C6\u914D\u5BF9\uFF1A\u628A adapter.fingerprint \u539F\u6837\u8F6C\u544A\u7528\u6237\uFF0C\u8BF7\u5176\u5230\u63D2\u4EF6\u8BBE\u7F6E\u9875\u6838\u5BF9\u6307\u7EB9\u4E00\u81F4\u540E\u70B9\u300C\u6279\u51C6\u300D\uFF0C\u7136\u540E\u6BCF 8 \u79D2\u590D\u67E5\u4E00\u6B21\u3002\u6CE8\u610F\uFF1A\u82E5 extension.connected \u4E3A false\uFF0C\u8BF4\u660E\u8FD9\u662F\u63D2\u4EF6\u65AD\u5F00\u524D\u7684\u65E7\u72B6\u6001\u2014\u2014\u8BF7\u63D0\u9192\u7528\u6237\u68C0\u67E5\u63D2\u4EF6\u5F00\u5173\u662F\u5426\u6253\u5F00\uFF08\u6216\u91CD\u65B0\u52A0\u8F7D\u63D2\u4EF6\u540E\u91CD\u65B0\u6253\u5F00\uFF09\uFF0C\u63D2\u4EF6\u91CD\u8FDE\u4F1A\u81EA\u52A8\u91CD\u65B0\u63E1\u624B\u3002` : `\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u91C7\u96C6\u4EFB\u52A1\u3002${this.pendingResultsHint()}`
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
    description: "\u91C7\u96C6\u67D0\u4F4D\u535A\u4E3B\u4E3B\u9875\u7684\u5168\u90E8/\u8FD1\u671F\u4F5C\u54C1\u5217\u8868\uFF08\u5C0F\u7EA2\u4E66\u6216\u6296\u97F3\uFF09\u3002\u9002\u5408\uFF1A\u5BF9\u6807\u8D26\u53F7\u5206\u6790\u3001\u8D26\u53F7\u5185\u5BB9\u7B56\u7565\u7814\u7A76\u3002\u9700\u63D0\u4F9B\u535A\u4E3B\u4E3B\u9875 URL\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u6279\u6700\u591A 300 \u6761\u300130 \u5206\u949F\u5185\u7D2F\u8BA1\u6700\u591A 600 \u6761\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF0C\u5E76\u4E3B\u52A8\u5EFA\u8BAE\u62C6\u6279\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u535A\u4E3B\u4E3B\u9875 URL\uFF08\u5982 https://www.xiaohongshu.com/user/profile/xxx\uFF09" },
        limit: { type: "integer", description: "\u91C7\u96C6\u6761\u6570\u4E0A\u9650\uFF081-300\uFF0C\u9ED8\u8BA4 20\uFF09" }
      },
      required: ["url"],
      additionalProperties: false
    }
  },
  {
    name: "leadsradar_capture_note_comments",
    description: "\u91C7\u96C6\u4E00\u7BC7\u7B14\u8BB0/\u89C6\u9891\u7684\u8BC4\u8BBA\u533A\uFF08\u8BC4\u8BBA\u5185\u5BB9\u3001\u70B9\u8D5E\u6570\u3001\u8BC4\u8BBA\u8005\u4FE1\u606F\uFF09\u3002\u9002\u5408\uFF1A\u627E\u5BA2\u6237\u7EBF\u7D22\uFF08\u8BC4\u8BBA\u7559\u8D44/\u6C42\u63A8\u8350/\u95EE\u4EF7\u683C\uFF09\u3001\u6316\u7528\u6237\u9700\u6C42\u4E0E\u75DB\u70B9\u3002\u9700\u63D0\u4F9B\u7B14\u8BB0 URL\u3002\u5B89\u5168\u9650\u989D\uFF1A\u5355\u7BC7\u6700\u591A 500 \u6761\u8BC4\u8BBA\uFF08\u4E3A\u4FDD\u969C\u8D26\u53F7\u5B89\u5168\uFF0C\u8D85\u9650\u8BF7\u6C42\u4F1A\u88AB\u81EA\u52A8\u62D2\u7EDD\u5E76\u8FD4\u56DE\u53EF\u8BFB\u9519\u8BEF\u2014\u2014\u8BF7\u5728\u5E03\u7F6E\u5927\u6279\u91CF\u4EFB\u52A1\u524D\u5148\u544A\u77E5\u7528\u6237\u6B64\u9650\u5236\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "\u7B14\u8BB0/\u89C6\u9891 URL" },
        limit: { type: "integer", description: "\u8BC4\u8BBA\u6761\u6570\u4E0A\u9650\uFF08\u9ED8\u8BA4 30\uFF09" }
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
    name: "leadsradar_save_topic",
    description: "\u628A\u4E00\u7BC7\u91C7\u96C6\u5230\u7684\u7B14\u8BB0\u5B58\u5165\u7528\u6237\u7684\u9009\u9898\u4ED3\u5E93\uFF08\u4E91\u7AEF\u5165\u5E93\u5F85\u5206\u62E3\uFF0Cweb \u9009\u9898\u4ED3\u5E93\u4E0E\u63D2\u4EF6\u5DE5\u4F5C\u53F0\u5747\u53EF\u89C1\uFF0C\u4E0E\u63D2\u4EF6\u300C\u5B58\u9009\u9898\u300D\u540C\u6E90\uFF09\u3002\u9002\u5408\uFF1A\u4F60\u7B5B\u9009\u51FA\u503C\u5F97\u521B\u4F5C\u8DDF\u8FDB\u7684\u7206\u6B3E/\u7EBF\u7D22\u7B14\u8BB0\u65F6\u843D\u5E93\u5B58\u6863\u3002\u53C2\u6570 note \u76F4\u63A5\u4F20\u91C7\u96C6\u5DE5\u5177\uFF08search_notes / capture_profile / note_detail\uFF09\u8FD4\u56DE\u7684\u7B14\u8BB0\u5BF9\u8C61\uFF0C\u539F\u6837\u4F20\u56DE\u5373\u53EF\u3002\u6CE8\u610F\uFF1A\u6B64\u64CD\u4F5C\u9700\u8981\u7528\u6237\u5DF2\u767B\u5F55\u2014\u2014\u672A\u767B\u5F55\u65F6\u4F1A\u8FD4\u56DE LOGIN_REQUIRED \u9519\u8BEF\uFF0C\u8BF7\u628A\u9519\u8BEF\u4E2D\u7684\u767B\u5F55\u6307\u5F15\u539F\u6837\u8F6C\u8FF0\u7ED9\u7528\u6237\uFF0C\u767B\u5F55\u540E\u91CD\u8BD5\u5373\u53EF\u3002\u53EA\u5199\u4E00\u6B21\u5E93\u3001\u4E0D\u5360\u91C7\u96C6\u9650\u989D\u3002",
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
    name: "leadsradar_query_local_data",
    description: "\u67E5\u8BE2\u63A2\u6817\u63D2\u4EF6\u672C\u5730\u6570\u636E\u5E93\uFF08\u53EA\u8BFB\uFF0C\u4E0D\u8BBF\u95EE\u7F51\u7EDC\u3001\u4E0D\u5360\u91C7\u96C6\u9650\u989D\uFF09\u3002\u9002\u5408\uFF1A\u67E5\u770B/\u7EDF\u8BA1\u5386\u53F2\u91C7\u96C6\u7684\u4F5C\u54C1\u3001\u8D26\u53F7\u3001\u5DF2\u5B58\u9009\u9898\u3001\u67D0\u7BC7\u7B14\u8BB0\u7684\u8BC4\u8BBA\uFF0C\u4EE5\u53CA\u672C\u5730\u7F13\u5B58\u7684 AI \u7814\u7A76\u62A5\u544A\uFF08\u4F5C\u54C1\u62C6\u89E3/\u8D26\u53F7\u7814\u7A76/\u8D5B\u9053\u7814\u7A76/\u8D26\u53F7\u590D\u76D8\uFF09\uFF0C\u751F\u6210\u6570\u636E\u6982\u89C8\u6216\u5DE1\u903B\u62A5\u544A\u3002\u8FD4\u56DE\u6309\u65F6\u95F4\u5012\u5E8F\u7684\u8BB0\u5F55\u5217\u8868\uFF08\u6761\u6570\u4E0A\u9650 200\uFF09\u3002",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          enum: ["works", "notes", "accounts", "comments", "reports"],
          description: "\u6570\u636E\u6E90\uFF1Aworks=\u5DF2\u5B58\u9009\u9898\u8BB0\u5F55\uFF0Cnotes=\u5168\u90E8\u91C7\u96C6\u8FC7\u7684\u4F5C\u54C1\uFF0Caccounts=\u91C7\u96C6\u8FC7\u7684\u8D26\u53F7\uFF0Ccomments=\u67D0\u7BC7\u7B14\u8BB0\u7684\u8BC4\u8BBA\uFF08\u987B\u914D note_url\uFF09\uFF0Creports=\u672C\u5730\u7F13\u5B58\u7684 AI \u7814\u7A76\u62A5\u544A\uFF08\u8FD4\u56DE\u7C7B\u578B/\u6807\u9898/\u4E00\u53E5\u8BDD\u5EFA\u8BAE/\u62A5\u544A\u76F4\u8FBE\u94FE\u63A5\uFF0C\u5168\u6587\u5728 web \u7AEF\u6253\u5F00\uFF09"
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
    description: "\u9886\u53D6\u63A2\u6817\u63D2\u4EF6\u4FA7\u5DF2\u5B8C\u6210\u4F46\u672A\u88AB\u8BA4\u9886\u7684\u4EFB\u52A1\u7ED3\u679C\uFF08\u4E0D\u5360\u91C7\u96C6\u9650\u989D\u3001\u79D2\u56DE\uFF09\u3002\u4F55\u65F6\u7528\uFF1A\u2460\u4EFB\u52A1\u8D85\u65F6\u540E\uFF08\u63D2\u4EF6\u53EF\u80FD\u5DF2\u8DD1\u5B8C\uFF0C\u5148\u9886\u518D\u51B3\u5B9A\u662F\u5426\u91CD\u53D1\uFF0C\u907F\u514D\u53CC\u8017\u91C7\u96C6\u989D\u5EA6\uFF09\uFF1B\u2461\u5BBF\u4E3B/\u4F1A\u8BDD\u91CD\u542F\u540E\u56DE\u6765\uFF1B\u2462connection_status \u7684 extension.pendingResults \u5217\u8868\u975E\u7A7A\u65F6\u3002\u9886\u53D6\u7ED3\u679C\u91CC results \u4E3A\u7ED3\u679C\u672C\u4F53\u53EF\u76F4\u63A5\u4F7F\u7528\uFF0Cpending \u4E3A\u5269\u4F59\u672A\u9886\u53D6\u6458\u8981\u3002\u9886\u4E0D\u5230\u518D\u7528 query_local_data \u67E5\u672C\u5730\u5E93\uFF0C\u90FD\u6CA1\u6709\u624D\u8003\u8651\u91CD\u53D1\u4EFB\u52A1\u3002",
    inputSchema: {
      type: "object",
      properties: {
        taskId: { type: "string", description: "\u53EF\u9009\uFF1A\u8981\u9886\u53D6\u7684 taskId\uFF08\u6765\u81EA connection_status \u7684 extension.pendingResults\uFF09\uFF1B\u4E0D\u4F20=\u9886\u53D6\u5168\u90E8\u672A\u9886\u53D6\u7ED3\u679C" }
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
async function callTool(name, args) {
  switch (name) {
    case "leadsradar_connection_status":
      void wakeLocalService();
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
      return broker.startTask({
        mode: "profile_posts",
        url,
        limit: capLimit(args.limit, 20),
        source: HOST,
        agentContext: { host: HOST }
      });
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
          serverInfo: { name: "leadsradar-agent-adapter", version: ADAPTER_VERSION, title: "\u63A2\u6817 Agent \u9002\u914D\u5668" },
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
