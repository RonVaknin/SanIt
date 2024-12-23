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
export declare class Validator {
    private static readonly SQL_INJECTION_PATTERNS;
    static readonly StringRules: StringValidationPresets;
    static readonly NumberRules: NumberValidationPresets;
    static validate<T>(value: T, rules: ValidationRule<T>[]): {
        isValid: boolean;
        errors: string[];
    };
    static sanitizeString(value: string): string;
}
export {};
