import { beEqualTo, given } from "../../test.framework";
import { isObject } from "./is.object";



given(undefined).it(isObject).should(beEqualTo, false);
given(null).it(isObject).should(beEqualTo, false);
given(true).it(isObject).should(beEqualTo, false);
given(false).it(isObject).should(beEqualTo, false);
given(6).it(isObject).should(beEqualTo, false);
given([]).it(isObject).should(beEqualTo, false);
given(function someFn() {}).it(isObject).should(beEqualTo, false);

given({}).it(isObject).should(beEqualTo, true);
given({ someProp: true }).it(isObject).should(beEqualTo, true);
