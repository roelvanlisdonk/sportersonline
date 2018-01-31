"use strict";
/**
 * Based on https://github.com/ericelliott/cuid
 */
Object.defineProperty(exports, "__esModule", { value: true });
let _c = 0;
const _blockSize = 4;
const _base = 36;
const _discreteValues = Math.pow(_base, _blockSize);
let _globalCountCache = null;
function cuid() {
    // Starting with a lowercase letter makes
    // it HTML element ID friendly.
    const letter = 'c';
    // timestamp
    // warning: this exposes the exact date and time
    // that the uid was created.
    const timestamp = (new Date().getTime()).toString(_base);
    // Grab some more chars from Math.random()
    const random = randomBlock() + randomBlock();
    // Prevent same-machine collisions.
    const counter = pad(safeCounter().toString(_base), _blockSize);
    // We don't use finger printing.
    return letter + timestamp + counter + random;
}
exports.cuid = cuid;
function fingerprint() {
    return pad((navigator.mimeTypes.length +
        navigator.userAgent.length).toString(36) +
        globalCount().toString(36), 4);
}
function globalCount() {
    if (_globalCountCache) {
        return _globalCountCache;
    }
    let i;
    let count = 0;
    for (i in window) {
        count++;
    }
    return count;
}
function pad(str, size) {
    return ('000000000' + str).slice(-size);
}
function randomBlock() {
    return pad((Math.random() * _discreteValues << 0).toString(_base), _blockSize);
}
function safeCounter() {
    _c = _c < _discreteValues ? _c : 0;
    return _c++;
}
//# sourceMappingURL=cuid.js.map