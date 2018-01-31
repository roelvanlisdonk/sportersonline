import { beEqualTo, given } from "../../test.framework";
import { isFunction } from "./is.function";

given(undefined).it(isFunction).should(beEqualTo, false);
given(null).it(isFunction).should(beEqualTo, false);
given(true).it(isFunction).should(beEqualTo, false);
given(false).it(isFunction).should(beEqualTo, false);
given(6).it(isFunction).should(beEqualTo, false);
given({}).it(isFunction).should(beEqualTo, false);

function someFn() {

}
given(someFn).it(isFunction).should(beEqualTo, true);
given(function(){}).it(isFunction).should(beEqualTo, true);
