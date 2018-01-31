"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function button(deps) {
    const node = {
        attributes: [],
        deps: deps,
        events: [],
        name: "button",
        nodes: []
    };
    // Attributes
    deps.type = deps.type || "button";
    node.attributes.push({ name: "type", value: deps.type });
    // Events
    if (deps.onClick) {
        node.events.push({ name: "click", listener: deps.onClick });
    }
    // Nodes
    if (deps.text) {
        node.nodes.push({ text: deps.text });
    }
    return node;
}
exports.button = button;
//# sourceMappingURL=button.js.map