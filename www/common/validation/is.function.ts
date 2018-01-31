/**
 * Based on: https://toddmotto.com/understanding-javascript-types-and-reliable-type-checking/
 */
export function isFunction(obj: any): boolean {
    return "[object Function]" === Object.prototype.toString.call(obj);
} 