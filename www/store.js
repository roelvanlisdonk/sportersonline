"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_data_1 = require("./store.data");
const cuid_1 = require("./store/cuid");
const event_service_1 = require("./services/event.service");
const is_object_1 = require("./common/validation/is.object");
// For performance reasons, we generate a cuid only once and use a counter to make storeId's generated in this session unique.
const rootCuid = cuid_1.cuid();
let cuidCounter = 0;
exports.STORE_CHANGED_EVENT = "store_changed";
function getField(id) {
    return store_data_1.fields[id];
}
exports.getField = getField;
function getItem(id) {
    return store_data_1.items[id];
}
exports.getItem = getItem;
function hasChanged(obj) {
    const result = false;
    if (isField(obj)) {
        const field = obj;
        return (field.value !== field.previousValue);
    }
    for (let attrName in obj) {
        if (obj.hasOwnProperty(attrName)) {
            const attrValue = obj[attrName];
            if (isField(attrValue)) {
                const field = attrValue;
                if (field.value !== field.previousValue) {
                    return true;
                }
            }
            if (isItem(attrValue) && hasChanged(attrValue)) {
                return true;
            }
        }
    }
    return result;
}
exports.hasChanged = hasChanged;
function isField(obj) {
    const field = obj || {};
    return (field.value !== undefined && Boolean(field.storeId));
}
exports.isField = isField;
function isItem(obj) {
    const item = obj || {};
    return Boolean(item.storeId);
}
exports.isItem = isItem;
function newCuid() {
    cuidCounter = cuidCounter + 1;
    return `${rootCuid}-${cuidCounter}`;
}
exports.newCuid = newCuid;
/**
 * Save field to store, publish store changed event when needed.
 */
function saveField(field, skipStoreChangedEvent) {
    const shouldPublishStoreChangedEvent = !skipStoreChangedEvent;
    // New field
    if (!field.storeId) {
        field.storeId = newCuid();
        // Reset previousValue, for correct change tracking.
        field.previousValue = undefined;
        // Save
        store_data_1.fields[field.storeId] = field;
        // Publish
        if (shouldPublishStoreChangedEvent) {
            event_service_1.publish(exports.STORE_CHANGED_EVENT);
        }
        return { field: field, storeHasChanged: true };
    }
    // Existing field in store.
    let fieldInStore = store_data_1.fields[field.storeId];
    if (fieldInStore) {
        const storeChanged = fieldInStore.previousValue !== field.value;
        if (storeChanged) {
            // Set previousValue, for correct change tracking.
            fieldInStore.previousValue = fieldInStore.value;
            // Save
            fieldInStore.value = field.value;
            // Publish
            if (shouldPublishStoreChangedEvent) {
                event_service_1.publish(exports.STORE_CHANGED_EVENT);
            }
        }
        return { field: field, storeHasChanged: storeChanged };
    }
    // Existing field, but not in store.
    // Reset previousValue, for correct change tracking.
    field.previousValue = undefined;
    // Save
    fieldInStore = store_data_1.fields[field.storeId] = field;
    // Publish
    if (shouldPublishStoreChangedEvent) {
        event_service_1.publish(exports.STORE_CHANGED_EVENT);
    }
    return { field: field, storeHasChanged: true };
}
exports.saveField = saveField;
function saveItem(item, skipStoreChangedEvent) {
    let shouldPublishStoreChangedEvent = !skipStoreChangedEvent;
    // New item
    if (!item.storeId) {
        item.storeId = newCuid();
        // Save
        store_data_1.items[item.storeId] = item;
        // Save StoreItems and StoreFields in properties, but do not publish store changed event.
        saveItem(item, true);
        // Publish
        if (shouldPublishStoreChangedEvent) {
            event_service_1.publish(exports.STORE_CHANGED_EVENT);
        }
        return { item: item, storeHasChanged: true };
    }
    // Existing item in store.
    let itemInStore = store_data_1.items[item.storeId];
    if (itemInStore) {
        let itemChangedInStore = false;
        // Loop all properties.
        for (let attrName in item) {
            if (item.hasOwnProperty(attrName)) {
                const attrValue = item[attrName];
                // Save attribute value as StoreField.
                if (isField(attrValue)) {
                    const skipPublishOfStoreChangedEvent = true;
                    const result = saveField(attrValue, skipPublishOfStoreChangedEvent);
                    itemChangedInStore = itemChangedInStore || result.storeHasChanged;
                    continue;
                }
                // Save attribute as StoreItem.
                if (is_object_1.isObject(attrValue)) {
                    const skipPublishOfStoreChangedEvent = true;
                    const result = saveItem(attrValue, skipPublishOfStoreChangedEvent);
                    itemChangedInStore = itemChangedInStore || result.storeHasChanged;
                    continue;
                }
            }
        }
        // Publish storechangedevent only, when item has changed in the store and we don't have to skip publishing.
        shouldPublishStoreChangedEvent = itemChangedInStore && !skipStoreChangedEvent;
        if (shouldPublishStoreChangedEvent) {
            event_service_1.publish(exports.STORE_CHANGED_EVENT);
        }
        return { item: item, storeHasChanged: itemChangedInStore };
    }
    // Store item not in store, save it.
    store_data_1.items[item.storeId] = item;
    // Save StoreItems and StoreFields in properties, but do not publish store changed event.
    saveItem(item, true);
    // Publish
    if (shouldPublishStoreChangedEvent) {
        event_service_1.publish(exports.STORE_CHANGED_EVENT);
    }
    return { item: item, storeHasChanged: true };
}
exports.saveItem = saveItem;
function saveItems(items) {
    return items;
}
exports.saveItems = saveItems;
//# sourceMappingURL=store.js.map