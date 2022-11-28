const { Command } = require('reconlx');
module.exports = new Command({
	name: 'help',
	description: `See My Commands`,
	usage: ['help <command>'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			type: 3,
			name: 'command',
			description: 'Get help for a specific command.',
		},
	],
	run: async (client, interaction, container) => {
		let userId = interaction.options.getString('command');
		const helpbox = `\`\`\`diff\n- [] Required Argument      <> Optional Argument -\`\`\``;
		if (userId) {
			const embed = new container.Discord.MessageEmbed();
			const cmd = client.commands.slashCommands.get(userId.toLowerCase());
			if (!cmd) {
				return interaction.reply({
					embeds: [
						embed
							.setColor(client.embed.color.red)
							.setDescription(`No Information found for command **${userId.toLowerCase()}**`),
					],
				});
			}
			if (cmd.name)
				embed.setAuthor({
					name: `Information about: ${cmd.name}`,
					iconURL: client.user.displayAvatarURL({ dynamic: true }),
				});
			if (cmd.description) embed.setDescription(`**Description:** ${cmd.description}`);
			if (cmd.usage) embed.addField('**Usage:**', `\`${cmd.usage}\``, true);
			if (cmd.cooldown) embed.addField('**Cooldown:**', `\`${cmd.cooldown} Seconds\``, true);
			if (cmd.category) embed.addField('**Category:**', `\`${cmd.category}\``, true);
			embed.setColor(client.embed.color.onix);
			embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
			embed.setFooter({
				text: `[] Required Argument | <> Optional Argument`,
			});
			embed.setTimestamp();
			return interaction.reply({
				embeds: [embed],
			});
		}
		let embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: client.user.username + ' Help',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(helpbox)
			.setImage('https://i.imgur.com/sSgkjUS.png')
			.setFooter({
				text: 'X4U Bot | Clone From Onix |' + interaction.guild.name,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp()
			.setColor(client.embed.color.onix);

		const emoji = {
			Public: '<:earth:938144201424658482>',
			Moderation: '<:mod:938144203991552090>',
			Fun: '<:fun:938147941728804884>',
			Context: '<:comment:938144199629479947>',
			Utility: '<:rules:938144206285832192>',
			Setup: '<:setting:938144207850315846>',
			ALLCommand: '<:earth:938144201424658482>',
		};
		const commands = (category) => {
			return client.commands.slashCommands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
		};
		try {
			for (let i = 0; i < client.slashcategories.length; i += 1) {
				const current = client.slashcategories[i];
				const items = commands(current);
				const firstLetter = current.charAt(0).toUpperCase() + current.slice(1);
				embed.addField(`**${firstLetter} [${items.length}]**`, `> ${items.join(', ')}`);
			}
		} catch (e) {
			console.log(e);
		}

		let raw = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageSelectMenu()
				.setCustomId('help-menu')
				.setPlaceholder(`Click to see my all Category`)
				.addOptions([
					client.slashcategories.map((cat) => {
						return {
							label: `${cat[0].toUpperCase() + cat.slice(1)}`,
							value: cat,
							emoji: emoji[cat],
							description: `Click to See Commands of ${cat}`,
						};
					}),
				]),
		]);
		let raw2 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setLabel('Support Server')
				.setStyle('LINK')
				.setURL('https://discord.gg/7V9cgntvak')
				.setEmoji('<:link:938144203211427880>'),
			new container.Discord.MessageButton()
				.setURL(
					'https://discord.com/api/oauth2/authorize?client_id=931455955013599273&permissions=8&scope=bot%20applications.commands',
				)
				.setLabel(`Invite Me`)
				.setStyle('LINK')
				.setEmoji('<:add:938144199117774858>'),
			new container.Discord.MessageButton()
				.setLabel(`TOP.GG`)
				.setStyle(`LINK`)
				.setURL(`https://top.gg/bot/931455955013599273`)
				.setEmoji('<:topgg:954225060380569640>'),
		]);

		interaction.reply({ embeds: [embed], components: [raw2] });

		/*
		const msg = await interaction.fetchReply();
		const filter = async (i) => {
			if (i.user.id !== interaction.user.id) {
				i.reply({
					content: `${i.user}, Don't help other people to select the menu or button`,
					ephemeral: true,
				});
				return false;
			}
			return true;
		};
	
		let colector = await msg.createMessageComponentCollector({
			filter: filter,
			time: 50000,
		});
		colector.on('collect', async (i) => {
			if (i.isButton()) {
				if (i.customId === 'home') {
					await i.deferUpdate().catch((e) => { });
					msg.edit({ embeds: [embed] }).catch((e) => { });
				}
			}
			if (i.isSelectMenu()) {
				if (i.customId === 'help-menu') {
					await i.deferUpdate().catch((e) => { });
					let [directory] = i.values;
	
					let aa = new container.Discord.MessageEmbed()
						.setColor(client.embed.color.onix)
						.setTitle(`All Commands of ${directory}`)
						.setDescription(
							`>>> ${client.commands.slashCommands
								.filter((cmd) => cmd.category === directory)
								.map((cmd) => {
									return [`\`${cmd.name}\``].join(' ');
								})
								.join(', ')}`,
						)
						.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
						.setImage('https://i.imgur.com/sSgkjUS.png')
						.setFooter({
							text: 'X4U Bot | ' + interaction.guild.name,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
						})
						.setTimestamp();
					msg.edit({ embeds: [aa] });
				}
			}
		});
		colector.on('end', async (menu) => {
			new container.Discord.MessageButton()
				.setLabel('Support Server')
				.setStyle('LINK')
				.setURL('https://discord.gg/7V9cgntvak')
				.setEmoji('<:link:938144203211427880>'),
				new container.Discord.MessageButton()
					.setURL(
						'https://discord.com/api/oauth2/authorize?client_id=931455955013599273&permissions=8&scope=bot%20applications.commands',
					)
					.setLabel(`Invite Me`)
					.setStyle('LINK')
					.setEmoji('<:add:938144199117774858>'),
				await interaction.editReply({ components: [raw2] });
		});
		*/
	},
});
