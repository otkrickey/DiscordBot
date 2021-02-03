"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
const config_json_1 = require("./config.json");
const command = (client, aliases, callback) => {
    const _aliases = (typeof aliases === 'string') ? [aliases] : aliases;
    client.on('message', function (message) {
        const { content } = message;
        _aliases.forEach(function (alias) {
            const command = `${config_json_1.prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running the command ${command}`);
                callback(message);
            }
        });
    });
};
client.on('ready', function () {
    console.log('The Client is ready');
    command(client, 'ping', function (message) {
        message.channel.send('Pong!');
    });
});
client.login(config_json_1.token);
