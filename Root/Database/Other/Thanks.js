const mongoose = require('mongoose');
const ThanksSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	received: {
		type: Number,
		default: 0,
	},
	lastGave: Date,
});
module.exports = mongoose.model('thanks-system', ThanksSchema);
