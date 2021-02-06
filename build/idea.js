"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
function message(client, aliases, callback) {
    client.on('message', function (message) {
        if (message.content.startsWith(`${prefix}`)) {
            message.content = message.content.replace(`${prefix}`, '');
            command(message, aliases, callback);
        }
    });
}
function command(message, aliases, callback) {
    const { content } = message;
    content.replace(`${prefix}`, '');
    for (const alias of (typeof aliases === 'string') ? [aliases] : aliases) {
        if (content.startsWith(`${alias} `) || content === alias) {
            console.log(`Running ${alias}`);
            callback(message);
        }
    }
}
client.on('ready', function () {
    console.log('The Client is ready');
    const MainChannel = client.channels.cache.get('805560753657479231');
    MainChannel.send('Bot Started');
    message(client, 'ping', function (message) {
        message.channel.send('Pong');
    });
});
client.login(token);
//# sourceMappingURL=idea.js.map