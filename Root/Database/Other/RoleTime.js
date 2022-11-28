const mongoose = require('mongoose');
const RoleTime = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},

	guildID: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model('role-time', RoleTime);
