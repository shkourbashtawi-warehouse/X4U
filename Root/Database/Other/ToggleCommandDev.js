const mongoose = require('mongoose');

const ToggleCommandDevSchema = new mongoose.Schema({
	Command: {
		type: String,
		required: true,
	},

	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('toggle-command-dev', ToggleCommandDevSchema);
