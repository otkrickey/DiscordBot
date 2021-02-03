import Discord from 'discord.js';
const client = new Discord.Client();

require('dotenv').config();
const token = process.env.TOKEN
const prefix = process.env.PREFIX


const command = (client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void => {
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


const addReactions = (message: Discord.Message, reactions: string[]) => {
    message.react(reactions[0]);
    reactions.shift();
    if (reactions.length > 0) {
        setTimeout(() => addReactions(message, reactions), 750);
    }
}


const first_message = async (client: Discord.Client, id: string | number, text: string, reactions?: string[] = []) => {
    const _id = (typeof id === 'string') ? id : String(id);
    const channel = client.channels.cache.get(_id);
    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            channel.send(text).then(message => {
                addReactions(message, reactions);
            });
        } else { }
    });
}


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
                (message.channel as Discord.TextChannel | Discord.NewsChannel).bulkDelete(results);
            });
        }
    });

    command(client, 'status', function (message) {
        const content = message.content.replace('!status', '');
        client.user?.setPresence({ activity: { name: content, type: 0 } });
    });
});

client.login(token);