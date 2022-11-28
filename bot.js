(async () => {
	require('dotenv').config();
	const Discord = require('discord.js');
	const embed = require('./Assets/embed');
	const config = require('./Root/Storage/Vault/Config');
	const dataid = require('./Root/Storage/Vault/DataID');
	const WebhookError = new Discord.WebhookClient({ url: config.WebhookError });
	const path = __dirname;
	const client = new Discord.Client({
		intents: [
			Discord.Intents.FLAGS.GUILDS,
			Discord.Intents.FLAGS.GUILD_MEMBERS,
			Discord.Intents.FLAGS.GUILD_BANS,
			Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
			Discord.Intents.FLAGS.GUILD_INVITES,
			Discord.Intents.FLAGS.GUILD_WEBHOOKS,
			Discord.Intents.FLAGS.GUILD_VOICE_STATES,
			Discord.Intents.FLAGS.GUILD_MESSAGES,
			Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
			Discord.Intents.FLAGS.DIRECT_MESSAGES,
			Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		],
		partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
		shardCount: 1,
	});

	require('events').EventEmitter.setMaxListeners(35);

	require('./Server/server.js')(client);

	exports.client = client;
	exports.path = path;
	exports.config = config;
	exports.dataid = dataid;

	client.commands = {};
	client.events = new Discord.Collection();
	client.commands.messageCommands = new Discord.Collection();
	client.commands.messageCommands.aliases = new Discord.Collection();
	client.commands.contextMenus = new Discord.Collection();
	client.commands.slashCommands = new Discord.Collection();
	client.commands.buttonCommands = new Discord.Collection();
	client.commands.selectMenus = new Discord.Collection();
	client.categories = require('fs').readdirSync(`./Root/Commands/MessageCommands`);
	client.slashcategories = require('fs').readdirSync(`./Root/Commands/SlashCommands`);

	client.embed = embed;
	client.WebhookError = WebhookError;

	path.config = require(`${path}/Root/Storage/Vault/Config`);
	path.dataid = require(`${path}/Root/Storage/Vault/DataID`);

	const Handler = require(`${path}/Root/Structures/Handlers/Handler`);
	await Handler.loadMessageCommands(client, path).catch(() => {});
	await Handler.loadEvents(client).catch(() => {});
	await client.login(process.env.Token);
	await Handler.loadSlashCommands(client, path).catch(() => {});
	await Handler.loadContextMenus(client, path).catch(() => {});
	await Handler.loadButtonCommands(client, path).catch(() => {});
	await Handler.loadSelectMenus(client, path).catch(() => {});
	
})().catch(() => {});