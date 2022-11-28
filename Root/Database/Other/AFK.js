const mongoose = require('mongoose');

const AFKSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	reason: {
		type: String,
		required: true,
	},

	timestamp: {
		type: String,
		default: Date.now(),
	},
});

module.exports = mongoose.model('afk-users', AFKSchema);
