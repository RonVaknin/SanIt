export declare class TestRunner {
    private static tests;
    private static beforeEachFns;
    private static afterEachFns;
    static describe: (name: string, fn: () => void) => void;
    static test: (name: string, fn: () => void) => void;
    static beforeEach: (fn: () => void) => void;
    static afterEach: (fn: () => void) => void;
    static expect: (actual: any) => {
        toBe: (expected: any, failureMessage?: string) => void;
        toContain: (expected: any, value?: any) => void;
        not: {
            toBe: (expected: any, value?: any) => void;
            toContain: (expected: any, value?: any) => void;
        };
    };
    static runTests(): Promise<boolean>;
}
export declare const describe: (name: string, fn: () => void) => void, test: (name: string, fn: () => void) => void, expect: (actual: any) => {
    toBe: (expected: any, failureMessage?: string) => void;
    toContain: (expected: any, value?: any) => void;
    not: {
        toBe: (expected: any, value?: any) => void;
        toContain: (expected: any, value?: any) => void;
    };
}, beforeEach: (fn: () => void) => void, afterEach: (fn: () => void) => void;
