const mongoose = require('mongoose');

const GuildLang = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	Language: {
		type: String,
		default: 'en-US',
	},
});

module.exports = mongoose.model('guild-lang', GuildLang);
