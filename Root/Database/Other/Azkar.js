const mongoose = require('mongoose');

const AzkarChannelSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	channelID: {
		type: String,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Azkar', AzkarChannelSchema);
