"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
require('dotenv').config();
const command = (client, aliases, callback) => {
    const _aliases = (typeof aliases === 'string') ? [aliases] : aliases;
    client.on('message', function (message) {
        const { content } = message;
        _aliases.forEach(function (alias) {
            const command = `${process.env.PREFIX}${alias}`;
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
client.login(process.env.TOKEN);
