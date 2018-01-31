"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Based on: https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/
 */
function isObject(obj) {
    return "[object Object]" === Object.prototype.toString.call(obj);
}
exports.isObject = isObject;
//# sourceMappingURL=is.object.js.map