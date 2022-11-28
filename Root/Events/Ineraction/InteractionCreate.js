module.exports = {
	name: 'interactionCreate',
	run: async (interaction, client, container) => {
		const loadCommandOptions = require(`../../Structures/CommandOptions/loadCommandOptions`);
		const MaintenanceScehma = require('../../Database/Other/Maintenance.js');
		const ToggleCommandDevSchema = require('../../Database/Other/ToggleCommandDev');
		const BlacklistSchema = require('../../Database/Other/Blacklist');
		const fetch = require('node-fetch');

		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				const SupportLink = new container.Discord.MessageActionRow().addComponents([
					new container.Discord.MessageButton()
						.setLabel('Support Server')
						.setStyle('LINK')
						.setURL('https://discord.gg/7V9cgntvak')
						.setEmoji('<:link:938144203211427880>'),
				]);
				const embedMaintenance = new container.Discord.MessageEmbed()
					.setAuthor({ name: `Breaking News`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(
						`**> X4U Bot is currently __Undergoing Maintenance__.\n> So which You will not be able to access Onix commands.For updates go to support server.**`,
					)
					.setColor(client.embed.color.onix)
					.setFooter({
						text: client.user.username + ' - Maintenance',
						iconURL: client.user.displayAvatarURL({ dynamic: true }),
					});
				return interaction.reply({ embeds: [embedMaintenance], components: [SupportLink] });
			}
		}

		const ToggleCommandDev = await ToggleCommandDevSchema.findOne({ Command: interaction.commandName });
		if (ToggleCommandDev) {
			if (ToggleCommandDev.toggleStatus === true) {
				const SupportLink = new container.Discord.MessageActionRow().addComponents([
					new container.Discord.MessageButton()
						.setLabel('Support Server')
						.setStyle('LINK')
						.setURL('https://discord.gg/7V9cgntvak')
						.setEmoji('<:link:938144203211427880>'),
				]);
				const embedMaintenance = new container.Discord.MessageEmbed()
					.setDescription(
						`**> Command has been temporary disabled by the owner.\n> Get the last updates by joining our server!**`,
					)
					.setColor(client.embed.color.onix)
					.setFooter({
						text: client.user.username + ' - Disabled Command',
						iconURL: client.user.displayAvatarURL({ dynamic: true }),
					});
				return interaction.reply({ embeds: [embedMaintenance], components: [SupportLink] });
			}
		}

		const BlacklistUser = await BlacklistSchema.findOne({ userID: interaction.user.id });
		if (BlacklistUser) {
			if (BlacklistUser.type === 'user') {
				const embedBlacklist = new container.Discord.MessageEmbed()
					.setAuthor({ name: `Blacklist User`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(`**> ${interaction.user} You are blacklisted from the bot :(**`)
					.setColor(client.embed.color.red)
					.setFooter({
						text: client.user.username + ' - Blacklist',
						iconURL: client.user.displayAvatarURL({ dynamic: true }),
					});
				return interaction.reply({ embeds: [embedBlacklist] });
			}
		}

		if (interaction.isCommand()) {
			loadCommandOptions(
				client,
				interaction,
				client.commands.slashCommands.get(interaction.commandName),
				true,
				'SlashCommand',
			);
		} else if (interaction.isButton()) {
			loadCommandOptions(client, interaction, client.commands.buttonCommands.get(interaction.customId), true, 'Button');
		} else if (interaction.isSelectMenu()) {
			let Array = interaction.values;
			Array.forEach(async (value) => {
				loadCommandOptions(
					client,
					interaction,
					client.commands.selectMenus.get(value ?? interaction.customId),
					true,
					'SelectMenus',
				);
			});
		} else if (interaction.isContextMenu()) {
			await interaction.deferReply({ ephemeral: true }).catch((e) => {});
			loadCommandOptions(
				client,
				interaction,
				client.commands.contextMenus.get(interaction.commandName),
				true,
				'ContextMenus',
			);
		} else if (interaction.isAutocomplete()) {
			switch (interaction.commandName) {
				case 'npm':
					const userInput = interaction.options.getFocused().toString();
					const getFullInput = interaction.options.getFocused(true);
					const text = getFullInput.name === 'package' ? getFullInput.value : interaction.options.getString('package');
					let url = await fetch(`https://api.npms.io/v2/search?q=${text}`).then((response) => response.json());

					if (!text) {
						return interaction.respond([
							{
								name: 'Please enter a package name',
								value: userInput,
							},
						]);
					} else {
						const filtered = url.results.filter((x) => x.package.name?.toLowerCase().includes(text.toLowerCase()));

						await interaction
							.respond(
								filtered
									.map((choice) => ({
										name: choice.package.name,
										value: choice.package.name,
									}))
									.slice(0, 25),
							)
							.catch((err) => {
								console.log(err.message);
							});
					}
					break;
				case 'anime':
					const userInput2 = interaction.options.getFocused().toString();
					const getFullInput2 = interaction.options.getFocused(true);
					const text2 = getFullInput2.name === 'name' ? getFullInput2.value : interaction.options.getString('name');
					if (!text2) {
						return interaction.respond([
							{
								name: 'Please provide a valid to search',
								value: userInput2,
							},
						]);
					} else {
						const malScraper = require('mal-scraper');
						const r = await malScraper.getResultsFromSearch(text2);

						await interaction
							.respond(
								r
									.map((choice) => ({
										name: choice.name,
										value: choice.name,
									}))
									.slice(0, 10),
							)
							.catch((err) => {
								console.log(err.message);
							});
					}
					break;
			}
		}
	},
};
