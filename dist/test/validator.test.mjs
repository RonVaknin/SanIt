import { describe, test, expect } from './test-utils.mjs';
import { Validator } from '../src/validator.mjs';
describe('DataGuard String Validation', () => {
    describe('email validation', () => {
        test('valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'user+label@domain.com',
                '123@domain.com',
                'email@sub.domain.com',
            ];
            validEmails.forEach(email => {
                const result = Validator.validate(email, [Validator.StringRules.email]);
                expect(result.isValid).toBe(true, email);
            });
        });
        test('invalid email addresses', () => {
            const invalidEmails = [
                'test@',
                '@domain.com',
                'test@.com',
                'test@domain..com',
                'test space@domain.com',
                '',
            ];
            invalidEmails.forEach(email => {
                const result = Validator.validate(email, [Validator.StringRules.email]);
                expect(result.isValid).toBe(false, email);
            });
        });
    });
    describe('SQL injection prevention', () => {
        test('detects SQL injection attempts', () => {
            const maliciousInputs = [
                "DROP TABLE users",
                "SELECT * FROM users",
                "1'; DELETE FROM users; --",
                "1 UNION SELECT * FROM passwords",
                "/* comment */",
                "admin'--",
            ];
            maliciousInputs.forEach(input => {
                const result = Validator.validate(input, [Validator.StringRules.noSql]);
                expect(result.isValid).toBe(false, input);
            });
        });
    });
});
describe('DataGuard Number Validation', () => {
    describe('currency validation', () => {
        test('valid currency values', () => {
            const validCurrency = [
                0,
                100,
                10.99,
                0.01,
                999999.99,
                -10.50,
            ];
            validCurrency.forEach(value => {
                const result = Validator.validate(value, [Validator.NumberRules.currency]);
                expect(result.isValid).toBe(true, value.toString());
            });
        });
        test('invalid currency values', () => {
            const invalidCurrency = [
                10.999,
                0.001,
                NaN,
                Infinity,
                -Infinity,
            ];
            invalidCurrency.forEach(value => {
                const result = Validator.validate(value, [Validator.NumberRules.currency]);
                expect(result.isValid).toBe(false, value.toString());
            });
        });
    });
});
describe('DataGuard String Sanitization', () => {
    test('sanitizes special characters', () => {
        const input = 'Hello\n\r\t"\'\\%World';
        const sanitized = Validator.sanitizeString(input);
        expect(sanitized).toBe('Hello\\n\\r\\t\\"\\\'\\\\\\%World', input);
    });
    test('removes HTML tags', () => {
        const input = '<script>alert("xss")</script><p>Hello</p>';
        const sanitized = Validator.sanitizeString(input);
        expect(sanitized.includes('<script>')).toBe(false, input);
        expect(sanitized.includes('</script>')).toBe(false, input);
    });
});
