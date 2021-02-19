import Discord = require('discord.js');
require('dotenv').config();

export default (client: Discord.Client, channelId: string | undefined, guildId: string | undefined): void => {
    // const channelId = '732883157103149067'
    if (!channelId) { return }
    if (!guildId) { return }


    const updateMembers = (guild: Discord.Guild) => {
        const channel = guild.channels.cache.get(channelId);
        if (!channel) { return }

        channel.setName(`Members: ${guild.memberCount.toLocaleString()}`);
    }

    client.on('guildMemberAdd', (member) => updateMembers(member.guild));
    client.on('guildMemberRemove', (member) => updateMembers(member.guild));

    const guild = client.guilds.cache.get(guildId);
    if (!guild) { return }

    updateMembers(guild);
}