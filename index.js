"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client();
const command_js_1 = require("command.js");
require('dotenv').config();
const token = process.env.TOKEN;
client.on('ready', function () {
    console.log('The Client is ready');
    command_js_1.command(client, 'vote', function (message) {
        const content = message.content.replace('!vote ', '');
        const Emojis = ['o', 'x'];
        message.delete();
        command_js_1.StartVoting(client, '805560753657479231', content, Emojis);
    });
    command_js_1.command(client, ['ping', 'test'], function (message) {
        message.channel.send('Pong!');
    });
    command_js_1.command(client, 'servers', function (message) {
        client.guilds.cache.forEach(function (guild) {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount}`);
        });
    });
    command_js_1.command(client, ['cc', 'clearChannel'], function (message) {
        if (message.member?.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results);
            });
        }
    });
    command_js_1.command(client, 'status', function (message) {
        const content = message.content.replace('!status', '');
        client.user?.setPresence({ activity: { name: content, type: 0 } });
    });
});
client.login(token);
