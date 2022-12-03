require('dotenv').config();
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const Logger = require('./Logger.js');
const signale = require('signale');
const fs = require('fs');
const CommandsFolder = fs.readdirSync('./Src/Commands/');
const ListenersFolder = fs.readdirSync('./Src/Listeners/');
const ButtonsFolders = fs.readdirSync('./Src/Components/Buttons');
const ModalsFolders = fs.readdirSync('./Src/Components/Modals');
const MenusFolders = fs.readdirSync('./Src/Components/Menus');
const Config = require('../Assets/Config');
module.exports = class Client extends Discord.Client {
  constructor() {
    super({
      intents: [
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
      ],
      partials: [
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.User,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildPresences,
      ],
      makeCache: Discord.Options.cacheWithLimits({
        ...Discord.Options.defaultMakeCacheSettings,
        MessageManager: {
          sweepInterval: 300,
          sweepFilter: Discord.Sweepers.filterByLifetime({
            lifetime: 1800,
            getComparisonTimestamp: (e) => e.editedTimestamp || e.createdTimestamp,
          }),
          maxSize: 5,
        },
      }),
      allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true },
      restTimeOffset: 0,
    });
    this.contextMenuCommands = new Discord.Collection();
    this.commands = new Discord.Collection();
    this.buttons = new Discord.Collection();
    this.modals = new Discord.Collection();
    this.menus = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.logger = new Logger(
      {
        displayTimestamp: true,
        displayDate: true,
      },
      this,
    );
    this.config = require('../Assets/Config');
    this.messageHelper = require('../Helpers/MessageHelper');
    this.utils = require('../Utils/Data');
    this.Discord = Discord;
    this.basics = ['931455955013599273', '936580225846902855'];
  }

  loadCommands() {
    const commands = [];
    CommandsFolder.forEach((category) => {
      const categories = fs.readdirSync(`./Src/Commands/${category}/`).filter((file) => file.endsWith('.js'));
      categories.forEach((command) => {
        const f = require(`../Commands/${category}/${command}`);
        const cmd = new f(this, f);
        cmd.category = category;
        cmd.file = f;
        cmd.fileName = f.name;
        this.commands.set(cmd.name, cmd);
        if (cmd.aliases && Array.isArray(cmd.aliases)) {
          for (const alias of cmd.aliases) {
            this.aliases.set(alias, cmd);
          }
        }

        if (cmd.slashCommand) {
          const data = {
            name: cmd.name,
            description: cmd.description.content,
            options: cmd.options,
            type: Discord.ApplicationCommandType.ChatInput,
          };
          commands.push(data);
        }

        if (cmd.contextMenu != null) {
          const data = {
            name: cmd.contextMenu.name,
            type: cmd.contextMenu.type,
          };
          commands.push(data);
          this.contextMenuCommands.set(cmd.contextMenu.name, cmd);
        }
      });
    });

    const rest = new REST({ version: '10' }).setToken(Config.Danger.Token);
    rest
      .put(Routes.applicationCommands(Config.Danger.ClientId), { body: commands })
      .then(() => this.logger.success('Successfully registered application commands.'))
      .catch((e) => signale.error(e));
  }

  loadListeners() {
    ListenersFolder.forEach(async (eventFolder) => {
      const events = fs.readdirSync(`./Src/Listeners/${eventFolder}`).filter((c) => c.split('.').pop() === 'js');
      events.forEach(async (eventStr) => {
        if (!events.length) throw Error('No event files found!');
        const file = require(`../Listeners/${eventFolder}/${eventStr}`);
        const event = new file(this, file);
        const eventName = eventStr.split('.')[0].charAt(0).toLowerCase() + eventStr.split('.')[0].slice(1);
        this.on(eventName, (...args) => event.run(...args));
      });
    });
  }

  loadComponents() {
    const componentFolders = fs.readdirSync('./Src/Components/');
    for (const component of componentFolders) {
      const componentFiles = fs.readdirSync(`./Src/Components/${component}`);
      switch (component) {
        case 'Buttons':
          this.loadButtons(componentFiles);
          break;
        case 'Modals':
          this.loadModals(componentFiles);
          break;
        case 'Menus':
          this.loadMenus(componentFiles);
          break;
        default:
          break;
      }
    }
  }

  loadButtons() {
    ButtonsFolders.forEach(async (buttonsFolder) => {
      const buttons = fs.readdirSync(`./Src/Components/Buttons/${buttonsFolder}`).filter((c) => c.split('.').pop() === 'js');
      buttons.forEach(async (buttonStr) => {
        const file = require(`../Components/Buttons/${buttonsFolder}/${buttonStr}`);
        const button = new file(this, file);
        this.buttons.set(button.id, button);
      });
    });
  }

  loadModals() {
    ModalsFolders.forEach(async (modalFolder) => {
      const modals = fs.readdirSync(`./Src/Components/Modals/${modalFolder}`).filter((c) => c.split('.').pop() === 'js');
      modals.forEach(async (modalStr) => {
        const file = require(`../Components/Modals/${modalFolder}/${modalStr}`);
        const modal = new file(this, file);
        this.modals.set(modal.id, modal);
      });
    });
  }

  loadMenus() {
    MenusFolders.forEach(async (modalFolder) => {
      const modals = fs.readdirSync(`./Src/Components/Menus/${modalFolder}`).filter((c) => c.split('.').pop() === 'js');
      modals.forEach(async (modalStr) => {
        const file = require(`../Components/Menus/${modalFolder}/${modalStr}`);
        const menu = new file(this, file);
        this.menus.set(menu.id, menu);
      });
    });
  }

  async login(token) {
    super.login(token);
    this.loadCommands();
    this.loadListeners();
    this.loadComponents();
  }
};
/*
rest
  .put(Routes.applicationGuildCommands(Config.Danger.ClientId, Config.Danger.GuildId), { body: [] })
  .then(() => this.logger.success('Successfully Removed application commands , PLESAE WAIT FOR 5m.'))
  .catch((e) => signale.error(e));

  .put(Routes.applicationGuildCommands(Config.Danger.ClientId, Config.Danger.GuildId), { body: commands })
  .then(() => this.logger.success('Successfully registered application commands in guild.'))
  .catch((e) => signale.error(e));
rest
  .put(Routes.applicationCommands(Config.Danger.ClientId), { body: [] })
  .then(() => this.logger.success('Successfully Removed application commands , PLESAE WAIT FOR 5m.'))
  .catch((e) => signale.error(e));
rest
  .put(Routes.applicationCommands(Config.Danger.ClientId), { body: commands })
  .then(() => this.logger.success('Successfully registered application commands.'))
  .catch((e) => signale.error(e));

*/
