import Discord = require('discord.js');
import emoji = require('node-emoji');
require('dotenv').config();

function addReactions(message: Discord.Message, reactions: string[]): void {
    const reaction = reactions.shift();
    if (reaction) {
        const Emoji = emoji.get(reaction);
        message.react(Emoji);
    }
    if (reactions.length) { return addReactions(message, reactions); }
}

export default addReactions