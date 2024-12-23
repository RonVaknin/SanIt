type ValidationRule<T> = {
    name?: string;
    validate: (value: T) => boolean;
    message: string;
    dynamicMessage?: (value: T) => string;
};

type StringValidationPresets = {
    email: ValidationRule<string>;
    phone: ValidationRule<string>;
    noHtml: ValidationRule<string>;
    noSql: ValidationRule<string>;
    minLength: (min: number) => ValidationRule<string>;
    maxLength: (max: number) => ValidationRule<string>;
    regex: (pattern: RegExp, message: string) => ValidationRule<string>;
};

type NumberValidationPresets = {
    positive: ValidationRule<number>;
    integer: ValidationRule<number>;
    range: (min: number, max: number) => ValidationRule<number>;
    currency: ValidationRule<number>;
};

export class Validator {
    private static readonly SQL_INJECTION_PATTERNS = [
        /(\b(select|insert|update|delete|drop|union|exec|declare|cast)\b)|[;'"`\\]/i,
        /--/,
        /\/\*/,
        /\*\//
    ];

    static readonly StringRules: StringValidationPresets = {
        email: {
            name: 'email',
            validate: (value) => /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(value),
            message: 'Invalid email format'
        },
        phone: {
            name: 'phone',
            validate: (value) => /^\+?[\d\s-()]{8,}$/.test(value),
            message: 'Invalid phone number format'
        },
        noHtml: {
            name: 'noHtml',
            validate: (value) => !/<[^>]*>/g.test(value),
            message: 'HTML tags are not allowed'
        },
        noSql: {
            name: 'noSql',
            validate: (value) => !Validator.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value)),
            message: 'String contains potentially unsafe SQL patterns'
        },
        minLength: (min: number): ValidationRule<string> => ({
            name: 'minLength',
            validate: (value) => value.length >= min,
            message: `Minimum length is ${min} characters`
        }),
        maxLength: (max: number): ValidationRule<string> => ({
            name: 'maxLength',
            validate: (value) => value.length <= max,
            message: `Maximum length is ${max} characters`
        }),
        regex: (pattern: RegExp, message: string): ValidationRule<string> => ({
            name: 'regex',
            validate: (value) => pattern.test(value),
            message
        })
    };

    static readonly NumberRules: NumberValidationPresets = {
        positive: {
            name: 'positive',
            validate: (value) => value >= 0,
            message: 'Number must be positive or zero'
        },
        integer: {
            name: 'integer',
            validate: (value) => {
                return Number.isInteger(value) && 
                       value >= Number.MIN_SAFE_INTEGER && 
                       value <= Number.MAX_SAFE_INTEGER;
            },
            message: 'Number must be a valid integer within safe integer limits'
        },
        range: (min: number, max: number): ValidationRule<number> => ({
            name: 'range',
            validate: (value) => value >= min && value <= max,
            message: `Number must be between ${min} and ${max}`
        }),
        currency: {
            name: 'currency',
            validate: (value) => {
                if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return false;
                return Math.round(value * 100) / 100 === value;
            },
            message: 'Invalid currency format (maximum 2 decimal places)'
        }
    };

    static validate<T>(value: T, rules: ValidationRule<T>[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (const rule of rules) {
            if (!rule.validate(value)) {
                errors.push(rule.dynamicMessage ? rule.dynamicMessage(value) : rule.message);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static sanitizeString(value: string): string {
        return value
            .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
                switch (char) {
                    case "\0": return "\\0";
                    case "\x08": return "\\b";
                    case "\x09": return "\\t";
                    case "\x1a": return "\\z";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\"": return "\\\"";
                    case "'": return "\\'";
                    case "\\": return "\\\\";
                    case "%": return "\\%";
                    default: return char;
                }
            })
            .replace(/[<>]/g, '')
            .replace(/&/g, '&amp;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }
}