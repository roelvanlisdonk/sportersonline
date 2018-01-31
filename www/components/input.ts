import { VirtualDomNode } from '.././virtual.dom';
import { saveField, StoreField, StoreFieldValue } from '.././store';

export function input(field: StoreField<StoreFieldValue>): VirtualDomNode {
    
    const node: VirtualDomNode = {
        deps: field,
        events: [{ name: "input", listener: onInputChange, options: false }],
        name: "input"
    }

    function onInputChange(e: any): void {
        field.value = e.data;
        saveField(field);
    }

    return node;
}