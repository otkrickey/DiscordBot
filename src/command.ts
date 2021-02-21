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
    allowDMChannel?: boolean;
    callback: (message: Discord.Message, args: string[], sentence: string, client: Discord.Client) => void;
}

const validatePermissions = (permissions: Discord.PermissionString[]): statusMessage => {
    const validPermissions: Discord.PermissionString[] = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            return {
                status: false,
                type: 'undefined',
                message: `'${permission}' is not defined in Discord.PermissionString.`
            }
        }
    }
    return {
        status: true,
        type: 'ok',
        message: `ok`
    }
}

export const command = (commandOptions: {
    client: Discord.Client;
    commands: string[];
    args: number;
    permissions: Discord.PermissionString[];
    allowDMChannel?: boolean;
    callback: (message: Discord.Message, args: string[], sentence: string, client: Discord.Client) => void;
}): void => {
    let {
        client,
        commands,
        args = 0,
        permissions = [],
        allowDMChannel = false,
        callback,
    } = commandOptions

    console.log(`Registering command "${commands[0]}"`);

    // Ensure the permissions are in an array and are all valid
    validatePermissions(permissions);

    // Listen for messages
    client.on('message', (message): void => {
        const { member, content, guild } = message;

        // No member
        if (!member) { message.reply(`No member was found.`); return }
        // if DenyDMChannel && isDMChannel
        if (!allowDMChannel && (message.channel instanceof Discord.DMChannel || !guild)) { message.reply(`DMChannel is not supported.`); return }
        // if AllowDMChannel && isDMChannel
        if (allowDMChannel && (message.channel instanceof Discord.DMChannel || !guild)) { }
        // something gone wrong
        if (!guild) { message.reply(`Something gone wrong`); return }

        for (const alias of commands) {
            if (content.startsWith(`${alias} `) || content === alias) {
                console.log(`Called command '${alias}'`);
                // check permission
                for (const permission of permissions) { if (!member.hasPermission(permission)) { message.reply(`You do not have permission to execute this command, or you have not specified the appropriate role.\nRequired permissions: ${permission}`); return } }
                const argument = content.split(/[ ]+/);
                // remove alias
                argument.shift();
                // separate args and sentence
                callback(message, argument.slice(0, args), argument.slice(args).join(' '), client);
                return
            }
        }
    });
}