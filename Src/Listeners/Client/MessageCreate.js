const Event = require('../../Structures/Event');
const Context = require('../../Structures/Context');
require('dotenv').config();
module.exports = class MessageCreate extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(message) {
    if (message.author.bot) return;
    if (
      message.channel.type === this.client.Discord.ChannelType.GuildText &&
      !message.guild.members.cache.get(this.client.user.id)
    ) {
      await message.guild.members.fetch(this.client.user.id);
    }
    if (!message.channel.guild)
      return message.channel.send("I can't execute commands inside DMs! Please run this command in a server.");

    const ctx = new Context(message);

    const rawMessageContent = message.content.toLowerCase();
    const messageHelper = new this.client.messageHelper(this.client, ctx);
    ctx.messageHelper = messageHelper;

    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>( |)$`);

    const prefix = await messageHelper.getPrefixFromMessage(rawMessageContent, mentionPrefix);
    if (prefix) {
      let args;
      let command;
      const messageContent = message.content.replace('`', '').replace('  ', ' ');
      if (prefix === this.client.config.Danger.Prefix && !this.client.config.Danger.Prefix.endsWith(' ')) {
        args = messageContent.split(' ');
        command = args.shift().toLowerCase();
        command = command.slice(this.client.config.Danger.Prefix.length);
      } else if (prefix === this.client.config.Danger.Prefix) {
        args = messageContent.split(' ');
        args.shift();
        command = args.shift().toLowerCase();
      } else {
        args = messageContent.split(' ');
        args.shift();
        if (args.length == 0) return;
        command = args.shift().toLowerCase();
      }
      ctx.setArgs(args);
      let cmd;
      if (this.client.commands.has(command)) cmd = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) cmd = this.client.aliases.get(command);
      else return;
      if (cmd.slashCommand === true) return;

      const commandName = cmd.name.toLowerCase();
      if (this.client.config.Danger.NODE_ENV == 'production')
        if (cmd.permissions.dev && !this.client.config.Danger.Devs.includes(message.author.id)) return;
      if (!message.guild && cmd.guildOnly) return;

      if (prefix == this.client.config.Danger.Prefix) {
        if (
          !args[0] &&
          cmd.args === true &&
          ((cmd.acceptsAttachments && message.attachments.size == 0) || !cmd.acceptsAttachments)
        ) {
          const embed = new this.client.Discord.EmbedBuilder()
            .setDescription(
              `You didn't provide any arguments.\nCorrect Usage: \`${prefix}${cmd.name} ${cmd.description.usage}\`\nExample Usage: \`${prefix}${cmd.name} ${cmd.description.examples}\``,
            )
            .setColor(this.client.config.Color.red);
          return message.reply({ content: `${message.author}`, embeds: [embed] });
        }
      }

      try {
        cmd.run(this.client, ctx, ctx.args);
      } catch (e) {
        this.client.logger.error(e);
        message.reply('There was an error trying to execute that command!');
      }
    } else if (!prefix) {
    }
  }
};
