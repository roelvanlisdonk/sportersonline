"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check the DOM repeatedly to see if the given element is visible, when element is visible call given function.
 */
function afterVisible(selector, fn, interval = 10, retryCount = 30) {
    const element = document.querySelector(selector);
    if (element) {
        const elementIsVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
        if (elementIsVisible) {
            fn(element);
            return;
        }
    }
    setTimeout(function afterVisibleSetTimeoutElapsed() {
        if (retryCount === 0) {
            if (console) {
                console.log(`Element '${selector}' does not exist or was not visible.`);
            }
        }
        else {
            // Try again
            afterVisible(selector, fn, retryCount - 1, interval);
        }
    }, interval);
}
exports.afterVisible = afterVisible;
//# sourceMappingURL=after-visible.js.map