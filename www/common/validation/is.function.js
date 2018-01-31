"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Based on: https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/
 */
function isFunction(obj) {
    return "[object Function]" === Object.prototype.toString.call(obj);
}
exports.isFunction = isFunction;
//# sourceMappingURL=is.function.js.map