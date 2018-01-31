"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _listeners = [];
/**
 * Publish an event.
 * All subscribers will be notified.
 * @param name - The name of the event and is case sensitive.
 * @param data - This data will be passed to the event handler.
 */
function publish(name, data) {
    const listeners = _listeners.filter((x) => x.name === name);
    if (listeners && listeners.length > 0) {
        for (let i = 0, length = listeners.length; i < length; i++) {
            const listener = listeners[i];
            if (listener && listener.handler) {
                listener.handler.call(null, data, listener.subscriberData);
            }
        }
    }
}
exports.publish = publish;
/**
 * Subscribe to be notified, when an event is published, replaces event subscribers with same name + subscriber data
 * @param name - The name of the event and is case sensitive.
 * @param handler - See IListener.
 * @param subscriberData - This data will be passed to the event handler, when it is called.
 */
function subscribe(name, handler, subscriberData) {
    const newlistener = {
        handler: handler,
        name: name,
        subscriberData: subscriberData
    };
    const subscriberDataHash = JSON.stringify(newlistener.subscriberData);
    const length = _listeners.length;
    let listenerReplaced = false;
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const listener = _listeners[i];
            const listenerName = listener.name;
            const listenerSubscriberDataHash = JSON.stringify(listener.subscriberData);
            if (listenerName === name && listenerSubscriberDataHash === subscriberDataHash) {
                _listeners[i] = newlistener;
                listenerReplaced = true;
                break;
            }
        }
    }
    if (!listenerReplaced) {
        _listeners.push(newlistener);
    }
    return newlistener;
}
exports.subscribe = subscribe;
/**
 * Remove all event listener subscription on the given name.
 * @param name - The name of the event listener.
 */
function unsubscribe(listener) {
    _listeners.splice(_listeners.indexOf(listener));
}
exports.unsubscribe = unsubscribe;
//# sourceMappingURL=event.service.js.map