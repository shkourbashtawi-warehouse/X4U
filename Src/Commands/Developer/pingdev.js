const Command = require('../../Structures/Command');
module.exports = class PingDevNormal extends Command {
  constructor(client) {
    super(client, {
      name: 'pingdev',
      description: {
        content: 'Some commands for developers.',
      },
      category: 'Developer',
      permissions: {
        dev: true,
      },
    });
  }

  async run(client, ctx) {
    const msg = await ctx.sendDeferReply(`Pinging...`);
    return ctx.editMessage(
      `Pong! (Latency: ${msg.createdTimestamp - ctx.createdTimestamp}ms. API Latency: ${Math.round(client.ws.ping)}ms.)`,
    );
  }
};
