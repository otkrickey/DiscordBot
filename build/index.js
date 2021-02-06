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
const channel = process.env.CHANNEL;
const node_emoji_1 = __importDefault(require("node-emoji"));
function EMOJI(text) { const _c = text ? node_emoji_1.default.find(text) : undefined; return _c ? _c.emoji : undefined; }
function Command(client, aliases, callback) {
    client.on('message', function (message) {
        const { content } = message;
        for (const alias of (typeof aliases === 'string') ? [aliases] : aliases) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running ${command}`);
                callback(message);
            }
        }
    });
}
function AddReactions(message, reactions) {
    const reaction = EMOJI(reactions.shift());
    if (reaction) {
        message.react(reaction);
    }
    if (reactions.length > 0) {
        return AddReactions(message, reactions);
    }
}
async function StartVoting(client, id, text, reactions = []) {
    if (id) {
        const _channel = await client.channels.fetch(id);
        const channel = _channel;
        channel.send(`[vote] "${text}"`).then(message => { AddReactions(message, reactions); });
    }
}
function DirectMessage(client, req, res) {
    client.on('message', function (message) {
        if (message.channel.type === 'dm' && message.content.toLowerCase() === req.toLowerCase()) {
            message.author.send(res);
        }
    });
}
client.on('ready', function () {
    console.log('The Client is ready');
    Command(client, 'vote', function (message) {
        const content = message.content.replace('!vote ', '');
        const Emojis = ['o', 'x'];
        message.delete();
        StartVoting(client, channel, content, Emojis);
    });
    Command(client, ['ping'], function (message) {
        message.channel.send('Pong!');
    });
    Command(client, ['cc', 'clearChannel'], function (message) {
        if (message.member?.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results);
            });
        }
    });
    Command(client, 'status', function (message) {
        const content = message.content.replace('!status', '');
        client.user?.setPresence({ activity: { name: content, type: 0 } });
    });
    DirectMessage(client, 'ping', 'pong');
    Command(client, 'dm', function (message) {
        client.users.fetch(message.author.id).then((user) => { user.send('Hello World.'); });
    });
    Command(client, 'embed', (message) => {
        const logo = 'https://avatars.githubusercontent.com/u/43507417';
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle('TITLE')
            .setURL('https://github.com/otkrickey/TwitchClipEditor')
            .setAuthor('otkrickey')
            .setImage(logo)
            .setThumbnail(logo)
            .setColor('#00AAFF')
            .addFields({ name: 'FIeld 1', value: 'Hello world', inline: true, }, { name: 'Field 2', value: 'Hello world', inline: true, }, { name: 'Field 3', value: 'Hello world', inline: true, })
            .setFooter('This is a footer');
        message.channel.send(embed);
    });
    Command(client, 'server', (message) => {
        const { guild } = message;
        if (guild) {
            const { name, region, memberCount, owner } = guild;
            const icon = guild?.iconURL();
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle(name)
                .setThumbnail(icon)
                .addFields({ name: 'Region', value: region, inline: true, }, { name: 'Members', value: memberCount, inline: true, }, { name: 'Owner', value: owner?.user.tag, });
            message.channel.send(embed);
        }
    });
});
client.login(token);
//# sourceMappingURL=index.js.map