import Discord from 'discord.js';
const client = new Discord.Client();

require('dotenv').config();
const token = process.env.TOKEN
const prefix = process.env.PREFIX

import emoji from 'node-emoji';

function EMOJI(text: string | undefined): string | undefined { const _c = text ? emoji.find(text) : undefined; return _c ? _c.emoji : undefined; }

function command(client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void {
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
}

function AddReactions(message: Discord.Message, reactions: string[]): void {
    const reaction = EMOJI(reactions.shift());
    if (reaction) { message.react(reaction); }
    if (reactions.length > 0) {
        return AddReactions(message, reactions);
    }
}

async function StartVoting(client: Discord.Client, id: string | number, text: string, reactions: string[] = []): Promise<void> {
    const _id = (typeof id === 'string') ? id : String(id);
    const _channel = await client.channels.fetch(_id);
    const channel = (_channel as Discord.TextChannel);
    channel.send(`[vote] "${text}"`).then(message => { AddReactions(message, reactions); });
}


function DirectMessage(client: Discord.Client, req: string, res: string): void {
    client.on('message', function (message) {
        if (message.content.toLowerCase() === req.toLowerCase()) {
            message.author.send(res);
        }
    });
}


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
                (message.channel as Discord.TextChannel | Discord.NewsChannel).bulkDelete(results);
            });
        }
    });

    command(client, 'status', function (message) {
        const content = message.content.replace('!status', '');
        client.user?.setPresence({ activity: { name: content, type: 0 } });
    });

    DirectMessage(client, 'ping', 'pong');


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
            .setFooter('This is a footer')
        message.channel.send(embed);
    });

    command(client, 'serverinfo', (message) => {
        const { guild } = message;
        if (guild) {
            const { name, region, memberCount, owner } = guild;
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
        }
    });
});

client.login(token);