const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
	EveryLogsChannel: {
		type: String,
	},
	WebhookURL: {
		type: String,
	},
});

module.exports = mongoose.model('Logs-events', LogsSchema);
