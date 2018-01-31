import {AppData, Account} from "./data"
import { StoreField, StoreItem, saveItem } from "./store";
import { boot } from "./renderer";
import { VirtualDomNode } from "./virtual.dom";
import { block } from "./components/styles";
import { execute } from "./test.framework";

window.addEventListener("unhandledrejection", function handlUnhandledrejection (event) {
    if(console) {
        console.log(event);
    }
});

export async function app(appData:AppData): Promise<VirtualDomNode> {
    const nodes: Array<VirtualDomNode> = [];
    
    const node: VirtualDomNode = {
        attributes:[{name:"title", value: "This is an AM app."}],
        classes:[block],
        deps: appData,
        name: "my-app",
        nodes: nodes,
        render: app
    };

    if(appData.account.isAuthenticated.value === true) {
        const mod = await import("./components/feed");
        const feedNode = await mod.feed(appData);
        nodes.push(feedNode);
    } else {
        const mod = await import("./components/login")
        const loginNode = await mod.login(appData.account);
        nodes.push(loginNode);
    }
    
    return node;
}

async function runTests(){
    let mod = await import("./common/validation/is.function.test");
    mod = await import("./store.test");
    mod = await import("./common/validation/is.object.test");

    // Run tests
    execute();
}

export function start() {
    console.log("start application");

    // Save some initial data to the store.
    const appData: AppData = {
        account: {
            isAuthenticated: { value: false },
            name: { value: null },
            password: { value: null }
        }
    };
    saveItem(appData);

    // Get HTML root element.
    const appElement = <HTMLElement>document.body.getElementsByTagName("my-app")[0];

    // First rendering of the application.
    boot(appElement, app, appData);

    runTests();
}

start();