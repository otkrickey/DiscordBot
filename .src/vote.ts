import Discord = require('discord.js');
import emoji = require('node-emoji');
require('dotenv').config();

import addReactions from './add-reaction';


export default async (client: Discord.Client, channelId: string | undefined, text: string | undefined, reactions: string[] = []): Promise<void> => {
    if (!channelId) { return }
    if (!text) { return }

    const channel = await client.channels.fetch(channelId);
    if (!(channel instanceof Discord.TextChannel)) { return }

    channel.send(`[vote] "${text}"`).then(message => { addReactions(message, reactions); });
}