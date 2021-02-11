import Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

import command from './command';
import firstMessage from './first-message';
import privateMessage from './private-message';
import roleClaim from './role-claim';
import vote from './vote';


client.setMaxListeners(0)

client.on('ready', async function () {
    console.log('The client is ready!');
    client.user?.setPresence({ activity: { name: `"${process.env.PREFIX}help" for help`, }, });
    // (client.channels.cache.find(channel => channel.id === process.env.CHANNEL && channel.type === 'text') as Discord.TextChannel).send('Bot Connected').then(message => { setInterval(() => { message.delete() }, 500) })

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
        if (!message.member) { throw console.error(`[src/index.ts] Error $message.member ${message.member}`); }
        if (!message.member.hasPermission('ADMINISTRATOR')) { throw console.error(`[src/index.ts] Error $message.member.hasPermission('ADMINISTRATOR') ${message.member.hasPermission('ADMINISTRATOR')}`); }
        message.channel.messages.fetch().then(results => {
            if (message.channel instanceof (Discord.TextChannel || Discord.NewsChannel)) {
                message.channel.bulkDelete(results);
            }
        });
    });

    // '!status' => Change Status of this Bot
    command(client, 'status', (message) => {
        if (!client.user) { throw console.error(`[src/index.ts] Error $client.user ${client.user}`); }
        client.user.setPresence(message.content === '!status' ? {} : { activity: { name: message.content, type: 'PLAYING', }, });
    });

    // channelId, text, reactions => Edit First Message of Channel
    // firstMessage(client, 'process.env.CHANNEL', 'Hello World!!!!', [':x:', ':o:']);

    // '!ping' => 'Pong!'
    privateMessage(client, 'ping', 'Pong!');

    // '!createtextchannel' => Create Text Channel to Category
    command(client, 'createtextchannel', (message) => {
        const { guild } = message;
        if (!guild) { throw console.error(`[src/index.ts] Error $guild ${guild}`); }

        const name = message.content.replace('!createtextchannel ', '');
        guild.channels.create(name, { type: 'text', }).then((channel) => {
            const categoryId = '807957746572984340';
            channel.setParent(categoryId);
        });
    })

    // '!createvoicechannel' => Create Voice Channel to Category
    command(client, 'createvoicechannel', (message) => {
        const { guild } = message;
        if (!guild) { throw console.error(`[src/index.ts] Error $guild ${guild}`); }

        const name = message.content.replace('!createvoicechannel ', '');
        guild.channels.create(name, { type: 'voice', }).then((channel) => {
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
        if (!guild) { throw console.error(`[src/index.ts] Error $guild ${guild}`); }

        const { name, region, memberCount, owner } = guild;
        const icon = guild.iconURL();
        const embed = new Discord.MessageEmbed()
            .setTitle(name)
            .addFields(
                { name: 'Region', value: region, inline: true, },
                { name: 'Members', value: memberCount, inline: true, },
                { name: 'Owner', value: owner?.user.tag, }
            );
        if (icon) { embed.setThumbnail(icon); }
        message.channel.send(embed);
    });

    roleClaim(client, { o: 'Yes', x: 'No' });

    command(client, 'help', (message) => {
        message.channel.send(`いずれ書くから待ってて～`)
    });

    command(client, 'ban', (message) => {
        const { member, guild, mentions } = message;
        if (!member) { throw console.error(`[src/index.ts] Error $member ${member}`); }
        if (!guild) { throw console.error(`[src/index.ts] Error $guild ${guild}`); }

        const tag = `<@${member.id}>`;

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first();
            if (target) {
                const targetMember = guild.members.cache.get(target.id)?.ban();
                message.channel.send(`${tag} That user has been`);
            } else {
                message.channel.send(`${tag} Please specify someone to ban.`);
            }
        } else {
            message.channel.send(`${tag} You do not have permission to use this command.`);
        }
    });

    command(client, 'kick', (message) => {
        const { member, guild, mentions } = message;
        if (!member) { throw console.error(`[src/index.ts] Error $member ${member}`); }
        if (!guild) { throw console.error(`[src/index.ts] Error $guild ${guild}`); }

        const tag = `<@${member.id}>`;

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first();
            if (target) {
                const targetMember = guild.members.cache.get(target.id)?.kick();
                message.channel.send(`${tag} That user has kicked`);
            } else {
                message.channel.send(`${tag} Please specify someone to kick.`);
            }
        } else {
            message.channel.send(`${tag} You do not have permission to use this command.`);
        }
    });

    command(client, 'vote', function (message) {
        const text = message.content.replace('!vote ', '');
        vote(client, process.env.CHANNEL, text, ['+1', '-1']);
    });
});

client.login(process.env.TOKEN);