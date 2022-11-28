const mongoose = require('mongoose');

const BlacklistScehma = new mongoose.Schema({
	userID: {
		type: String,
	},
	guildID: {
		type: String,
	},
	type: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('black-list', BlacklistScehma);
