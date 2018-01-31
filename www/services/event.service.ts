const _listeners:Listener[] = [];

/**
 * Publish an event.
 * All subscribers will be notified.
 * @param name - The name of the event and is case sensitive.
 * @param data - This data will be passed to the event handler.
 */
export function publish(name: string, data?: any): void {
    const listeners: Array<Listener> = _listeners.filter((x) => x.name === name);
    if (listeners && listeners.length > 0)
    {
        for (let i = 0, length = listeners.length; i < length; i++)
        {
            const listener: Listener = listeners[i];

            if (listener && listener.handler) {
                listener.handler.call(null, data, listener.subscriberData);
            }
        }
    }
}

/**
 * Subscribe to be notified, when an event is published, replaces event subscribers with same name + subscriber data
 * @param name - The name of the event and is case sensitive.
 * @param handler - See IListener.
 * @param subscriberData - This data will be passed to the event handler, when it is called.
 */
export function subscribe(name: string, handler: (publisherData?: any, subscriberData?: any) => void, subscriberData?: any): Listener {
    const newlistener = {
        handler: handler,
        name: name,
        subscriberData: subscriberData
    };
    const subscriberDataHash = JSON.stringify(newlistener.subscriberData);
    const length = _listeners.length;
    let listenerReplaced: boolean = false;

    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const listener: Listener = _listeners[i];
            const listenerName: string = listener.name;
            const listenerSubscriberDataHash: string = JSON.stringify(listener.subscriberData);

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

/**
 * Remove all event listener subscription on the given name.
 * @param name - The name of the event listener.
 */
export function unsubscribe(listener: Listener) {
    _listeners.splice(_listeners.indexOf(listener));
}

export interface Listener {
    /*  This function will be called when an event is published.
        *  @param publisherData -  Data passed from the publisher to the EventHandler, when the event is published, supplied to the listener a publish time.
        *  @param subscriberData - Data passed from the subscriber to the EventHandler, when the event is published, supplied to the listener at subscription time.
        */
    handler: (publisherData?: any, subscriberData?: any) => void;
    name: string;
    subscriberData?: any;
}