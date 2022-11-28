const mongoose = require('mongoose');
const AutoRoleSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
	roleObject: {
		type: Object,
		required: true,
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('auto-role', AutoRoleSchema);
