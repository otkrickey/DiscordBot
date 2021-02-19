import Discord = require('discord.js');
require('dotenv').config();

export default (client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void => {
    client.on('message', function (message) {
        const { content } = message;
        for (const alias of (typeof aliases === 'string') ? [aliases] : aliases) {
            const command = `${process.env.PREFIX}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running ${command}`);
                message.content = message.content.replace(`${process.env.PREFIX}${alias} `, '');
                callback(message);
            }
        }
    })
}