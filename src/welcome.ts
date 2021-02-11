import Discord = require('discord.js');
require('dotenv').config();

import emoji = require('node-emoji');

export default (client: Discord.Client) => {
    const channelId = process.env.CHANNEL;
    if (!channelId) { throw console.error(`[src/welcome.ts] Error $channelId ${channelId}`); }
    const targetChannelId = process.env.CHANNEL;
    if (!targetChannelId) { throw console.error(`[src/welcome.ts] Error $targetChannelId ${targetChannelId}`); }

    client.on('guildMemberAdd', (member) => {
        const message = `Please welcome <@${member.id}> to the server! Please check out ${member.guild.channels.cache.get(targetChannelId)?.toString()}`;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) { throw console.error(`[src/welcome.ts] Error $channel ${channel}`); }
        if (!(channel instanceof Discord.TextChannel)) { throw console.error(`[src/welcome.ts] Error $channel ${typeof channel}`); }

        channel.send(message);
    });
}