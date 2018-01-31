import { beEqualTo, given } from "./test.framework";
import { hasChanged, StoreField } from './store';

given({})
.it(hasChanged)
.should(beEqualTo, false);

given({description: "Not a StoreField", items: ["Not a StoreField", "Not a StoreField"]})
.it(hasChanged)
.should(beEqualTo, false);

given({description: <StoreField<string>>{storeId: "1", value: "My second description", previousValue: null}, items: ["Not a StoreField", "Not a StoreField"]})
.it(hasChanged)
.should(beEqualTo, true);