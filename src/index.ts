import Discord from 'discord.js';
const client = new Discord.Client();

import { token, prefix } from 'config.json';


const command = (client: Discord.Client, aliases: string | string[], callback: (message: Discord.Message) => void): void => {
    const _aliases = (typeof aliases === 'string') ? [aliases] : aliases;

    client.on('message', function (message) {
        const { content } = message;
        _aliases.forEach(function (alias) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running the command ${command}`);
                callback(message);
            }
        });
    });
}

client.on('ready', function () {
    console.log('The Client is ready');
    command(client, 'ping', function (message) {
        message.channel.send('Pong!');
    });
});

client.login(token);