const mongoose = require('mongoose');

const AutoReactionScehma = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	channelID: {
		type: String,
		required: true,
	},
	emojiObject: {
		type: String,
		required: true,
	},
	emojiID: {
		type: String,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('auto-reaction', AutoReactionScehma);
