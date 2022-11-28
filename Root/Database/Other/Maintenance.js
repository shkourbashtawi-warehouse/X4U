const mongoose = require('mongoose');

const MaintenanceScehma = new mongoose.Schema({
	Maintenance: {
		type: String,
		default: 'Maintenance',
	},
	toggleStatus: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('maintenance', MaintenanceScehma);
