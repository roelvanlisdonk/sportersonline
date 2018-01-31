import { StoreField } from './store';
import { Style } from './style';

export interface VirtualDomAttribute extends VirtualDomPart {
    render?: (deps: any) => VirtualDomAttribute;
    value: string | null;
}

export interface VirtualDomCssClass extends VirtualDomPart {
    render?: (deps: any) => VirtualDomCssClass;
    rendered?: boolean;
    style: Style | null;
}

export interface VirtualDomCssRule extends VirtualDomPart {
    render?: (deps: any) => VirtualDomCssRule;
    rendered?: boolean;
    selector: string;
    style: Style;
}

export interface VirtualDomEvent extends VirtualDomPart {
    name: "click" | "input";
    listener: (event: any, options?: boolean) => void | null;
    render?: (deps: any) => VirtualDomEvent;
    options?: boolean;
}

export interface VirtualDomNode extends VirtualDomPart {
    attributes?: Array<VirtualDomAttribute>;
    classes?: Array<VirtualDomCssClass>;
    events?: Array<VirtualDomEvent>;
    nativeNode?: any;
    nodes?: Array<VirtualDomNode>;
    render?: (deps: any) => Promise<VirtualDomNode>;
    text?: string; // Used when Node is a text node.
}

export interface VirtualDomPart {
    deps?: any;
    name?: string;
    parent?: VirtualDomNode;
    shouldNotRender?: boolean;
}