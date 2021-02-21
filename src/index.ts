import Discord from 'discord.js';
import http from 'http';

import { prefix, port, token } from './.env';

const BOT_STATUS = (): Discord.PresenceStatus | 'disconnected' => { return client.user?.presence.status ?? 'disconnected' };
const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse): void => { if (req.method === 'GET') { const status = BOT_STATUS(); res.setHeader('Content-Type', 'application/json;charset=utf-8'); console.log(`sending status ${status}`); return res.end(`{"BOT_STATUS": "${status}"}`); } else { const statusCode = 404; res.statusCode = statusCode; console.log(`sending error ${statusCode}`); return res.end(`{"error": "${http.STATUS_CODES[statusCode]}"}`); } });

const client = new Discord.Client();

import { command, commandOptions } from './command';
import deleteMessage from './delete-message';

client.on('ready', function () {
    console.log('connected');

    // greeting
    command({
        client: client,
        commands: ['hi!'],
        args: 0,
        permissions: ['SEND_MESSAGES'],
        allowDMChannel: true,
        callback: (message, args, sentence, client): void => {
            message.reply(`Hi! ${message.author.username}`);
        }
    });

    // clear
    command({
        client: client,
        commands: ['!cc'],
        args: 1,
        permissions: ['MANAGE_MESSAGES'],
        allowDMChannel: true,
        callback: (message, args, sentence, client): void => {
            let limit = args.length ? +args[0] ?? 0 : 50;
            let messageData = message.channel.messages.fetch().then(result => { return result.array(); });
            if (args[1] && args[1] === '-m') {
                messageData.then(messages => {
                    messages = messages.filter(msg => msg.author.id === message.author.id);
                    deleteMessage(messages.slice(0, limit > messages.length ? messages.length : limit));
                });
            } else if (args[1] && args[1] !== '-m') {
                message.reply(`"Error Arg[1]" '-m' expected.`);
            } else {
                messageData.then(messages => {
                    deleteMessage(messages.slice(0, limit > messages.length ? messages.length : limit));
                });
            }
        }
    });
});

client.login(token);
server.listen(port, () => { console.log(`Server listening on port ${port}`); });