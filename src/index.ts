import Discord, { MessageFlags } from 'discord.js';
import http from 'http';

import { port, token } from './.env';

const BOT_STATUS = (): Discord.PresenceStatus | 'disconnected' => { return client.user?.presence.status ?? 'disconnected' };
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse): void => { if (req.method === 'GET') { const status = BOT_STATUS(); res.setHeader('Content-Type', 'application/json;charset=utf-8'); console.log(`sending status ${status}`); return res.end(`{"BOT_STATUS": "${status}"}`); } else { const statusCode = 404; res.statusCode = statusCode; console.log(`sending error ${statusCode}`); return res.end(`{"error": "${http.STATUS_CODES[statusCode]}"}`); } });

const client = new Discord.Client();

import { command, commandOptions } from './command';
import deleteMessage from './delete-message';

client.on('ready', function () {
    console.log('connected');

    // greeting
    command({
        client,
        commands: ['hi!'],
        args: 0,
        permissions: ['SEND_MESSAGES'],
        availableChannelId: ['813038252256657448', '815421156529143808'],
        availableGuildId: ['805560753657479228'],
        callback: (message, args, sentence): void => {
            message.reply(`Hi! ${message.author.username}`);
        }
    });

    // clear
    command({
        client,
        commands: ['!cc'],
        args: 2,
        permissions: ['MANAGE_MESSAGES'],
        availableChannelId: ['813038252256657448', '815421156529143808'],
        availableGuildId: ['805560753657479228'],
        callback: (message, args, sentence): void => {
            // get messages of channel
            message.channel.messages.fetch().then(result => { return result.array(); })
                .then(messages => {
                    // (HAS_REACTION && HAS_OPTION_M ? IS_AUTHOR : true) || HAS_OPTION_F
                    messages = messages.filter(msg => (msg.reactions.cache.array().length === 0 && args.includes('-m') ? msg.author.id === message.author.id : true) || args.includes('-f'));
                    // remove options from `args`
                    if (args.includes('-m')) args.splice(args.indexOf('-m'), 1);
                    if (args.includes('-f')) args.splice(args.indexOf('-f'), 1);
                    // set limit
                    let limit = +args[0] ?? 0 < messages.length ? +args[0] ?? 0 : messages.length;
                    console.log(`Remove ${limit} messages from channel-${message.channel.id}.`);
                    // execute delete
                    deleteMessage(messages.slice(0, limit));
                });
        }
    });
});

client.login(token);
server.listen(port, () => { console.log(`Server listening on port ${port}`); });
