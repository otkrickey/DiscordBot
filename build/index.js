"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const http_1 = __importDefault(require("http"));
const _env_1 = require("./.env");
const BOT_STATUS = () => { var _a, _b; return (_b = (_a = client.user) === null || _a === void 0 ? void 0 : _a.presence.status) !== null && _b !== void 0 ? _b : 'disconnected'; };
const server = http_1.default.createServer((req, res) => { if (req.method === 'GET') {
    const status = BOT_STATUS();
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    console.log(`sending status ${status}`);
    return res.end(`{"BOT_STATUS": "${status}"}`);
}
else {
    const statusCode = 404;
    res.statusCode = statusCode;
    console.log(`sending error ${statusCode}`);
    return res.end(`{"error": "${http_1.default.STATUS_CODES[statusCode]}"}`);
} });
const client = new discord_js_1.default.Client();
const command_1 = require("./command");
const delete_message_1 = __importDefault(require("./delete-message"));
client.on('ready', function () {
    console.log('connected');
    // greeting
    command_1.command({
        client: client,
        commands: ['hi!'],
        args: 0,
        permissions: ['SEND_MESSAGES'],
        allowDMChannel: true,
        callback: (message, args, sentence, client) => {
            message.reply(`Hi! ${message.author.username}`);
        }
    });
    // clear
    command_1.command({
        client: client,
        commands: ['!cc'],
        args: 1,
        permissions: ['MANAGE_MESSAGES'],
        allowDMChannel: true,
        callback: (message, args, sentence, client) => {
            var _a;
            let limit = args.length ? (_a = +args[0]) !== null && _a !== void 0 ? _a : 0 : 50;
            let messageData = message.channel.messages.fetch().then(result => { return result.array(); });
            if (args[1] && args[1] === '-m') {
                messageData.then(messages => {
                    messages = messages.filter(msg => msg.author.id === message.author.id);
                    delete_message_1.default(messages.slice(0, limit > messages.length ? messages.length : limit));
                });
            }
            else if (args[1] && args[1] !== '-m') {
                message.reply(`"Error Arg[1]" '-m' expected.`);
            }
            else {
                messageData.then(messages => {
                    delete_message_1.default(messages.slice(0, limit > messages.length ? messages.length : limit));
                });
            }
        }
    });
});
client.login(_env_1.token);
server.listen(_env_1.port, () => { console.log(`Server listening on port ${_env_1.port}`); });
//# sourceMappingURL=index.js.map