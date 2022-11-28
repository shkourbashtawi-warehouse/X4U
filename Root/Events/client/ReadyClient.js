module.exports = {
	name: 'ready',
	run: async (client) => {
		require('dotenv').config();
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const chalk = require('chalk');
		const mongoose = require('mongoose');
		const { MessageEmbed } = require('discord.js');
		const CronJob = require('cron').CronJob;

		//MongoDB
		const MongoDBOption = {
			keepAlive: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
		if (process.env.MongoDB) chalk.bold.magenta('[Database]') + chalk.bold.blueBright(`Database failed to load`);
		mongoose.connect(process.env.MongoDB, MongoDBOption).catch((e) => {
			console.log(chalk.bold.magenta('[Database] ') + chalk.bold.blueBright(`${e.message}`));
			client.database = null;
		});
		mongoose.Promise = global.Promise;
		mongoose.connection.on('err', (err) => {
			console.log(chalk.bold.magenta('[Database]') + chalk.bold.blueBright(` Mongoose connection error: ${err.stack}`));
		});
		mongoose.connection.on('disconnected', () => {
			console.log(chalk.bold.magenta('[Database]') + chalk.bold.blueBright(` Mongoose connection lost`));
		});

		//Console Log Ready
		console.log(chalk.bold.magenta('[Client Status]') + chalk.bold.blueBright(` C L I E N T   I N F O R M A T I O N:`));
		console.log(`Client Details    :   ${client.user.tag}
Guilds Count      :   ${client.guilds.cache.size}
User Count        :   ${client.users.cache.size}
NodeJS Version    :   ${process.version}
Database MongoDB  :   ${
			mongoose.connection.readyState === 1 || 2
				? chalk.bold.greenBright('Connected')
				: chalk.bold.redBright('Not Connected')
		}

`);

		console.log(
			chalk.bold.magenta('[Client Commands]') + chalk.bold.blueBright(` C O M M A N D S   I N F O R M A T I O N:`),
		);
		console.log(`MessageCommands            :    Initiating ${client.commands.messageCommands.size} messageCommands.
MessageCommands Aliases    :    Initiating ${client.commands.messageCommands.aliases.size} messageCommands Aliases.
SlashCommands              :    Initiating ${client.commands.slashCommands.size} slashCommands.
SelectMenus                :    Initiating ${client.commands.selectMenus.size} selectMenus.
ContextMenus               :    Initiating ${client.commands.contextMenus.size} contextMenus.
ButtonCommands             :    Initiating ${client.commands.buttonCommands.size} buttonCommands.
Client Events              :    Initiating ${client.events.size} events.
`);

		//Bot Status
		var job = new CronJob(
			'*/15 * * * *',
			async () => {
				const maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
				if (maintenance) {
					if (maintenance.toggleStatus === false) {
						client.user.setActivity('I am a servant to X4UTEAM', {
							type: `WATCHING`,
						});
						client.user.setStatus('dnd');
					} else if (maintenance.toggleStatus === true) {
						client.user.setActivity('Under Maintenance', {
							type: `WATCHING`,
						});
						client.user.setStatus('idle');
					}
				}
			},
			null,
			true,
		);
		job.start();

		//RoleTime System
		const RoleTime = require('../../Database/Other/RoleTime');
		setTimeout(async () => {
			let data = await RoleTime.find({});
			data.forEach(async (d) => {
				let guild = await client.guilds.cache.get(d.guildID);
				if (!guild) return;
				let user = await guild.members.fetch(d.userID).catch(() => {});
				if (!user) return;
				d.data.forEach(async (dd) => {
					setTime(async () => {
						let data1 = await RoleTime.findOne({
							userID: user.user.id,
							guildID: guild.id,
						});

						if (!data1) return;
						let role = guild.roles.cache.get(dd.role);
						let index = data1.data.findIndex((e) => e.role === dd.role);
						if (index === -1) return;
						data1.data.splice(index, 1);
						await data1.save();
						if (!role) return;
						await user.roles.remove(role).catch((err) => 0);
						if (data1.data.length === 0) {
							await RoleTime.findOneAndDelete({
								userID: user.user.id,
								guildID: guild.id,
							});
						}
					}, dd.time);
				});
			});
		}, 30000);

		function setTime(func, time) {
			let date = new Date().getTime();
			date = time - date;
			if (date > 24 * 24 * 60 * 60 * 1000) {
				setTimeout(() => setTime(func, time), 24 * 24 * 60 * 60 * 1000);
			} else {
				setTimeout(func, date);
			}
		}
	},
};
