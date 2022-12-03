const Event = require('../../Structures/Event');
const mongoose = require('mongoose');
require('dotenv').config();
module.exports = class Ready extends Event {
  constructor(...args) {
    super(...args);
  }

  async run() {
    this.client.logger.ready('%s is online', this.client.user.username);

    mongoose
      .connect(this.client.config.Danger.MongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => this.client.logger.ready('Connected to MongoDB'));

    this.client.user.setActivity('X4U in TOP', {
      type: this.client.Discord.ActivityType.Watching,
    });
  }
};
