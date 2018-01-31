"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _idCounter = 0;
let _tests = [];
function beEqualTo(actual, expected) {
    return actual === expected;
}
exports.beEqualTo = beEqualTo;
function byResult(a, b) {
    if (a.result === b.result) {
        return 0;
    }
    // Failure tests should be at the bottom.
    if (a.result === false && b.result === true) {
        return 1;
    }
    // Success tests should be on top.
    if (a.result === true && b.result === false) {
        return -1;
    }
}
function execute() {
    for (let i = 0, length = _tests.length; i < length; i++) {
        executeTest(_tests[i]);
    }
    _tests = _tests.sort(byResult);
    for (let i = 0, length = _tests.length; i < length; i++) {
        showTestResult(_tests[i]);
    }
}
exports.execute = execute;
function executeTest(test) {
    const inputAsString = JSON.stringify(test.input);
    const expectedAsString = JSON.stringify(test.expected);
    const subject = test.subject;
    const assert = test.assert;
    test.actual = subject.apply(null, test.input);
    const actualAsString = JSON.stringify(test.actual);
    test.result = test.assert.apply(test, [actualAsString, expectedAsString]);
}
function given(...input) {
    // Create new test object.
    _idCounter = _idCounter + 1;
    const test = {
        id: _idCounter,
        input: input,
        it: it,
        should: should
    };
    // Make "this" work.
    test.it = it.bind(test);
    test.should = should.bind(test);
    return test;
}
exports.given = given;
function it(fn) {
    const self = this;
    self.subject = fn;
    return self;
}
function should(fn, expected) {
    const self = this;
    self.assert = fn;
    self.expected = expected;
    _tests.push(self);
}
function showTestResult(test) {
    const inputAsString = JSON.stringify(test.input);
    const expectedAsString = JSON.stringify(test.expected);
    const subject = test.subject;
    const assert = test.assert;
    const actualAsString = JSON.stringify(test.actual);
    if (test.result) {
        console.log(`Success: Given input ${inputAsString} it [${subject.name}] should [${assert.name}] expected [${expectedAsString}].`);
    }
    else {
        console.log(`Failure: Given input ${inputAsString} it [${subject.name}] should [${assert.name}] expected [${expectedAsString}], but was [${actualAsString}].`);
    }
}
//# sourceMappingURL=test.framework.js.map