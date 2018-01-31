"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_framework_1 = require("../../test.framework");
const is_object_1 = require("./is.object");
test_framework_1.given(undefined).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given(null).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given(true).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given(false).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given(6).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given([]).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given(function someFn() { }).it(is_object_1.isObject).should(test_framework_1.beEqualTo, false);
test_framework_1.given({}).it(is_object_1.isObject).should(test_framework_1.beEqualTo, true);
test_framework_1.given({ someProp: true }).it(is_object_1.isObject).should(test_framework_1.beEqualTo, true);
//# sourceMappingURL=is.object.test.js.map