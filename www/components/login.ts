import {Account} from '../data'
import { StoreField, StoreItem, saveField } from '../store';
import { button } from './button';
import { input } from './input';
import { VirtualDomNode } from '../virtual.dom';

export async function login(account:Account): Promise<VirtualDomNode> {
    
    function inloggen(evt: any): void {
        console.log("Inloggen!!!");
        
        account.isAuthenticated.value = true;
        saveField(account.isAuthenticated);
    }

    const node: VirtualDomNode = {
        deps: account,
        nodes: [
            {text: "Gebruikersnaam"},
            input(account.name),
            {text: "Wachtwoord"},
            input(account.password),
            button({onClick: inloggen, text: "Inloggen"})
        ],
        name: "login"
    };

    return node;
}

