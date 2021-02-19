import Discord = require('discord.js');
require('dotenv').config();

const prefix = process.env.PREFIX;

export default (client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void => {
    client.on('message', function (message) {
        const { content } = message;
        for (const alias of (typeof aliases === 'string') ? [aliases] : aliases) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running ${command}`);
                message.content = message.content.replace(`${prefix}${alias} `, '');
                callback(message);
            }
        }
    });
}

const exp = (client: Discord.Client, channel: Discord.Channel, aliases: string[], callback: (message: Discord.Message) => void): void => {
    client.on('message', function (message) {
        if (message.channel.id === channel.id) {
            const { content } = message;
            for (const alias of aliases) {
                const command = `${prefix}${alias}`;
                if (content.startsWith(`${command}`) || content === command) {
                    console.log(`Running ${command}`);
                    message.content = message.content.replace(`${prefix}${alias}`, ``);
                    callback(message);
                }
            }
        }
    });
}