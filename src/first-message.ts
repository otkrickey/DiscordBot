import Discord = require('discord.js');
import emoji = require('node-emoji');
require('dotenv').config();

function addReactions(message: Discord.Message, reactions: string[]): void {
    const reaction = reactions.shift();
    if (reaction) {
        const Emoji = emoji.get(reaction);
        message.react(Emoji);
    }
    if (reactions.length) {
        return addReactions(message, reactions);
    }
}

export default async (client: Discord.Client, channelId: string | undefined, text: string | undefined, reactions: string[] = []): Promise<void> => {
    if (!channelId) { throw console.error(`[src/first-message.ts] Error $id ${channelId}`); }
    if (!text) { throw console.error(`[src/first-message.ts] Error $text ${text}`); }

    const channel = await client.channels.fetch(channelId);
    if (!(channel instanceof Discord.TextChannel)) { throw console.error(`[src/first-message.ts] Error $channel ${typeof channel}`); }

    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            channel.send(text).then((message) => {
                addReactions(message, reactions);
            });
        } else {
            const message = messages.last();
            if (!message) { throw console.error(`[src/first-message.ts] Error $message ${message}`); }
            message.edit(text);
            addReactions(message, reactions);
        }
    });
}