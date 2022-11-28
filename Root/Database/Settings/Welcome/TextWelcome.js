const mongoose = require('mongoose');

const TextWelcomeSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	Text: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('welcome-text', TextWelcomeSchema);
