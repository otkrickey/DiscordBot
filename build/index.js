const DC = this;

// msgの一時退避
var msg;

var discord = require('discord.js');
var client = null;

// Response for Uptime Robot
const http = require('http');
http.createServer(function (request, response) {
    connectDiscord();
    response.end('Discord bot is active now.');
}).listen(3000);

function connectDiscord() {
    console.log('00');

    // 状態によって処理変更する。
    if (client == null) {
        client = new discord.Client();
    } else {
        if (client.readyAt != null) {
            switch (client.status) {
                case 0: // READY
                case 1: // CONNECTING
                case 2: // RECONNECTING
                case 3: // IDLE
                case 4: // NEARLY
                    return;
                case 5: // DISCONNECTED
                    client.destroy();
                    break;
                default:
                    client = new discord.Client();
                    break;
            }
        }
    }

    client.login(process.env.DISCORD_BOT_TOKEN);
    client.on('ready', message => {
        console.log('bot is ready!');
    });

    client.on('message', message => {
        // 自分のメッセージには反応しない
        // if (message.author.id == ) { return; }
        msg = message;

        // botへのリプライ応対
        if (msg.isMemberMentioned(client.user)) {
            if (msg.content.indexOf('content') > 0) {
                msg.reply(msg.content);
                console.log(msg.content);
                return;
            }
            if (msg.content.indexOf('logout') > 0) {
                msg.reply('ログアウトします。');
                client.destroy();
                return;
            }
            if (msg.content.indexOf('status') > 0) {
                msg.reply(client.status);
                return;
            }
            if (msg.content.indexOf('help') > 0) {
                msg.reply('ヘルプメッセージ');
                return;
            }
            sendGAS(msg);
            return;
        }

        // botへのリプライじゃなかった場合
        else {
            // []でくくったコマンドに応対する。
            if (msg.content.match(/^\[(?=.*\])/i)) {
                sendGAS(msg);
                return;
            }
        }
    });

    if (process.env.DISCORD_BOT_TOKEN == undefined) {
        console.log('please set ENV: DISCORD_BOT_TOKEN');
        process.exit(0);
    }
}

// send
var sendGAS = function (msg) {
    var params = msg.content.split(' ');
    var userId = params[0];
    var value = null;
    for (var n = 1; n < params.length; n++) {
        if (n == 1)
            value = params[n];
        else
            value = value + ' ' + params[n];
    }

    var jsonData = {
        'userId': msg.member.id,
        'value': value,
        'message': msg.content,
        'channelId': msg.channel.id,
    }

    post(process.env.GAS_URI, jsonData)
}

// post
var post = function (uri, jsonData) {
    var request = require('request');
    var options = {
        uri: uri,
        headers: { "Content-type": "application/json" },
        json: jsonData,
        followAllRedirects: true,
    }

    request.post(options, function (error, response, body) {
        if (error != null) {
            msg.reply('更新に失敗しました');
            return;
        }

        var userid = response.body.userid;
        var channelid = response.body.channelid;
        var message = response.body.message;
        if (userid != undefined && channelid != undefined && message != undefined) {
            var channel = client.channels.get(channelid);
            if (channel != null) {
                channel.send(message);
            }
        }
    });
}