"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
exports.default = (client, triggerText, replyText) => {
    client.on('message', (message) => {
        if (message.channel.type === 'dm' && message.content.toLowerCase() === triggerText.toLowerCase()) {
            message.author.send(replyText);
        }
    });
};
//# sourceMappingURL=private-message.js.map