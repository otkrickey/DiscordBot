"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
require('dotenv').config();
const client = new Discord.Client();
const command_1 = __importDefault(require("./command"));
const private_message_1 = __importDefault(require("./private-message"));
client.on('ready', async function () {
    console.log('The client is ready!');
    // '!ping' | '!test' => 'Pong!'
    command_1.default(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!');
    });
    // '!servers' => Count of Server Members
    command_1.default(client, 'servers', (message) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`);
        });
    });
    // '!cc' | 'clearchannel' => Clear All messages from channel
    command_1.default(client, ['cc', 'clearchannel'], (message) => {
        if (message.member?.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results);
            });
        }
    });
    //  '!status' => Change Status of this Bot
    command_1.default(client, 'status', (message) => {
        client.user?.setPresence(message.content === '!status' ? {} : { activity: { name: message.content, type: 'PLAYING', }, });
    });
    // channelId, text, reactions => Edit First Message of Channel
    // firstMessage(client, '805560753657479231', 'Hello World!!!!', [':x:', ':o:']);
    // '!ping' => 'Pong!'
    private_message_1.default(client, 'ping', 'Pong!');
    // '!createtextchannel' => Create Text Channel to Category
    command_1.default(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel ', '');
        message.guild?.channels.create(name, { type: 'text', }).then((channel) => {
            const categoryId = '807957746572984340';
            channel.setParent(categoryId);
        });
    });
    // '!createvoicechannel' => Create Voice Channel to Category
    command_1.default(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel ', '');
        message.guild?.channels.create(name, { type: 'voice', }).then((channel) => {
            const categoryId = '807957746572984340';
            channel.setParent(categoryId);
            channel.setUserLimit(10);
        });
    });
    // '!embed' => Create Embed Message
    command_1.default(client, 'embed', (message) => {
        const logo = 'https://avatars.githubusercontent.com/u/43507417';
        const embed = new Discord.MessageEmbed()
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
    command_1.default(client, 'serverinfo', function (message) {
        const { guild } = message;
        const { name, region, memberCount, owner } = guild;
        const icon = guild?.iconURL();
        const embed = new Discord.MessageEmbed()
            .setTitle(name)
            .setThumbnail(icon)
            .addFields({ name: 'Region', value: region, inline: true, }, { name: 'Members', value: memberCount, inline: true, }, { name: 'Owner', value: owner?.user.tag, });
        message.channel.send(embed);
    });
    command_1.default(client, 'help', (message) => {
        message.channel.send(`
いずれ書くから待ってて～
These are my supported commands:
**!help** - Displays the help menu
**!add <num1> <num2>** - Adds two numbers
**!sub <num1> <num2>** - Subtracts two numbers
`);
    });
    client.user?.setPresence({ activity: { name: `"${process.env.prefix}help" for help`, }, });
});
client.login(process.env.TOKEN);
//# sourceMappingURL=index.js.map