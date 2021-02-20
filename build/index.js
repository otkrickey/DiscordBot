"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const channelId = process.env.CHANNEL;
const port = process.env.PORT;
const server = http_1.default.createServer(handler);
const BOT_STATUS = () => {
    return client.user?.presence.status;
};
function handler(req, res) {
    if (req.method === 'GET') {
        return handleGet(req, res);
    }
    else {
        return handleError(res, 404);
    }
}
function handleGet(req, res) {
    const status = BOT_STATUS() ?? 'disconnected';
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    console.log(`sending status ${status}`);
    return res.end(`{"BOT_STATUS": "${status}"}`);
}
function handleError(res, statusCode) {
    res.statusCode = statusCode;
    console.log(`sending error ${statusCode}`);
    return res.end(`{"error": "${http_1.default.STATUS_CODES[statusCode]}"}`);
}
const client = new discord_js_1.default.Client();
client.on('ready', function () {
    console.log('connected');
});
client.login(token);
server.listen(port, () => { console.log(`Server listening on port ${port}`); });
//# sourceMappingURL=index.js.map