import { VirtualDomCssClass } from "../virtual.dom";

export let defaultBackgroundColor = "#FFFFFF";
export let defaultColor: string = "#8F8E93";
export let defaultFontFamily: string = "Helvetica, Arial, sans-serif";

export const block: VirtualDomCssClass = {
    name: "block",
    style: {
        backgroundColor: defaultBackgroundColor,
        borderWidth: "0",
        boxSizing: "border-box",
        color: defaultColor,
        display: "block",
        fontFamily: defaultFontFamily,
        margin: "0",
        outlineWidth: "0",
        padding: "0"
    }
};

export const table: VirtualDomCssClass = {
    name: "table",
    style: {
        backgroundColor: defaultBackgroundColor,
        borderWidth: "0",
        boxSizing: "border-box",
        color: defaultColor,
        display: "table",
        fontFamily: defaultFontFamily,
        margin: "0",
        outlineWidth: "0",
        padding: "0"
    }
};