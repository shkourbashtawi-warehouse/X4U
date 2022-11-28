const mongoose = require('mongoose');

const SugestionSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	channelID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('sugestion-channel', SugestionSchema);
