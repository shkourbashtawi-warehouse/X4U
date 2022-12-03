const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  userName: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  userStatus: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },

  teamId: {
    type: mongoose.SchemaTypes.String,
    default: null,
  },
});

module.exports = mongoose.model('users', UserSchema);
