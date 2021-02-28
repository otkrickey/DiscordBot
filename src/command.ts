import Discord from 'discord.js';
export interface statusMessage {
    status: boolean;
    type: 'ok' | 'undefined'
    message: string;
}
export interface commandOptions {
    client: Discord.Client;
    commands: string[];
    args: number;
    permissions: Discord.PermissionString[];
    availableChannelId?: string[];
    availableGuildId?: string[];
    callback: (message: Discord.Message, args: string[], sentence: string) => void;
}

export const command = (commandOptions: commandOptions): void => {
    let {
        client,
        commands,
        args = 0,
        permissions = [],
        availableChannelId = [],
        availableGuildId = [],
        callback,
    } = commandOptions

    console.log(`Registering command "${commands[0]}"`);

    client.on('message', (message): void => {
        const { member, content, guild, channel } = message;

        // is Bot
        if (!member) { return }
        // is not this bot
        if (message.author.id === client.user?.id) { return }
        if (!guild) { return }
        // is not specified Channel
        if (!availableChannelId.includes(channel.id)) { return }
        if (!availableGuildId.includes(guild.id)) { return }

        for (const alias of commands) {
            if (content.startsWith(`${alias} `) || content === alias) {
                console.log(`Called command '${alias}'`);
                // check permission
                for (const permission of permissions) { if (!member.hasPermission(permission)) { message.reply(`You do not have permission to execute this command, or you have not specified the appropriate role.\nRequired permissions: ${permission}`); return } }
                const argument = content.split(/[ ]+/);
                // remove alias
                argument.shift();
                // separate args and sentence
                callback(message, argument.slice(0, args), argument.slice(args).join(' '));
                return
            }
        }
    });
}