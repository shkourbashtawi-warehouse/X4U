const mongoose = require('mongoose');

const FastRoleSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
	},
	roleID: {
		type: String,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('fast-role', FastRoleSchema);
