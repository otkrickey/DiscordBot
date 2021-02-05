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
const node_emoji_1 = __importDefault(require("node-emoji"));
const EMOJI = (text) => {
    const _c = text ? node_emoji_1.default.find(text) : undefined;
    return _c ? _c.emoji : undefined;
};
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
const AddReactions = (message, reactions) => {
    const reaction = EMOJI(reactions.shift());
    if (reaction) {
        message.react(reaction);
    }
    if (reactions.length > 0) {
        return AddReactions(message, reactions);
    }
};
const StartVoting = async (client, id, text, reactions = []) => {
    const _id = (typeof id === 'string') ? id : String(id);
    const _channel = await client.channels.fetch(_id);
    const channel = _channel;
    channel.send(`[vote] "${text}"`).then(message => { AddReactions(message, reactions); });
};
client.on('ready', function () {
    console.log('The Client is ready');
    command(client, 'vote', function (message) {
        const content = message.content.replace('!vote ', '');
        const Emojis = ['o', 'x'];
        message.delete();
        StartVoting(client, '805560753657479231', content, Emojis);
    });
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
