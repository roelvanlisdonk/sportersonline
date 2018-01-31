import { VirtualDomNode } from '.././virtual.dom';
import { StoreField, StoreFieldValue, saveField } from '.././store';

export function button(deps: ButtonOptions): VirtualDomNode {
    
    const node: VirtualDomNode = {
        attributes: [],
        deps: deps,
        events: [],
        name: "button",
        nodes: []
    }

    // Attributes
    deps.type = deps.type || "button";
    node.attributes.push({name: "type", value: deps.type});

    // Events
    if(deps.onClick) {
        node.events.push({name: "click", listener: deps.onClick});
    }

    // Nodes
    if(deps.text) {
        node.nodes.push({text: deps.text});
    }

    return node;
}

export interface ButtonOptions {
    onClick?: (evt: any) => void;
    text?: string;
    type?: "submit" | "reset" | "button";
}