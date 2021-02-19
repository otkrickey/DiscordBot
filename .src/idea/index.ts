import Discord = require('discord.js');
import { connect } from 'http2';
require('dotenv').config();
const client = new Discord.Client();

import command from './command';

client.setMaxListeners(0);

client.on('ready', function () {
    console.log(client.guilds.cache);
});


client.login(process.env.TOKEN);