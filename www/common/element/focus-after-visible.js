"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const after_visible_1 = require("./after-visible");
function focus(element) {
    element.focus();
}
/**
 * Check the DOM repeatedly to see if the given element is visible, when element is visible focus it.
 */
function focusAfterVisible(selector, interval = 10, retryCount = 30) {
    after_visible_1.afterVisible(selector, focus, interval, retryCount);
}
exports.focusAfterVisible = focusAfterVisible;
//# sourceMappingURL=focus-after-visible.js.map