const mongoose = require('mongoose');

const ProbotIDSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	probotID: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('probot-id', ProbotIDSchema);
