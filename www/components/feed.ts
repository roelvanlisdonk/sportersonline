import {AppData} from '../data'
import { StoreField, StoreItem } from '../store';
import { input } from './input';
import { VirtualDomNode } from '../virtual.dom';

export async function feed(appData:AppData): Promise<VirtualDomNode> {
    const node: VirtualDomNode = {
        deps: appData,
        name: "feed",
        nodes:[
            {text: "Het feed component"}
        ]
    };
    
    return node;
}