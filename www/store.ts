import { counters, fields, items, StoreField, StoreFieldValue, StoreItem } from "./store.data";
import { cuid } from "./store/cuid";
import { publish } from "./services/event.service";
import { isObject } from "./common/validation/is.object";

// For performance reasons, we generate a cuid only once and use a counter to make storeId's generated in this session unique.
const rootCuid = cuid();
let cuidCounter = 0;
export const STORE_CHANGED_EVENT = "store_changed";

export function getField(id: string): StoreField<StoreFieldValue> {
    return fields[id];
}

export function getItem(id: string): StoreItem {
    return items[id];
}

export function hasChanged(obj: object): boolean {
    const result = false;

    if(isField(obj)){
        const field = <StoreField<StoreFieldValue>>obj;
        return (field.value !== field.previousValue);
    }

    for (let attrName in obj) {
        if (obj.hasOwnProperty(attrName)) {
            const attrValue = (<any>obj)[attrName];

            if(isField(attrValue)){
                const field = <StoreField<StoreFieldValue>>attrValue;
                if (field.value !== field.previousValue) {
                    return true;
                }
            }

            if(isItem(attrValue) && hasChanged(attrValue)) {
                return true;
            }
        }
    }

    return result;
}

export function isField(obj: object): boolean {
    const field = <StoreField<StoreFieldValue>>obj || <any>{};
    return (field.value !== undefined && Boolean(field.storeId));
}

export function isItem(obj: object): boolean {
    const item = <StoreField<StoreFieldValue>>obj || <any>{};
    return Boolean(item.storeId);
}

export function newCuid(): string {
    cuidCounter = cuidCounter + 1;
    return `${rootCuid}-${cuidCounter}`;
}

/**
 * Save field to store, publish store changed event when needed.
 */
export function saveField(field: StoreField<StoreFieldValue>, skipStoreChangedEvent?: boolean): SaveFieldResult {
    const shouldPublishStoreChangedEvent = !skipStoreChangedEvent;

    // New field
    if(!field.storeId) {
        field.storeId = newCuid();
        
        // Reset previousValue, for correct change tracking.
        field.previousValue = undefined;

        // Save
        fields[field.storeId] = field;

        // Publish
        if(shouldPublishStoreChangedEvent) {
            publish(STORE_CHANGED_EVENT);  
        }
                
        return {field: field, storeHasChanged: true};
    } 
    
    // Existing field in store.
    let fieldInStore = fields[field.storeId]
    if(fieldInStore) {
        const storeChanged = fieldInStore.previousValue !== field.value;
        if(storeChanged) {
            // Set previousValue, for correct change tracking.
            fieldInStore.previousValue = fieldInStore.value;

            // Save
            fieldInStore.value = field.value;           
            
            // Publish
            if(shouldPublishStoreChangedEvent) {
                publish(STORE_CHANGED_EVENT);  
            }
        }
        return {field: field, storeHasChanged: storeChanged};
    }    

    // Existing field, but not in store.

    // Reset previousValue, for correct change tracking.
    field.previousValue = undefined;

    // Save
    fieldInStore = fields[field.storeId] = field;   

    // Publish
    if(shouldPublishStoreChangedEvent) {
        publish(STORE_CHANGED_EVENT);  
    }
        
    return {field: field, storeHasChanged: true};
}

export function saveItem<T extends StoreItem>(item: T, skipStoreChangedEvent?: boolean): SaveItemResult<T> {
    let shouldPublishStoreChangedEvent = !skipStoreChangedEvent;

    // New item
    if(!item.storeId) {
        item.storeId = newCuid();

        // Save
        items[item.storeId] = item;

        // Save StoreItems and StoreFields in properties, but do not publish store changed event.
        saveItem(item, true);

        // Publish
        if(shouldPublishStoreChangedEvent) {
            publish(STORE_CHANGED_EVENT);  
        }
        
        return {item: item, storeHasChanged: true};
    } 

    // Existing item in store.
    let itemInStore = items[item.storeId]
    if(itemInStore) {
        let itemChangedInStore = false;
        
        // Loop all properties.
        for (let attrName in item) {
            if (item.hasOwnProperty(attrName)) {
                const attrValue = (<any>item)[attrName];
    
                // Save attribute value as StoreField.
                if(isField(attrValue)) {
                    const skipPublishOfStoreChangedEvent = true;
                    const result = saveField(attrValue, skipPublishOfStoreChangedEvent);
                    itemChangedInStore = itemChangedInStore || result.storeHasChanged;
                    continue;
                }
    
                // Save attribute as StoreItem.
                if(isObject(attrValue)) {
                    const skipPublishOfStoreChangedEvent = true;
                    const result = saveItem(attrValue, skipPublishOfStoreChangedEvent);
                    itemChangedInStore = itemChangedInStore || result.storeHasChanged;
                    continue;
                }
            }
        }

        // Publish storechangedevent only, when item has changed in the store and we don't have to skip publishing.
        shouldPublishStoreChangedEvent = itemChangedInStore && !skipStoreChangedEvent;
        if(shouldPublishStoreChangedEvent) {
            publish(STORE_CHANGED_EVENT);  
        }
        
        return {item: item, storeHasChanged: itemChangedInStore};
    }

    // Store item not in store, save it.
    items[item.storeId] = item;

    // Save StoreItems and StoreFields in properties, but do not publish store changed event.
    saveItem(item, true);

    // Publish
    if(shouldPublishStoreChangedEvent) {
        publish(STORE_CHANGED_EVENT);  
    }

    return {item: item, storeHasChanged: true};
}

export function saveItems(items: Array<StoreItem | StoreField<StoreFieldValue>>): Array<StoreItem | StoreField<StoreFieldValue>> {
    return items;
}

export interface SaveFieldResult {
    field: StoreField<StoreFieldValue>;
    storeHasChanged: boolean;
}

export interface SaveItemResult<T extends StoreItem> {
    item: T;
    storeHasChanged: boolean;
}

export interface WatchOptions {
    // When true, watch will be triggerd, when any StoreField in the given tree changes, even arrays will be traversed.
    // It can handle cyclic dependencies.
    deep: boolean; 
    state?: any; // Some state that can be passe from the watch creator to the onchange function.
}

// Re-export interface from store.data.
export { 
    StoreField as StoreField,
    StoreFieldValue as StoreFieldValue,
    StoreItem as StoreItem
};