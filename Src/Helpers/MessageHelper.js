module.exports = class MessageHelper {
  constructor(client, ctx) {
    this.client = client;
    this.ctx = ctx;
    this._group = null;
    this._subcommand = null;
  }

  async createUserWith(UserId) {
    this.member = await User.findOne({
      userId: UserId,
    });
    if (!this.member) {
      const newUser = new User({
        userId: UserId,
      });
      await newUser.save().catch((e) => this.client.logger.error(e));
      this.member = await User.findOne({ userId: UserId });
    }
  }

  async getPrefixFromMessage(rawMessageContent, mentionPrefix) {
    if (rawMessageContent.indexOf(this.client.config.Danger.Prefix) === 0) {
      return this.client.config.Danger.Prefix;
    } else if (rawMessageContent.split(' ')[0].match(mentionPrefix)) {
      return mentionPrefix;
    } else {
      return undefined;
    }
  }

  get(name, required = false) {
    this._hoistedOptions = this.ctx.interaction.options._hoistedOptions;
    const option = this._hoistedOptions.find((opt) => opt.name === name);
    if (!option) {
      if (required) {
        return this.client.logger.error(`Required option "${name}" not found.`);
      }
      return null;
    }
    return option;
  }
  _getTypedOption(name, type, properties, required) {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (option.type !== type) {
      return this.client.logger.error(`Option "${name}" is of type: ${option.type}; expected ${type}`);
    } else if (required && properties.every((prop) => option[prop] === null || typeof option[prop] === 'undefined')) {
      return this.client.logger.error(`Required option "${name}" is of type: ${option.type}; expected a non-empty value.`);
    }
    return option;
  }

  getSubcommandGroup(required = false) {
    this._hoistedOptions = this.ctx.interaction.options._group;
    if (this._hoistedOptions[0]?.type === this.client.Discord.ApplicationCommandOptionType.SubcommandGroup) {
      this._group = this._hoistedOptions[0].name;
      this._hoistedOptions = this._hoistedOptions[0].options ?? [];
    }
    if (required && !this._group) {
      return this.client.logger.error('No subcommand group specified for interaction');
    }
    return this._group;
  }

  getSubcommand(required = true) {
    this._subcommand = this.ctx.interaction.options._subcommand;
    if (required && !this._subcommand) {
      return this.client.logger.error('No subcommand specified for interaction');
    }
    return this._subcommand;
  }

  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.Boolean, ['value'], required);
    return option?.value ?? null;
  }

  getChannel(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.Channel, ['channel'], required);
    return option?.channel ?? null;
  }

  getString(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.String, ['value'], required);
    return option?.value ?? null;
  }

  getInteger(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.Integer, ['value'], required);
    return option?.value ?? null;
  }

  getNumber(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.Number, ['value'], required);
    return option?.value ?? null;
  }

  getUser(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.User, ['user'], required);
    return option?.user ?? null;
  }

  getMember(name) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.User, ['member'], false);
    return option?.member ?? null;
  }

  getRole(name, required = false) {
    const option = this._getTypedOption(name, this.client.Discord.ApplicationCommandOptionType.Role, ['role'], required);
    return option?.role ?? null;
  }

  getAttachment(name, required = false) {
    const option = this._getTypedOption(
      name,
      this.client.Discord.ApplicationCommandOptionType.Attachment,
      ['attachment'],
      required,
    );
    return option?.attachment ?? null;
  }

  getMentionable(name, required = false) {
    const option = this._getTypedOption(
      name,
      this.client.Discord.ApplicationCommandOptionType.Mentionable,
      ['user', 'member', 'role'],
      required,
    );
    return option?.member ?? option?.user ?? option?.role ?? null;
  }

  getMessage(name, required = false) {
    const option = this._getTypedOption(name, '_MESSAGE', ['message'], required);
    return option?.message ?? null;
  }

  getFocused(getFull = false) {
    this._hoistedOptions = ctx.interaction.options._hoistedOptions;
    const focusedOption = this._hoistedOptions.find((option) => option.focused);

    if (!focusedOption) return this.client.logger.error('No focused option for autocomplete interaction');
    return getFull ? focusedOption : focusedOption.value;
  }

  sendResponse(type) {
    switch (type) {
      case 'noUser': {
        this.ctx.sendEphemeralReply('Please provide a valid user.');
        break;
      }
      case 'noRole': {
        this.ctx.sendEphemeralReply('Please provide a valid role.');
        break;
      }
      case 'noChannel': {
        this.ctx.sendEphemeralReply('Please provide a valid text channel.');
        break;
      }
      case 'noNumber': {
        this.ctx.sendEphemeralReply('Please provide a valid number.');
        break;
      }
      case 'noTime': {
        this.ctx.sendEphemeralReply('Please provide a valid data');
        break;
      }
      default: {
        this.ctx.sendEphemeralReply(this.client.error());
      }
    }
  }

  async paginate(pages, userId, timeout, buttonRow) {
    if (pages.length < 2) return this.ctx.sendReply({ embeds: pages });
    let page = 0;

    const buttons = buttonRow
      ? buttonRow
      : new this.client.Discord.ActionRowBuilder().addComponents(
          new this.client.Discord.ButtonBuilder()
            .setCustomId('backmuch')
            .setLabel('⏮')
            .setStyle(this.client.Discord.ButtonStyle.Primary),
          new this.client.Discord.ButtonBuilder()
            .setCustomId('back')
            .setLabel('◀️')
            .setStyle(this.client.Discord.ButtonStyle.Primary),
          new this.client.Discord.ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶️')
            .setStyle(this.client.Discord.ButtonStyle.Primary),
          new this.client.Discord.ButtonBuilder()
            .setCustomId('nextmuch')
            .setLabel('⏭')
            .setStyle(this.client.Discord.ButtonStyle.Primary),
        );

    const message = await this.ctx.sendReply({
      embeds: [pages[page]],
      components: [buttons],
      fetchReply: true,
    });

    const filter = () => this.ctx.user.id === userId;
    const interactionCollector = message.createMessageComponentCollector({
      filter: filter,
      componentType: 2,
      max: pages.length * 2,
    });

    interactionCollector.on('collect', async (interaction) => {
      if (interaction.user.id === userId) {
        if (interaction.component.customId === 'backmuch') {
          page = 0;
        }
        if (interaction.component.customId === 'back') {
          if (page == 0) page = pages.length - 1;
          else page--;
        } else if (interaction.component.customId === 'next') {
          if (page == pages.length - 1) page = 0;
          else page++;
        } else if (interaction.component.customId === 'nextmuch') {
          page = pages.length - 1;
        }

        await interaction.update({
          embeds: [pages[page]],
        });
      }
    });

    interactionCollector.on('end', async () => {
      await message.edit({ components: [] });
    });

    setTimeout(
      async () => {
        interactionCollector.stop('Timeout');
        await message.edit({ components: [] });
      },
      timeout ? timeout : 300000,
    );
  }
};
