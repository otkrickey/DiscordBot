const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', function () {
    console.log('The Client is ready');
});

client.login(config.token);