import { VirtualDomAttribute, VirtualDomCssClass, VirtualDomEvent, VirtualDomNode, VirtualDomCssRule } from "./virtual.dom";
import { addClassToStyleSheet } from "./stylesheet";
import { subscribe } from "./services/event.service";
import { hasChanged, STORE_CHANGED_EVENT } from "./store";

let _renderer: Renderer;
/**
 * This value will be used to store the root virtual dom node in the store.
 */
export const RootVirtualDomNodeStoreKey = "RootVirtualDomNode";



function addClass(element: HTMLElement, className: string): void {
    if (element.classList) {
        element.classList.add(className);
    } else if (!hasClass(element, className)) {
        var classes = element.className.split(" ");
        classes.push(className);
        element.className = classes.join(" ");
    }
}

/** 
 * For now use html renderer as default. 
 */
export async function boot<T>(nativeNode: HTMLElement, fn: (deps: any) => Promise<VirtualDomNode>, deps: any): Promise<VirtualDomNode> {
    _renderer = {
        renderAttribute: renderAttribute,
        renderClass: renderClass,
        renderEvent: renderEvent,
        renderNode: renderNode
    }

    // Generate the virtual dom
    const node: VirtualDomNode = await fn(deps);
    node.nativeNode = nativeNode;
    
    // Generate native dom.
    let checkIfDependenciesHaveChanged = false;
    await _renderer.renderNode(node, checkIfDependenciesHaveChanged);

    // When store changes, rerender the UI.
    subscribe(STORE_CHANGED_EVENT, async function rerender() {
        
        // Update virtual dom and native dom, when deps changed.
        checkIfDependenciesHaveChanged = true;
        await _renderer.renderNode(node, checkIfDependenciesHaveChanged);
    });

    return node;
}

export function getRenderer(): Renderer {
    return _renderer;
}

function hasClass(element: HTMLElement, className: string): boolean {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        return (-1 < element.className.indexOf(className));
    }
}

function renderAttribute(attr: VirtualDomAttribute, checkHaschanged: boolean): void {
    const attrName = attr.name;
    const nativeNode = attr.parent.nativeNode;

    // Update virtual dom, when needed.
    if(checkHaschanged && attr.deps && hasChanged(attr.deps))
    {
        if(Boolean(attr.render)){
            attr = attr.render(attr.deps);
        }
    }
    
    const shouldRender = !Boolean(attr.shouldNotRender);
    if(shouldRender) {
        // Only set attribute, when its virtual dom value, does not match dom value.
        const value = attr.value;
        const nativeValue: any = nativeNode[attrName];
        if(nativeValue != value) {
            nativeNode.setAttribute(attrName, value);
        }
    } else {
        // removeAttribute can always be called, because it doesn't fail, when attribute doesn't exist.
        nativeNode.removeAttribute(attrName);
    }
}

function renderClass(cssClass: VirtualDomCssClass, checkHaschanged: boolean): void {
    // Update virtual dom, when needed.
    if(checkHaschanged && cssClass.deps && hasChanged(cssClass.deps))
    {
        if(Boolean(cssClass.render)){
            cssClass = cssClass.render(cssClass.deps);
        }
    }
    
    const shouldRender = !Boolean(cssClass.shouldNotRender);
    if(shouldRender) {
        // Will only add css class, when it doesn't exist.
        addClass(cssClass.parent.nativeNode, cssClass.name);
    } else {
        // Will only remove css class, when it exists.
        removeClass(cssClass.parent.nativeNode, cssClass.name);
    }

    if(cssClass.rendered !== true) {
        addClassToStyleSheet(cssClass);
    }
}

function renderEvent(evt: VirtualDomEvent, checkHaschanged: boolean): void {
    const evtName = evt.name;
    const nativeNode = <HTMLElement>evt.parent.nativeNode;

    // Update virtual dom, when needed.
    if(checkHaschanged && evt.deps && hasChanged(evt.deps))
    {
        if(Boolean(evt.render)){
            evt = evt.render(evt.deps);
        }
    }
    
    const shouldRender = !Boolean(evt.shouldNotRender);
    if(shouldRender) {
        nativeNode.addEventListener(evtName, evt.listener, evt.options);
    } else {
        nativeNode.removeEventListener(evtName, evt.listener, evt.options);
    }
}

async function renderNode(node: VirtualDomNode, checkHaschanged: boolean): Promise<any> {
    const nativeNode: any = node.nativeNode;

    // Update virtual dom, when needed.
    if(checkHaschanged && node.deps && hasChanged(node.deps))
    {
        if(Boolean(node.render)){
            node = await node.render(node.deps);
            node.nativeNode = nativeNode;
        }
    }

    const shouldRender = !Boolean(node.shouldNotRender);
    if(shouldRender) {
        // Attributes
        const attrs = node.attributes;
        if(attrs && attrs.length && attrs.length > 0) {
            for(let i = 0, length = attrs.length; i < length; i++) {
                const attr = attrs[i];
                attr.parent = node;
                _renderer.renderAttribute(attr, checkHaschanged);
            }
        }

        // Classes
        const classes = node.classes;
        if(classes && classes.length && classes.length > 0) {
            for(let i = 0, length = classes.length; i < length; i++) {
                const cssClass = classes[i];
                cssClass.parent = node;
                _renderer.renderClass(cssClass, checkHaschanged);
            }
        }

        // Events
        const evts = node.events;
        if(evts && evts.length && evts.length > 0) {
            for(let i = 0, length = evts.length; i < length; i++) {
                const evt = evts[i];
                evt.parent = node;
                _renderer.renderEvent(evt, checkHaschanged);
            }
        }

        // Nodes
        const frag = document.createDocumentFragment();
        const nodes: VirtualDomNode[] = node.nodes;
        if(nodes && nodes.length && nodes.length > 0) {
            for(let i = 0, length = nodes.length; i < length; i++) {
                const childNode = nodes[i];
                childNode.parent = node;
                
                if(childNode.text) {
                    childNode.nativeNode = document.createTextNode(childNode.text);
                    frag.appendChild(childNode.nativeNode);
                }

                if(childNode.name) {
                    childNode.nativeNode = document.createElement(childNode.name);
                    frag.appendChild(childNode.nativeNode);
                    await _renderer.renderNode(childNode, checkHaschanged);
                }
            }

            (<HTMLElement>node.nativeNode).innerHTML = "";
            node.nativeNode.appendChild(frag);
        }
    }

    return node;
}

function removeClass(element: HTMLElement, className: string): void {
    if (element.classList) {
        element.classList.remove(className);
    } else {
        var classes = element.className.split(" ");
        classes.splice(classes.indexOf(className), 1);
        element.className = classes.join(" ");
    }
}

export interface Renderer {
    renderAttribute: (attribute: VirtualDomAttribute, checkHaschanged: boolean) => void;
    renderClass: (cssClass: VirtualDomCssClass, checkHaschanged: boolean) => void;
    renderEvent: (event: VirtualDomEvent, checkHaschanged: boolean) => void;
    renderNode: (node: VirtualDomNode, checkHaschanged: boolean) => Promise<VirtualDomNode>;
}