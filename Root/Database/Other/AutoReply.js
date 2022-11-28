const mongoose = require('mongoose');

const AutoReplyScehma = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	CommandA: {
		type: String,
		required: true,
	},
	ResponseB: {
		type: String,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('auto-reply', AutoReplyScehma);
