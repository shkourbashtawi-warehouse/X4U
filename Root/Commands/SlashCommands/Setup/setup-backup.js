const backup = require('discord-backup');
module.exports = {
	name: 'setup-backup',
	description: 'Setup backup system | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'create',
			type: 'SUB_COMMAND',
			description: 'Create Backup',
		},
		{
			name: 'info',
			type: 'SUB_COMMAND',
			description: 'Get a Info About a Backup Id',
			options: [
				{
					name: 'backup-id',
					type: 'STRING',
					description: 'The backup id you want info about',
					required: true,
				},
			],
		},
		{
			name: 'load',
			type: 'SUB_COMMAND',
			description: 'Load your Backup',
			options: [
				{
					name: 'backup-id',
					type: 'STRING',
					description: 'The backup id you want to load',
					required: true,
				},
			],
		},
		{
			name: 'delete',
			type: 'SUB_COMMAND',
			description: 'Delete a Backup',
			options: [
				{
					name: 'backup-id',
					type: 'STRING',
					description: 'The backup id you want to delete',
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'create') {
			const ConfirmEmbed = new container.Discord.MessageEmbed()
				.setTitle('Backup System | Create Backup')
				.setDescription('> Are you sure you want to create a backup!?')
				.setColor(client.embed.color.orange);

			const row = new container.Discord.MessageActionRow()
				.addComponents(
					new container.Discord.MessageButton().setLabel('Yes').setStyle('SUCCESS').setCustomId('backup-yes-create'),
				)
				.addComponents(
					new container.Discord.MessageButton().setLabel('No').setStyle('DANGER').setCustomId('backup-no-create'),
				);

			interaction.reply({
				embeds: [ConfirmEmbed],
				components: [row],
				fetchReply: true,
			});

			const collector = await interaction.channel.createMessageComponentCollector({
				time: 10000,
				componentType: 'BUTTON',
			});

			collector.on('collect', async (i) => {
				if (i.customId === 'backup-yes-create') {
					if (i.user.id !== interaction.user.id)
						return i.reply({
							content: "Don't touch other people's button",
							ephemeral: true,
						});

					i.deferUpdate();
					const ConfirmEmbed1 = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Create Backup')
						.setDescription('> Are you sure you want to create a backup?')
						.setColor(client.embed.color.orange);
					const row1 = new container.Discord.MessageActionRow()
						.addComponents(
							new container.Discord.MessageButton()
								.setLabel('Yes')
								.setStyle('SUCCESS')
								.setCustomId('backup-yes-create')
								.setDisabled(true),
						)
						.addComponents(
							new container.Discord.MessageButton()
								.setLabel('No')
								.setStyle('DANGER')
								.setCustomId('backup-no-create')
								.setDisabled(true),
						);
					interaction.editReply({
						embeds: [ConfirmEmbed1],
						components: [row1],
					});

					backup
						.create(interaction.guild, {
							jsonBeautify: true,
							saveImages: 'base64',
							maxMessagesPerChannel: 5,
						})
						.then((backupData) => {
							let datacreated = new container.Discord.MessageEmbed()
								.setTitle('Backup System | Create Backup')
								.setDescription(
									`> New Backup Created\n> **Backup ID**: \`${backupData.id}\`\n> **Guild Name**: ${interaction.guild.name}`,
								)

								.setColor(client.embed.color.green);
							interaction.user.send({
								embeds: [datacreated],
							});
							let created = new container.Discord.MessageEmbed()
								.setAuthor({
									name: interaction.user.tag,
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								})
								.setDescription(`> Backup Has Been Created, Check your dms!`)
								.setColor(client.embed.color.red);

							interaction.channel.send({
								embeds: [created],
							});
						});
				} else if (i.customId === 'backup-no-create') {
					if (i.user.id !== interaction.user.id)
						return i.reply({
							content: "Don't touch other people's button",
							ephemeral: true,
						});
					i.deferUpdate();
					const ConfirmEmbed2 = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Create Backup')
						.setDescription('> Are you sure you want to create a backup?')
						.setColor(client.embed.color.red);

					const row2 = new container.Discord.MessageActionRow()
						.addComponents(
							new container.Discord.MessageButton()
								.setLabel('Yes')
								.setStyle('SUCCESS')
								.setCustomId('backup-yes-create')
								.setDisabled(true),
						)
						.addComponents(
							new container.Discord.MessageButton()
								.setLabel('No')
								.setStyle('DANGER')
								.setCustomId('backup-no-create')
								.setDisabled(true),
						);
					interaction.editReply({
						embeds: [ConfirmEmbed2],
						components: [row2],
					});
					const NoEmbed = new container.Discord.MessageEmbed()
						.setDescription(`> Cancelled The Backup!`)
						.setColor(client.embed.color.red);

					interaction.channel.send({
						embeds: [NoEmbed],
					});
				}
			});
		} else if (interaction.options.getSubcommand() === 'info') {
			let backupID = interaction.options.getString('backup-id');
			if (!backupID) {
				let notvaild = new container.Discord.MessageEmbed()
					.setTitle('Backup System | Info Backup')
					.setDescription(`> You must specify a valid backup ID `)
					.setColor(client.embed.color.red);

				return interaction.reply({
					embeds: [notvaild],
				});
			}
			backup
				.fetch(backupID)
				.then((backupInfos) => {
					const date = new Date(backupInfos.data.createdTimestamp);
					const yyyy = date.getFullYear().toString(),
						mm = (date.getMonth() + 1).toString(),
						dd = date.getDate().toString();
					const formatedDate = `${yyyy}/${mm[1] ? mm : '0' + mm[0]}/${dd[1] ? dd : '0' + dd[0]}`;
					let backups = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Info Backup')
						.setColor(client.embed.color.green)
						.setDescription(
							`> **Back Up Info**\n> Backup ID: ${backupInfos.id} \n> Server ID: ${backupInfos.data.guildID} \n> Backup Size: ${backupInfos.size} mb \n> Backup Created At: ${formatedDate}`,
						);

					interaction.reply({
						embeds: [backups],
					});
				})
				.catch((err) => {
					let nobackupfound = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Info Backup')
						.setDescription(`> No Backup Found For: \`${backupID}\`!`)
						.setColor(client.embed.color.red);
					interaction.reply({
						embeds: [nobackupfound],
					});
				});
		} else if (interaction.options.getSubcommand() === 'load') {
			const backupID = interaction.options.getString('backup-id');
			backup
				.fetch(backupID)
				.then(async () => {
					const eConfirmEmbed = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Load Backup')
						.setDescription(
							'> Are you sure you want to load the back!?\nThis will delete all channels, roles, messages, emojis, bans etc.\nNONE OF THE MEMBERS WILL BE KICKED!',
						)
						.setColor(client.embed.color.orange);
					const erow = new container.Discord.MessageActionRow()
						.addComponents(
							new container.Discord.MessageButton().setLabel('Yes').setStyle('SUCCESS').setCustomId('backup-yes-load'),
						)
						.addComponents(
							new container.Discord.MessageButton().setLabel('No').setStyle('DANGER').setCustomId('backup-no-load'),
						);

					interaction.reply({
						embeds: [eConfirmEmbed],
						components: [erow],
					});

					const collector = await interaction.channel.createMessageComponentCollector({
						time: 15000,
						componentType: 'BUTTON',
					});

					collector.on('collect', async (i) => {
						if (i.customId === 'backup-yes-load') {
							if (i.user.id !== interaction.user.id)
								return i.reply({
									content: "Don't touch other people's button",
									ephemeral: true,
								});

							i.deferUpdate();
							backup
								.load(backupID, interaction.guild, {
									clearGuildBeforeRestore: true,
								})
								.then(() => {})
								.catch((err) => {
									let permissionserorr = new container.Discord.MessageEmbed()
										.setTitle('Backup System | Load Backup')
										.setDescription(`> Iam not have completed the backup successfully!`)

										.setColor(client.embed.color.red);

									interaction.user.send({
										embeds: [permissionserorr],
									});
								});
						} else if (i.customId === 'backup-no-load') {
							if (i.user.id !== interaction.user.id)
								return i.reply({
									content: "Don't touch other people's button",
									ephemeral: true,
								});
							i.deferUpdate();
							const ConfirmEmbed2 = new container.Discord.MessageEmbed()
								.setTitle('Backup System | Load Backup')
								.setDescription('> Are you sure you want to create a backup!?')
								.setColor(client.embed.color.orange);

							const row2 = new container.Discord.MessageActionRow()
								.addComponents(
									new container.Discord.MessageButton()
										.setLabel('Yes')
										.setStyle('SUCCESS')
										.setCustomId('backup-no-load')
										.setDisabled(true),
								)
								.addComponents(
									new container.Discord.MessageButton()
										.setLabel('No')
										.setStyle('DANGER')
										.setCustomId('backup-yes-load')
										.setDisabled(true),
								);
							interaction.editReply({
								embeds: [ConfirmEmbed2],
								components: [row2],
							});
							const NoEmbed = new container.Discord.MessageEmbed()
								.setTitle('Backup System | Load Backup')
								.setDescription(`> Cancelled The Backup!`)
								.setColor(client.embed.color.green);
							interaction.channel.send({
								embeds: [NoEmbed],
							});
						}
					});
				})
				.catch((err) => {
					let nobackupfound = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Load Backup')
						.setDescription(`> No backup found for ${backupID}`)
						.setColor(client.embed.color.red);
					interaction.reply({
						embeds: [nobackupfound],
					});
				});
		} else if (interaction.options.getSubcommand() === 'delete') {
			let backupID = interaction.options.getString('backup-id');
			if (!backupID) {
				let notvaild = new container.Discord.MessageEmbed()
					.setTitle('Backup System | Delete Backup')
					.setDescription(`> You must specify a valid backup ID To Remove`)
					.setColor(client.embed.color.red);
				interaction.reply({
					embeds: [notvaild],
				});
			}
			backup
				.fetch(backupID)
				.then((backupInfos) => {
					backup.remove(backupID);
					let backups = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Delete Backup')
						.setDescription(`Backup Deleted!`)
						.setColor(client.embed.color.green);
					interaction.reply({
						embeds: [backups],
					});
				})
				.catch((err) => {
					let nobackupfound = new container.Discord.MessageEmbed()
						.setTitle('Backup System | Delete Backup')
						.setDescription(`> No backup found!`)
						.setColor(client.embed.color.red);
					interaction.reply({
						embeds: [nobackupfound],
					});
				});
		}
	},
};
