const mongoose = require('mongoose');

const VoteTopGGSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},

	lastVoted: {
		type: Number,
		default: 0,
	},

	votes: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model('vote-topgg', VoteTopGGSchema);
