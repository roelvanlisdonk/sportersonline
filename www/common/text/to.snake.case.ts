export function toSnakeCase(camelCase: string): string {
    return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
}