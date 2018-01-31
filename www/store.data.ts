/**
 * This module should not be used directly.
 * It will only be used by the store.
 * It is created as a seperate module, to allow for hot reloading.
 */
export const counters = {
    storeId: 0
};
export const fields: Fields = {};
export const items: Items = {};



export type BasicType = boolean | Date | number | string;

interface Fields {
    [index: string]: StoreField<StoreFieldValue>;
}

interface Items {
    [index: string]: StoreItem;
}

export interface StoreField<T extends StoreFieldValue> extends StoreItem {
    previousValue?: T;
    value: T;
}

export type StoreFieldValue = Array<BasicType> | BasicType;

export interface StoreItem {
    storeId?: string;
    /**
     * off = Function store.hasChanged will always return false.
     * rootOnly = Only check root level StoreFields, when checking for changes.  This is the default value.
     * skipArrays = Traverse the tree, but skip items in arrays, when checking for changes.
     * full = Traverse the tree, include every item, including items in arrays, when checking for changes.
     */
    detectChanges?: "off" | "rootOnly" | "skipArrays" | "full";
}