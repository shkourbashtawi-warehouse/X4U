const mongoose = require('mongoose');

const guildMemberAddSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	channelID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('welcome-channel', guildMemberAddSchema);
