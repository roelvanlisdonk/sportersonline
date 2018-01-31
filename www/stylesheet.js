"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const to_snake_case_1 = require("./common/text/to.snake.case");
const _rules = {};
/**
 * An am app contains only one app stylesheet.
 * IClass extends IRule
 * IClass will be added as a IRule by setting the IClass.selector based on IClass.name.
 */
function addClassToStyleSheet(cssClass) {
    if (!cssClass) {
        throw new Error("Please provide cssClass.");
    }
    if (!cssClass.name) {
        throw new Error("Please provide cssClass.name.");
    }
    if (!cssClass.style) {
        throw new Error("Please provide cssClass.style.");
    }
    const selector = `.${cssClass.name}`;
    if (!_rules[selector]) {
        const rule = {
            selector,
            style: cssClass.style
        };
        addRuleToStyleSheet(rule);
    }
}
exports.addClassToStyleSheet = addClassToStyleSheet;
/**
 * An am app contains only one app stylesheet.
 * IRules are added only once to the app stylesheet based on IRule.selector.
 */
function addRuleToStyleSheet(rule) {
    if (!rule) {
        throw new Error("Please provide rule.");
    }
    if (!rule.selector) {
        throw new Error("Please provide rule.selector.");
    }
    if (!rule.style) {
        throw new Error("Please provide rule.style.");
    }
    const selector = rule.selector;
    if (!_rules[selector]) {
        let rules = "";
        const style = rule.style;
        const keys = Object.keys(style);
        const keyCount = keys.length;
        for (let i = 0; i < keyCount; i++) {
            const key = keys[i];
            const value = style[key];
            const snake = to_snake_case_1.toSnakeCase(key);
            if (key[0] !== "_") {
                rules += `${snake}:${value};`;
            }
        }
        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(`${selector} { ${rules} }`, 0);
        }
        else if ("addRule" in styleSheet) {
            styleSheet.addRule(`${selector}`, rules, 0);
        }
        _rules[selector] = rule;
        rule.rendered = true;
    }
}
exports.addRuleToStyleSheet = addRuleToStyleSheet;
function create(id) {
    if (!id) {
        throw new Error("Please provide id.");
    }
    // Create the <style> tag
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement("style");
    style.id = id;
    style.type = "text/css";
    if (style.styleSheet) {
        // IE8
        style.styleSheet.cssText = "";
    }
    else {
        // WebKit hack
        style.appendChild(document.createTextNode(""));
    }
    // Add the <style> element to the page
    head.appendChild(style);
    // IE8 support (style.styleSheet)
    return style.sheet || style.styleSheet;
}
// TODO: Remove stylesheet if it exists before creating.
// One time creation of the am stylesheet.
const styleSheet = create("am");
//# sourceMappingURL=stylesheet.js.map