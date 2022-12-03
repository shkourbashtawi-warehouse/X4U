const { CommandInteraction } = require('discord.js');
module.exports = class Context {
  constructor(ctx, args) {
    this.isInteraction = ctx instanceof CommandInteraction;
    this.ctx = ctx;
    this.setArgs(args);

    this.interaction = this.isInteraction ? ctx : null;
    this.message = this.isInteraction ? null : ctx;

    this.id = ctx.id;
    this.applicationId = ctx.applicationId;
    this.channelId = ctx.channelId;
    this.guildId = ctx.guildId;
    this.client = ctx.client;
    this.user = ctx instanceof CommandInteraction ? ctx.user : ctx.author;
    this.channel = ctx.channel;
    this.guild = ctx.guild;
    this.member = ctx.member;
    this.createdAt = ctx.createdAt;
    this.createdTimestamp = ctx.createdTimestamp;
    this.attachments = ctx.attachments;

    this.contextMenuContent = this.contextMenuContext || null;
  }

  setArgs(args) {
    if (this.isInteraction) {
      this.args = args.map((arg) => arg.value);
    } else {
      this.args = args;
    }
  }

  sendReply(content) {
    if (this.isInteraction) {
      this.msg = this.interaction.reply(content);
      return this.msg;
    } else {
      this.msg = this.message.reply(content);
      return this.msg;
    }
  }

  sendEphemeralReply(content) {
    if (this.isInteraction) {
      this.msg = this.interaction.reply({ content: content, ephemeral: true });
      return this.msg;
    } else {
      this.msg = this.message.channel.send(content);
      return this.msg;
    }
  }

  async sendDeferReply(content) {
    if (this.isInteraction) {
      this.msg = await this.interaction.deferReply({ ephemeral: false, fetchReply: true });
      return this.msg;
    } else {
      this.msg = await this.channel.send(content);
      return this.msg;
    }
  }

  async sendFollowUp(content) {
    if (this.isInteraction) {
      await this.interaction.followUp(content);
    }
  }

  editMessage(content) {
    if (this.isInteraction) {
      return this.interaction.editReply(content);
    } else {
      return this.msg.edit(content);
    }
  }

  deleteMessage() {
    if (this.isInteraction) {
      return this.interaction.deleteReply();
    } else {
      return this.msg.delete();
    }
  }
};
