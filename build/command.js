"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const prefix = process.env.PREFIX;
exports.default = (client, aliases, callback) => {
    client.on('message', function (message) {
        const { content } = message;
        for (const alias of (typeof aliases === 'string') ? [aliases] : aliases) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running ${command}`);
                message.content = message.content.replace(`${prefix}${alias} `, '');
                callback(message);
            }
        }
    });
};
//# sourceMappingURL=command.js.map