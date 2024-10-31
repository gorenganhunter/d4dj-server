"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notUndefined = exports.mapValues = exports.fromEntries = exports.entries = void 0;
exports.entries = Object.entries;
exports.fromEntries = Object.fromEntries;
const mapValues = (object, callback) => (0, exports.fromEntries)((0, exports.entries)(object).map(([k, v], i) => [k, callback(k, v, i)]));
exports.mapValues = mapValues;
const notUndefined = (obj) => obj !== undefined;
exports.notUndefined = notUndefined;
