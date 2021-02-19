import Discord = require('discord.js');
require('dotenv').config();

import emoji = require('node-emoji');

export default (client: Discord.Client) => {
    const channelId = process.env.CHANNEL;
    if (!channelId) { return }
    const targetChannelId = process.env.CHANNEL;
    if (!targetChannelId) { return }

    client.on('guildMemberAdd', (member) => {
        const message = `Please welcome <@${member.id}> to the server! Please check out ${member.guild.channels.cache.get(targetChannelId)?.toString()}`;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) { return }
        if (!(channel instanceof Discord.TextChannel)) { return }

        channel.send(message);
    });
}