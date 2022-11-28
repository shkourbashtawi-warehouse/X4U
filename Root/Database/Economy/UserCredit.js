const mongoose = require('mongoose');

const UserCreditScehma = new mongoose.Schema({
	userID: { type: String },

	dailyAt: { type: Number, default: 0 },

	wallet: { type: Number, default: 1000 },
	bank: { type: Number, default: 0 },
});

module.exports = mongoose.model('user-credit', UserCreditScehma);
