import Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

client.setMaxListeners(0);

client.on('ready', function () {

});

client.login(process.env.TOKEN);