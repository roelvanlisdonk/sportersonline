"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toSnakeCase(camelCase) {
    return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
}
exports.toSnakeCase = toSnakeCase;
//# sourceMappingURL=to.snake.case.js.map