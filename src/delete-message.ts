import Discord from 'discord.js';

const deleteMessage = (messages: Discord.Message[]): Discord.Message[] => {
    messages.shift()?.delete();
    return messages
}

export default (messages: Discord.Message[]) => {
    const interval = setInterval(function () {
        messages = deleteMessage(messages);
        if (!messages.length) { clearInterval(interval); }
    }, 1000);
}