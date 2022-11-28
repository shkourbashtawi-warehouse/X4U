const mongoose = require('mongoose');

const LineChannelSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	channelID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('line-channel', LineChannelSchema);
