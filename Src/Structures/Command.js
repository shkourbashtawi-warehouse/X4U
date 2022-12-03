module.exports = class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.description = {
      content: options.description ? options.description.content || 'No description provided' : 'No description provided',
      usage: options.description ? options.description.usage || 'No usage provided' : 'No usage provided',
      examples: options.description ? options.description.examples || ['No examples provided'] : ['No examples provided'],
    };

    this.category = options.category || 'Public';
    this.cooldown = options.cooldown || 3;
    this.aliases = options.aliases || 'N/A';
    this.args = options.args || false;
    this.guildOnly = options.guildOnly || false;
    this.acceptsAttachments = options.acceptsAttachments || false;
    this.isEnabled = options.isEnabled || true;
    this.hide = options.hide || false;

    this.permissions = {
      dev: options.permissions ? options.permissions.dev || false : false,
      team: options.permissions ? options.permissions.team || [] : [],
      botPermissions: options.permissions ? options.permissions.botPermissions || [] : [],
      userPermissions: options.permissions ? options.permissions.userPermissions || [] : [],
    };

    this.type = options.type || client.Discord.ApplicationCommandType.ChatInput;
    this.options = options.options || [];
    this.slashCommand = options.slashCommand || false;
    this.file = options.file || null;
    this.contextMenu = options.contextMenu
      ? {
          name: options.contextMenu.name || options.name,
          type: options.contextMenu.type || client.Discord.ApplicationCommandType.User,
        }
      : null;
  }
};
