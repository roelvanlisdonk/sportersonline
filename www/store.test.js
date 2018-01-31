"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_framework_1 = require("./test.framework");
const store_1 = require("./store");
test_framework_1.given({})
    .it(store_1.hasChanged)
    .should(test_framework_1.beEqualTo, false);
test_framework_1.given({ description: "Not a StoreField", items: ["Not a StoreField", "Not a StoreField"] })
    .it(store_1.hasChanged)
    .should(test_framework_1.beEqualTo, false);
test_framework_1.given({ description: { storeId: "1", value: "My second description", previousValue: null }, items: ["Not a StoreField", "Not a StoreField"] })
    .it(store_1.hasChanged)
    .should(test_framework_1.beEqualTo, true);
//# sourceMappingURL=store.test.js.map