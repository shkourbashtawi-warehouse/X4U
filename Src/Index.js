const Basic = require('./Structures/Client');
const Config = require('./Assets/Config');
const client = new Basic();
require('dotenv').config();
const path = __dirname;
exports.path = path;
process.on('uncaughtException', (e) => {
  client.logger.error(e);
});

process.on('unhandledRejection', (e) => {
  client.logger.error(e);
});

client.login(Config.Danger.Token);
