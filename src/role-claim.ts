import Discord = require('discord.js');
require('dotenv').config();

import emoji = require('node-emoji');
import firstMessage from './first-message';

export default (client: Discord.Client, emojis: { [key: string]: string }) => {
    const channelId = process.env.CHANNEL;
    if (!channelId) { throw console.error(`[src/role-claim.ts] Error $channelId ${channelId}`); }

    let emojiText = 'Add a reaction to claim a role\n\n';
    const reactions: string[] = [];
    for (const key in emojis) {
        reactions.push(key);
        const role = emojis[key];
        emojiText += `${emoji.get(key)} : <@&${client.guilds.cache.find(guild => guild.channels.cache.get(channelId) ? true : false)?.roles.cache.find(_role => _role.name === role)?.id}> \n`;
    }
    emojiText += `\nロールが変更されない場合は、再度お試しください。`

    firstMessage(client, channelId, emojiText, reactions);

    const handleReaction = (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser, add: boolean): void => {
        if (user.id === client.user?.id) { return }
        // if (user.id !== process.env.OWNER) { throw console.error(`[src/role-claim.ts] Error $user.id ${user.id}`); }

        const { guild } = reaction.message;
        if (!guild) { throw console.error(`[src/role-claim.ts] Error $guild ${guild}`); }

        const roleName = emojis[emoji.find(reaction.emoji.name)['key']];
        if (!roleName) { throw console.error(`[src/role-claim.ts] Error $roleName ${roleName}`); }

        const role = guild.roles.cache.find(role => role.name === roleName);
        if (!role) { throw console.error(`[src/role-claim.ts] Error $role ${role}`); }

        const member = guild.members.cache.get(user.id);
        if (!member) { return }

        if (add) {
            member.roles.add(role);
            console.log(`Add role '${role.name}' to ${member.displayName}`);
            reaction.message.channel.send(`Add role <@&${role.id}> to <@${member.id}>`);
        }
        else {
            member.roles.remove(role);
            console.log(`Remove role '${role.name}' from ${member.displayName}`);
            reaction.message.channel.send(`Remove role <@&${role.id}> from <@${member.id}>`);
        }
    }

    client.on('messageReactionAdd', (reaction, user) => { if (reaction.message.channel.id === channelId && emoji.find(reaction.emoji.name)['key'] in emojis) { handleReaction(reaction, user, true); } });
    client.on('messageReactionRemove', (reaction, user) => { if (reaction.message.channel.id === channelId && emoji.find(reaction.emoji.name)['key'] in emojis) { handleReaction(reaction, user, false); } });
}