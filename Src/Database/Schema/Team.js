const mongoose = require('mongoose');
const TeamSchema = mongoose.Schema({
  teamLeader: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  teamId: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },

  teamName: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  teamRoleId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  usersData: {
    type: mongoose.SchemaTypes.Array,
    default: [],
  },
});

module.exports = mongoose.model('teams', TeamSchema);
