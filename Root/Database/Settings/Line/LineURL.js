const mongoose = require('mongoose');

const LineURLSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	lineURL: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('line-url', LineURLSchema);
