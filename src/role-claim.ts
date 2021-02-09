import Discord = require('discord.js');
import emoji = require('node-emoji');

const firstMessage = require('./first-message')

export default (client: Discord.Client) => {
    const channelId = '723819742502191165'
    const getEmoji = (emojiName: string): string => { return emoji.get(emojiName); }
    const emojis: { [key: string]: string } = { o: ':o:', x: ':x:' }
    const reactions = [];
    let emojiText = 'Add a reaction to claim a role\n\n';
    for (const key in emojis) {
        const emoji = getEmoji(key);
        reactions.push(emoji);
        const role = emojis[key] as string;
        emojiText += `${emoji} = ${role}\n`;
    }

    firstMessage(client, channelId, emojiText, reactions);

    const handleReaction = (reaction: Discord.MessageReaction, user: Discord.User | Discord.PartialUser, add: boolean): void => {
        if (user.id === '723819104045105172') {
            return
        }
        const emoji = reaction.emoji.name;
        const { guild } = reaction.message;
        const roleName = emojis[emoji];
        if (!roleName) { return }
        const role = guild?.roles.cache.find(role => role.name === roleName);
        const member = guild?.members.cache.find(member => member.id === user.id);
        if (add) { member?.roles.add(role as Discord.Role); }
        else { member?.roles.remove(role as Discord.Role); }
    }

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) { handleReaction(reaction, user, true); }
    });
    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) { handleReaction(reaction, user, false); }
    });
}