let _idCounter: number = 0;
let _tests: Test[] = [];

export function beEqualTo(actual: any, expected: any) {
    return actual === expected;
}

function byResult(a:Test, b:Test): number {
    if(a.result === b.result) {
        return 0;
    }

    // Failure tests should be at the bottom.
    if(a.result === false && b.result === true){
        return 1;
    }
    
    // Success tests should be on top.
    if(a.result === true && b.result === false){
        return -1;
    }
}

export function execute() {
    for(let i = 0, length = _tests.length;i < length;i++) {
        executeTest(_tests[i]);
    }

    _tests = _tests.sort(byResult);

    for(let i = 0, length = _tests.length;i < length;i++) {
        showTestResult(_tests[i]);
    }
}

function executeTest(test: Test) {
    const inputAsString = JSON.stringify(test.input);
    const expectedAsString = JSON.stringify(test.expected);
    const subject = test.subject;
    const assert = test.assert;
    test.actual = subject.apply(null, test.input);
    const actualAsString = JSON.stringify(test.actual);
    
    test.result = test.assert.apply(test, [actualAsString, expectedAsString]);
}

export function given(...input: any[]): GivenResult {
    
    // Create new test object.
    _idCounter = _idCounter + 1;
    const test: Test = {
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

function it(this: GivenResult, fn: (...args: any[]) => any): ItResult {
    const self: Test = <any>this;
    self.subject = fn;
    return <ItResult><any>self;
}

function should(this: Test, fn:(this: Test, actual: any, expected: any) => boolean, expected: any): void {
    const self: Test = this;
    self.assert = fn;
    self.expected = expected;
    _tests.push(self);
}

function showTestResult(test: Test): void {
    const inputAsString = JSON.stringify(test.input);
    const expectedAsString = JSON.stringify(test.expected);
    const subject = test.subject;
    const assert = test.assert;
    const actualAsString = JSON.stringify(test.actual);

    if(test.result) {
        console.log(`Success: Given input ${inputAsString} it [${subject.name}] should [${assert.name}] expected [${expectedAsString}].`)
    }
    else {
        console.log(`Failure: Given input ${inputAsString} it [${subject.name}] should [${assert.name}] expected [${expectedAsString}], but was [${actualAsString}].`)
    }
}



export interface GivenResult {
    it: (this: GivenResult, fn: (...args: any[]) => any) => ItResult;
}

export interface ItResult {
    should: (this: ItResult, assertFn:(actual: any, expected: any) => boolean, expected: any) => void;
}

/**
 * Each test will be stored as an ITest object.
 * It will be kept private, to guide developers when using the fluent interface, choosing the correct functions.
 */
interface Test extends GivenResult, ItResult {
    actual?: any;
    assert?: (this: Test, actual: any, expected: any) => boolean;
    id: number;
    input: any[];
    result?: boolean;
    subject?: (...args: any[]) => any;
    expected?: any;
}