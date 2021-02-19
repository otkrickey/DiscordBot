import Discord = require('discord.js');
require('dotenv').config();

import addReactions from './add-reaction';

export default async (client: Discord.Client, channelId: string | undefined, text: string | undefined, reactions: string[] = []): Promise<void> => {
    if (!channelId) { return }
    if (!text) { return }

    const channel = await client.channels.fetch(channelId);
    if (!(channel instanceof Discord.TextChannel)) { return }

    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            channel.send(text).then((message) => { addReactions(message, reactions); });
        } else {
            const message = messages.last();
            if (!message) { return }
            message.edit(text);
            addReactions(message, reactions);
        }
    });
}