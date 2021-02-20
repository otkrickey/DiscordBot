import Discord from 'discord.js';

import http from 'http';

require('dotenv').config();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const channelId = process.env.CHANNEL;
const port = process.env.PORT;

const server = http.createServer(handler);
const BOT_STATUS = (): Discord.PresenceStatus | undefined => {
    return client.user?.presence.status
};
function handler(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.method === 'GET') { return handleGet(req, res); }
    else { return handleError(res, 404); }
}
function handleGet(req: http.IncomingMessage, res: http.ServerResponse): void {
    const status = BOT_STATUS() ?? 'disconnected';
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    console.log(`sending status ${status}`);
    return res.end(`{"BOT_STATUS": "${status}"}`);
}
function handleError(res: http.ServerResponse, statusCode: number): void {
    res.statusCode = statusCode;
    console.log(`sending error ${statusCode}`);
    return res.end(`{"error": "${http.STATUS_CODES[statusCode]}"}`);
}

const client = new Discord.Client();

client.on('ready', function () {
    console.log('connected');

});

client.login(token);
server.listen(port, () => { console.log(`Server listening on port ${port}`); });