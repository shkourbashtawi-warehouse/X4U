const Command = require('../../Structures/Command');
const UserSchema = require('../../Database/Schema/User');
module.exports = class TestDev extends Command {
  constructor(client) {
    super(client, {
      name: 'testdev',
      description: {
        content: 'Some commands for developers.',
      },
      category: 'Developer',
      permissions: {
        dev: true,
      },
    });
  }

  async run(client, ctx) {}
};
