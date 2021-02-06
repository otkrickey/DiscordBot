import Discord from 'discord.js';
const client = new Discord.Client();

require('dotenv').config();
const token = process.env.TOKEN
const prefix = process.env.PREFIX

function message(client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void {
    client.on('message', function (message) {
        if (message.content.startsWith(`${prefix}`)) {
            message.content = message.content.replace(`${prefix}`, '');
            command(message, (typeof aliases === 'string') ? [aliases] : aliases, callback);
        }
    });
}

function command(message: Discord.Message, aliases: string[], callback: (message: Discord.Message) => void): void {
    const { content } = message;
    for (const alias of aliases) {
        if (content.startsWith(`${alias} `) || content === alias) {
            console.log(`Running ${alias}`);
            callback(message);
        }
    }
}

client.on('ready', function () {
    console.log('The Client is ready');
    const MainChannel = client.channels.cache.get('805560753657479231');
    (MainChannel as Discord.TextChannel).send('Bot Started');
    message(client, 'ping', function (message) {
        message.channel.send('Pong');
    });
});

client.login(token);