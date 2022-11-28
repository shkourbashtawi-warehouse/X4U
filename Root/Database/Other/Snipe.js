const mongoose = require('mongoose');
const SnipeSchema = mongoose.Schema({
	guildId: {
		type: String,
	},
	channelID: {
		type: String,
	},
	message: {
		type: Array,
		default: [],
	},
	tag: {
		type: Array,
		default: [],
	},
	image: { type: Array, default: [] },
});

module.exports = mongoose.model('snipe', SnipeSchema);
