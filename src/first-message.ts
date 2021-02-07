import Discord = require('discord.js');
import emoji = require('node-emoji');
require('dotenv').config();

function addReactions(message: Discord.Message, reactions: string[]): void {
    const reaction = emoji.get(reactions.shift() as string);
    if (reaction) { message.react(reaction); }
    if (reactions.length > 0) {
        return addReactions(message, reactions);
    }
}

export default async (client: Discord.Client, id: string, text: string, reactions: string[] = []): Promise<void> => {
    const channel = await client.channels.fetch(id) as Discord.TextChannel;
    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            channel.send(text).then((message) => {
                addReactions(message, reactions);
            });
        } else {
            const message = messages.last();
            message?.edit(text);
            addReactions(message as Discord.Message, reactions);
        }
    });
}