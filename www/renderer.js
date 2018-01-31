"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stylesheet_1 = require("./stylesheet");
const event_service_1 = require("./services/event.service");
const store_1 = require("./store");
let _renderer;
/**
 * This value will be used to store the root virtual dom node in the store.
 */
exports.RootVirtualDomNodeStoreKey = "RootVirtualDomNode";
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else if (!hasClass(element, className)) {
        var classes = element.className.split(" ");
        classes.push(className);
        element.className = classes.join(" ");
    }
}
/**
 * For now use html renderer as default.
 */
function boot(nativeNode, fn, deps) {
    return __awaiter(this, void 0, void 0, function* () {
        _renderer = {
            renderAttribute: renderAttribute,
            renderClass: renderClass,
            renderEvent: renderEvent,
            renderNode: renderNode
        };
        // Generate the virtual dom
        const node = yield fn(deps);
        node.nativeNode = nativeNode;
        // Generate native dom.
        let checkIfDependenciesHaveChanged = false;
        yield _renderer.renderNode(node, checkIfDependenciesHaveChanged);
        // When store changes, rerender the UI.
        event_service_1.subscribe(store_1.STORE_CHANGED_EVENT, function rerender() {
            return __awaiter(this, void 0, void 0, function* () {
                // Update virtual dom and native dom, when deps changed.
                checkIfDependenciesHaveChanged = true;
                yield _renderer.renderNode(node, checkIfDependenciesHaveChanged);
            });
        });
        return node;
    });
}
exports.boot = boot;
function getRenderer() {
    return _renderer;
}
exports.getRenderer = getRenderer;
function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    else {
        return (-1 < element.className.indexOf(className));
    }
}
function renderAttribute(attr, checkHaschanged) {
    const attrName = attr.name;
    const nativeNode = attr.parent.nativeNode;
    // Update virtual dom, when needed.
    if (checkHaschanged && attr.deps && store_1.hasChanged(attr.deps)) {
        if (Boolean(attr.render)) {
            attr = attr.render(attr.deps);
        }
    }
    const shouldRender = !Boolean(attr.shouldNotRender);
    if (shouldRender) {
        // Only set attribute, when its virtual dom value, does not match dom value.
        const value = attr.value;
        const nativeValue = nativeNode[attrName];
        if (nativeValue != value) {
            nativeNode.setAttribute(attrName, value);
        }
    }
    else {
        // removeAttribute can always be called, because it doesn't fail, when attribute doesn't exist.
        nativeNode.removeAttribute(attrName);
    }
}
function renderClass(cssClass, checkHaschanged) {
    // Update virtual dom, when needed.
    if (checkHaschanged && cssClass.deps && store_1.hasChanged(cssClass.deps)) {
        if (Boolean(cssClass.render)) {
            cssClass = cssClass.render(cssClass.deps);
        }
    }
    const shouldRender = !Boolean(cssClass.shouldNotRender);
    if (shouldRender) {
        // Will only add css class, when it doesn't exist.
        addClass(cssClass.parent.nativeNode, cssClass.name);
    }
    else {
        // Will only remove css class, when it exists.
        removeClass(cssClass.parent.nativeNode, cssClass.name);
    }
    if (cssClass.rendered !== true) {
        stylesheet_1.addClassToStyleSheet(cssClass);
    }
}
function renderEvent(evt, checkHaschanged) {
    const evtName = evt.name;
    const nativeNode = evt.parent.nativeNode;
    // Update virtual dom, when needed.
    if (checkHaschanged && evt.deps && store_1.hasChanged(evt.deps)) {
        if (Boolean(evt.render)) {
            evt = evt.render(evt.deps);
        }
    }
    const shouldRender = !Boolean(evt.shouldNotRender);
    if (shouldRender) {
        nativeNode.addEventListener(evtName, evt.listener, evt.options);
    }
    else {
        nativeNode.removeEventListener(evtName, evt.listener, evt.options);
    }
}
function renderNode(node, checkHaschanged) {
    return __awaiter(this, void 0, void 0, function* () {
        const nativeNode = node.nativeNode;
        // Update virtual dom, when needed.
        if (checkHaschanged && node.deps && store_1.hasChanged(node.deps)) {
            if (Boolean(node.render)) {
                node = yield node.render(node.deps);
                node.nativeNode = nativeNode;
            }
        }
        const shouldRender = !Boolean(node.shouldNotRender);
        if (shouldRender) {
            // Attributes
            const attrs = node.attributes;
            if (attrs && attrs.length && attrs.length > 0) {
                for (let i = 0, length = attrs.length; i < length; i++) {
                    const attr = attrs[i];
                    attr.parent = node;
                    _renderer.renderAttribute(attr, checkHaschanged);
                }
            }
            // Classes
            const classes = node.classes;
            if (classes && classes.length && classes.length > 0) {
                for (let i = 0, length = classes.length; i < length; i++) {
                    const cssClass = classes[i];
                    cssClass.parent = node;
                    _renderer.renderClass(cssClass, checkHaschanged);
                }
            }
            // Events
            const evts = node.events;
            if (evts && evts.length && evts.length > 0) {
                for (let i = 0, length = evts.length; i < length; i++) {
                    const evt = evts[i];
                    evt.parent = node;
                    _renderer.renderEvent(evt, checkHaschanged);
                }
            }
            // Nodes
            const frag = document.createDocumentFragment();
            const nodes = node.nodes;
            if (nodes && nodes.length && nodes.length > 0) {
                for (let i = 0, length = nodes.length; i < length; i++) {
                    const childNode = nodes[i];
                    childNode.parent = node;
                    if (childNode.text) {
                        childNode.nativeNode = document.createTextNode(childNode.text);
                        frag.appendChild(childNode.nativeNode);
                    }
                    if (childNode.name) {
                        childNode.nativeNode = document.createElement(childNode.name);
                        frag.appendChild(childNode.nativeNode);
                        yield _renderer.renderNode(childNode, checkHaschanged);
                    }
                }
                node.nativeNode.innerHTML = "";
                node.nativeNode.appendChild(frag);
            }
        }
        return node;
    });
}
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        var classes = element.className.split(" ");
        classes.splice(classes.indexOf(className), 1);
        element.className = classes.join(" ");
    }
}
//# sourceMappingURL=renderer.js.map