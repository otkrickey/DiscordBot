import Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

import command from './command';
import firstMessage from './first-message';
import privateMessage from './private-message';

client.on('ready', async function () {
    console.log('The client is ready!');

    // '!ping' | '!test' => 'Pong!'
    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!')
    });

    // '!servers' => Count of Server Members
    command(client, 'servers', (message) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`);
        });
    });

    // '!cc' | 'clearchannel' => Clear All messages from channel
    command(client, ['cc', 'clearchannel'], (message) => {
        if (message.member?.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                (message.channel as Discord.TextChannel | Discord.NewsChannel).bulkDelete(results);
            });
        }
    });

    //  '!status' => Change Status of this Bot
    command(client, 'status', (message) => {
        client.user?.setPresence(message.content === '!status' ? {} : { activity: { name: message.content, type: 'PLAYING', }, });
    });

    // channelId, text, reactions => Edit First Message of Channel
    // firstMessage(client, '805560753657479231', 'Hello World!!!!', [':x:', ':o:']);

    // '!ping' => 'Pong!'
    privateMessage(client, 'ping', 'Pong!');

    // '!createtextchannel' => Create Text Channel to Category
    command(client, 'createtextchannel', (message) => {
        const name = message.content.replace('!createtextchannel ', '');
        message.guild?.channels.create(name, { type: 'text', }).then((channel) => {
            const categoryId = '807957746572984340';
            channel.setParent(categoryId);
        });
    })

    // '!createvoicechannel' => Create Voice Channel to Category
    command(client, 'createvoicechannel', (message) => {
        const name = message.content.replace('!createvoicechannel ', '');
        message.guild?.channels.create(name, { type: 'voice', }).then((channel) => {
            const categoryId = '807957746572984340';
            channel.setParent(categoryId);
            channel.setUserLimit(10);
        });
    });

    // '!embed' => Create Embed Message
    command(client, 'embed', (message) => {
        const logo = 'https://avatars.githubusercontent.com/u/43507417';
        const embed = new Discord.MessageEmbed()
            .setTitle('TITLE')
            .setURL('https://github.com/otkrickey/TwitchClipEditor')
            .setAuthor('otkrickey')
            .setImage(logo)
            .setThumbnail(logo)
            .setColor('#00AAFF')
            .addFields(
                { name: 'FIeld 1', value: 'Hello world', inline: true, },
                { name: 'Field 2', value: 'Hello world', inline: true, },
                { name: 'Field 3', value: 'Hello world', inline: true, },
            )
            .setFooter('This is a footer');
        message.channel.send(embed);
    });

    command(client, 'serverinfo', function (message) {
        const { guild } = message;
        const { name, region, memberCount, owner } = guild as Discord.Guild;
        const icon = guild?.iconURL();
        const embed = new Discord.MessageEmbed()
            .setTitle(name)
            .setThumbnail(icon as string)
            .addFields(
                { name: 'Region', value: region, inline: true, },
                { name: 'Members', value: memberCount, inline: true, },
                { name: 'Owner', value: owner?.user.tag, }
            );
        message.channel.send(embed);
    })
});

client.login(process.env.TOKEN);