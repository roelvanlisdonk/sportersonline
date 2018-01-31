import { StoreField, StoreItem } from './store';

export interface Account extends StoreItem {
    isAuthenticated: StoreField<boolean>;
    name: StoreField<string>;
    password: StoreField<string>;
}

export interface AppData extends StoreItem {
    account: Account;
}