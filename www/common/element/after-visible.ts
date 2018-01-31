/**
 * Check the DOM repeatedly to see if the given element is visible, when element is visible call given function.
 */
export function afterVisible(selector: string, fn: (element?: HTMLElement) => void, interval: number = 10, retryCount: number = 30): void {
    const element = <HTMLElement>document.querySelector(selector);
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
        } else {
            // Try again
            afterVisible(selector, fn, retryCount - 1, interval);
        }
    }, interval);
}