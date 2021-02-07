import Discord = require('discord.js');
require('dotenv').config();

export default (client: Discord.Client, triggerText: string, replyText: string): void => {
    client.on('message', (message) => {
        if (message.channel.type === 'dm' && message.content.toLowerCase() === triggerText.toLowerCase()) {
            message.author.send(replyText)
        }
    });
}