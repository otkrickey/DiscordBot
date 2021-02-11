import Discord = require('discord.js');
import emoji = require('node-emoji');
require('dotenv').config();

import addReactions from './add-reaction';


export default async (client: Discord.Client, channelId: string | undefined, text: string | undefined, reactions: string[] = []): Promise<void> => {
    if (!channelId) { throw console.error(`[src/vote.ts] Error $channelId ${channelId}`); }
    if (!text) { throw console.error(`[src/vote.ts] Error $text ${text}`); }

    const channel = await client.channels.fetch(channelId);
    if (!(channel instanceof Discord.TextChannel)) { throw console.error(`[src/vote.ts] Error $channel ${typeof channel}`); }

    channel.send(`[vote] "${text}"`).then(message => { addReactions(message, reactions); });
}