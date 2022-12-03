const Event = require('../../Structures/Event');
const Context = require('../../Structures/Context');
const missingPermissions = require('../../Utils/missingPermissions');
module.exports = class InteractionCreate extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(interaction) {
    if (interaction.isButton()) {
      const { buttons } = this.client;
      const button = buttons.get(interaction.customId);
      if (!button) return;
      try {
        await button.run(this.client, interaction);
      } catch (error) {
        return this.client.logger.error(error);
      }
    } else if (interaction.isStringSelectMenu()) {
      const { menus } = this.client;
      let selectMenuName;
      if (menus.get(interaction.customId)) selectMenuName = interaction.customId;
      else selectMenuName = interaction.values[0];
      const menu = menus.get(selectMenuName);
      if (!menu) return;
      try {
        await menu.run(this.client, interaction);
      } catch (error) {
        return this.client.logger.error(error);
      }
    } else if (interaction.isModalSubmit()) {
      const { modals } = this.client;
      const modal = modals.get(interaction.customId);
      if (!modal?.id) {
        return;
      }
      try {
        await modal.run(this.client, interaction);
      } catch (error) {
        return this.client.logger.error(error);
      }
    } else if (interaction.isAutocomplete()) {
      const { commands } = this.client;
      const command = commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.autocomplete(this.client, interaction);
      } catch (error) {
        return this.client.logger.error(error);
      }
    } else if (interaction.isChatInputCommand()) {
      let cmd;
      let commandName;

      let ctx;
      let contextCommand;
      if (interaction.isMessageContextMenuCommand()) {
        const { contextMenuCommands } = this.client;
        contextCommand = contextMenuCommands.get(interaction.commandName);
        if (!contextCommand) return;
        cmd = contextCommand;
        commandName = cmd.name.toLowerCase();
        ctx = new Context(interaction, []);
        const targetMessage = interaction.targetMessage;
        if (targetMessage.embeds.length > 0) {
          const embed = targetMessage.embeds[0].data;
          if (embed) {
            if (embed.url) ctx.contextMenuContent = embed.url;
            else if (embed.title) ctx.contextMenuContent = embed.title;
            else if (embed.description) ctx.contextMenuContent = embed.description;
          } else {
            return interaction.reply({ content: 'This command cannot be used on this message', ephemeral: true });
          }
        } else ctx.contextMenuContent = targetMessage.content;
      } else {
        cmd = this.client.commands.get(interaction.commandName);
        if (!cmd || !cmd.slashCommand) return;
        commandName = cmd.name.toLowerCase();
        ctx = new Context(interaction, interaction.options.data);
      }

      if (!interaction.guild)
        return interaction.reply({
          content: `I can't execute that command inside DMs!. Please run this command in a server.`,
          ephemeral: true,
        });

      const messageHelper = new this.client.messageHelper(this.client, ctx);
      ctx.messageHelper = messageHelper;

      if (cmd.permissions.permission === 'dev' && !this.client.config.Danger.Devs.includes(interaction.user.id)) return;

      const permissionHelpMessage = `If you need help configuring the correct permissions for the bot join the support server.`;
      cmd.permissions.botPermissions = cmd.permissions.botPermissions.concat([
        this.client.Discord.PermissionsBitField.Flags.SendMessages,
      ]);
      if (cmd.permissions.botPermissions.length > 0) {
        const missingPerms = missingPermissions(
          cmd.permissions.botPermissions,
          interaction.channel,
          interaction.guild.members.me,
          this.client.Discord,
        );
        if (missingPerms.length > 0) {
          const SupportButton = new this.client.Discord.ActionRowBuilder().addComponents([
            new this.client.Discord.ButtonBuilder()
              .setLabel('Join the Support Server')
              .setStyle(this.client.Discord.ButtonStyle.Link)
              .setURL(this.client.config.Bot.ServerSupport)
              .setEmoji('<:link:938144203211427880>'),
          ]);
          return interaction.reply({
            content: `I don't have the required permissions to execute this command. Missing permission(s): **${missingPerms.join(
              ', ',
            )}**\n${permissionHelpMessage}`,
            components: [SupportButton],
            ephemeral: true,
          });
        }
      }

      if (cmd.permissions.userPermissions.length > 0) {
        const missingPerms = missingPermissions(
          cmd.permissions.userPermissions,
          interaction.channel,
          interaction.member,
          this.client.Discord,
        );
        if (missingPerms.length > 0) {
          const SupportButton = new this.client.Discord.ActionRowBuilder().addComponents([
            new this.client.Discord.ButtonBuilder()
              .setLabel('Join the Support Server')
              .setStyle(this.client.Discord.ButtonStyle.Link)
              .setURL(this.client.config.Bot.ServerSupport)
              .setEmoji('<:link:938144203211427880>'),
          ]);
          return interaction.reply({
            content: `You don't have the required permissions to execute this command. Missing permission(s): **${missingPerms.join(
              ', ',
            )}**\n${permissionHelpMessage}`,
            components: [SupportButton],
            ephemeral: true,
          });
        }
      }

      if (ctx.args.includes('@here') || ctx.args.includes('@everyone')) {
        return interaction.reply({
          content: 'Your argument included an `@here` or `@everyone` which is an invalid argument type.',
          ephemeral: true,
        });
      }

      try {
        await cmd.run(this.client, ctx, ctx.args);
      } catch (error) {
        this.client.logger.error(error);
        const ErrorEmbed = new this.client.Discord.EmbedBuilder()
          .setAuthor({
            name: this.client.user.username + ' Error',
            iconURL: this.client.user.displayAvatarURL({ forceStatic: true }),
            url: this.client.user.displayAvatarURL({ forceStatic: true }),
          })
          .setDescription(`Sorry, Error just occurred in the bot and the developers have been notified, please try again later.`)
          .setColor(this.client.config.Color.red)
          .setFooter({
            text: this.client.user.username + ' - Error',
            iconURL: this.client.user.displayAvatarURL({ forceStatic: true }),
          })
          .setTimestamp();
        await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
      }
    }
  }
};
