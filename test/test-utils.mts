export class TestRunner {
    private static tests: Array<{ name: string; fn: () => void }> = [];
    private static beforeEachFns: Array<() => void> = [];
    private static afterEachFns: Array<() => void> = [];
    
    static describe = (name: string, fn: () => void) => {
        console.log(`\n\x1b[1m${name}\x1b[0m`);
        fn();
    }

    static test = (name: string, fn: () => void) => {
        this.tests.push({ name, fn });
    }

    static beforeEach = (fn: () => void) => {
        this.beforeEachFns.push(fn);
    }

    static afterEach = (fn: () => void) => {
        this.afterEachFns.push(fn);
    }

    static expect = (actual: any) => {
        return {
            toBe: (expected: any, failureMessage?: string) => {
                if (actual !== expected) {
                    const message = failureMessage !== undefined 
                        ? `Expected ${actual} to be ${expected} "${failureMessage}"`
                        : `Expected ${actual} to be ${expected}`;
                    console.error(message);
                    throw new Error(message);
                }
            },
            toContain: (expected: any, value?: any) => {
                if (!actual.includes(expected)) {
                    const message = value !== undefined 
                        ? `Expected ${actual} to contain ${expected} for input "${value}"`
                        : `Expected ${actual} to contain ${expected}`;
                    console.error(message);
                    throw new Error(message);
                }
            },
            not: {
                toBe: (expected: any, value?: any) => {
                    if (actual === expected) {
                        const message = value !== undefined 
                            ? `Expected ${actual} not to be ${expected} for input "${value}"`
                            : `Expected ${actual} not to be ${expected}`;
                        console.error(message);
                        throw new Error(message);
                    }
                },
                toContain: (expected: any, value?: any) => {
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
    }

    static async runTests() {
        let passed = 0;
        let failed = 0;
        const errors: Array<{ name: string; error: Error }> = [];

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
            } catch (error) {
                console.log(`  ✗ \x1b[31m${test.name}\x1b[0m`);
                errors.push({ name: test.name, error: error as Error });
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