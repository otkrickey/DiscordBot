"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deleteMessage = (messages) => {
    var _a;
    (_a = messages.shift()) === null || _a === void 0 ? void 0 : _a.delete();
    return messages;
};
exports.default = (messages) => {
    const interval = setInterval(function () {
        messages = deleteMessage(messages);
        if (!messages.length) {
            clearInterval(interval);
        }
    }, 1000);
};
//# sourceMappingURL=delete-message.js.map