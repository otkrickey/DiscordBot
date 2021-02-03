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
const command = (client, aliases, callback) => {
    const _aliases = (typeof aliases === 'string') ? [aliases] : aliases;
    client.on('message', function (message) {
        const { content } = message;
        _aliases.forEach(function (alias) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running the command ${command}`);
                callback(message);
            }
        });
    });
};
client.on('ready', function () {
    console.log('The Client is ready');
    command(client, ['ping', 'test'], function (message) {
        message.channel.send('Pong!');
    });
    command(client, 'servers', function (message) {
        client.guilds.cache.forEach(function (guild) {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount}`);
        });
    });
    command(client, ['cc', 'clearChannel'], function (message) {
        if (message.member?.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results);
            });
        }
    });
    command(client, 'status', function (message) {
        const content = message.content.replace('!status', '');
        client.user?.setPresence({ activity: { name: content, type: 0 } });
    });
});
client.login(token);
