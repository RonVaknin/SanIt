export class TestRunner {
    static tests = [];
    static beforeEachFns = [];
    static afterEachFns = [];
    static describe = (name, fn) => {
        console.log(`\n\x1b[1m${name}\x1b[0m`);
        fn();
    };
    static test = (name, fn) => {
        this.tests.push({ name, fn });
    };
    static beforeEach = (fn) => {
        this.beforeEachFns.push(fn);
    };
    static afterEach = (fn) => {
        this.afterEachFns.push(fn);
    };
    static expect = (actual) => {
        return {
            toBe: (expected, failureMessage) => {
                if (actual !== expected) {
                    const message = failureMessage !== undefined
                        ? `Expected ${actual} to be ${expected} "${failureMessage}"`
                        : `Expected ${actual} to be ${expected}`;
                    console.error(message);
                    throw new Error(message);
                }
            },
            toContain: (expected, value) => {
                if (!actual.includes(expected)) {
                    const message = value !== undefined
                        ? `Expected ${actual} to contain ${expected} for input "${value}"`
                        : `Expected ${actual} to contain ${expected}`;
                    console.error(message);
                    throw new Error(message);
                }
            },
            not: {
                toBe: (expected, value) => {
                    if (actual === expected) {
                        const message = value !== undefined
                            ? `Expected ${actual} not to be ${expected} for input "${value}"`
                            : `Expected ${actual} not to be ${expected}`;
                        console.error(message);
                        throw new Error(message);
                    }
                },
                toContain: (expected, value) => {
                    if (actual.includes(expected)) {
                        const message = value !== undefined
                            ? `Expected ${actual} not to contain ${expected} for input "${value}"`
                            : `Expected ${actual} not to contain ${expected}`;
                        console.error(message);
                        throw new Error(message);
                    }
                }
            }
        };
    };
    static async runTests() {
        let passed = 0;
        let failed = 0;
        const errors = [];
        for (const test of this.tests) {
            try {
                for (const beforeFn of this.beforeEachFns) {
                    await beforeFn();
                }
                await test.fn();
                for (const afterFn of this.afterEachFns) {
                    await afterFn();
                }
                console.log(`  ✓ \x1b[32m${test.name}\x1b[0m`);
                passed++;
            }
            catch (error) {
                console.log(`  ✗ \x1b[31m${test.name}\x1b[0m`);
                errors.push({ name: test.name, error: error });
                failed++;
            }
        }
        console.log(`\n\x1b[1mResults:\x1b[0m`);
        console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
        console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
        if (errors.length > 0) {
            console.log('\n\x1b[1mFailures:\x1b[0m');
            errors.forEach(({ name, error }) => {
                console.log(`\n\x1b[31m${name}:\x1b[0m`);
                console.log(`  ${error.message}`);
            });
        }
        this.tests = [];
        this.beforeEachFns = [];
        this.afterEachFns = [];
        return failed === 0;
    }
}
export const { describe, test, expect, beforeEach, afterEach } = TestRunner;
