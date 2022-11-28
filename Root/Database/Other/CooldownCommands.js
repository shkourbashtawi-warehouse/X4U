const mongoose = require('mongoose');

const CooldownCommandsScehma = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
	},
	commandName: {
		type: String,
		required: true,
	},
	cooldown: {
		type: String,
		default: 0,
	},
});

module.exports = mongoose.model('cooldown-commands', CooldownCommandsScehma);
