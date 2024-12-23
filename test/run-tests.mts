import { TestRunner } from './test-utils.mjs';
import './validator.test.mjs';

async function runTests() {
    const success = await TestRunner.runTests();
    process.exit(success ? 0 : 1);
}

runTests();