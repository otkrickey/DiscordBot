import Discord = require('discord.js');


export default (channel: Discord.Channel, text: string | undefined, duration: number = -1) => {
    if (!(channel instanceof (Discord.TextChannel || Discord.NewsChannel))) { return }
    if (!text) { return }

    channel.send(text).then((message) => {
        if (duration === -1) { return }

        setTimeout(() => { message.delete() }, 1000 * duration);
    });
}