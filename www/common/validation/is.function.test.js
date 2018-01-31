"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_framework_1 = require("../../test.framework");
const is_function_1 = require("./is.function");
test_framework_1.given(undefined).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
test_framework_1.given(null).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
test_framework_1.given(true).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
test_framework_1.given(false).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
test_framework_1.given(6).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
test_framework_1.given({}).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, false);
function someFn() {
}
test_framework_1.given(someFn).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, true);
test_framework_1.given(function () { }).it(is_function_1.isFunction).should(test_framework_1.beEqualTo, true);
//# sourceMappingURL=is.function.test.js.map