import { afterVisible } from "./after-visible";

function focus(element: HTMLElement) {
    element.focus();
}

/**
 * Check the DOM repeatedly to see if the given element is visible, when element is visible focus it.
 */
export function focusAfterVisible(selector: string, interval: number = 10, retryCount: number = 30): void {
    afterVisible(selector, focus, interval, retryCount);
}