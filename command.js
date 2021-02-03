const { prefix } = require('./config.json');

module.exports = (client, aliases, callback) => {
    aliases === (typeof aliases === 'string') ? aliases : [aliases];

    client.on('message', function (message) {
        const { content } = message;
        aliases.forEach(function (alias) {
            const command = `${prefix}${alias}`;
            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running the command ${command}`);
                callback(message);
            }
        });
    });
}