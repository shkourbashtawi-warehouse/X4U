const AutoReactionSchema = require('../../../Database/Other/AutoReaction');
module.exports = {
	name: 'setup-autoreaction',
	description: 'setup-auroreaction | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			type: 1,
			name: 'add-reaction',
			description: 'With this option, you can add a reaction to the message that will be placed on the messages.',
			options: [
				{
					name: 'channel',
					description: 'The channel in which there is the reaction when sending a message.',
					type: 7,
					channel_types: [0],
					required: true,
				},
				{
					name: 'emoji',
					description: 'The emoji that will trigger the AutoReaction.',
					type: 3,
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'delete-reaction',
			description: 'With this option, you can delete a reaction from the message that will be placed on the messages.',
			options: [
				{
					name: 'channel',
					description: 'The channel in which there is the reaction when sending a message that you want to delete.',
					type: 7,
					channel_types: [0],
					required: true,
				},
				{
					name: 'emojiid',
					description: 'The emoji that will trigger the AutoReaction.',
					type: 3,
					required: true,
				},
			],
		},
		{
			name: 'toggle',
			description: 'With this option you can turn on or off Auto Reaction.',
			type: 1,
			options: [
				{
					name: 'choice',
					description: 'Choose true(Enable) or false(Disable).',
					type: 5,
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'list-reaction',
			description: 'With this option, you can list all the reactions that are currently set.',
		},
	],
	run: async (client, interaction, container) => {
		const channel = interaction.options.getChannel('channel');
		const emoji = interaction.options.getString('emoji');
		if (interaction.options.getSubcommand() === 'add-reaction') {
			const CheckToggle = await AutoReactionSchema.findOne({
				guildID: interaction.guild.id,
				toggleStatus: false,
			});

			if (CheckToggle) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Error')
					.setDescription('> AutoReaction is disabled, Please enable it `/setup-autoreaction toggle`.')
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const CheckReaction = await AutoReactionSchema.findOne({
				guildID: interaction.guild.id,
				channelID: channel.id,
			});

			if (CheckReaction) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Error')
					.setDescription('> This channel it used to reaction.')
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const Results = await AutoReactionSchema.find({
				guildID: interaction.guild.id,
			});

			if (Results.length >= 10) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Error')
					.setDescription(
						"> You can't add more 10 reaction's in this guild.\nPlease use comamnd `/setup-autoreaction list-reaction` to see all reaction's and delete some reacion's `/setup-autoreaction delete-reaction`.",
					)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			try {
				emoji.split(':')[2].split('>')[0];
			} catch (error) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Error')
					.setDescription('> Please enter a custom emoji like <:earth:938144201424658482>')
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const CheckEmoji = interaction.guild.emojis.cache.find((e) => e.id === emoji.split(':')[2].split('>')[0]);
			if (!CheckEmoji) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Error')
					.setDescription('> The emoji you entered is not in the guild.')
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const EmojiIDSplit = emoji.split(':')[2].split('>')[0];

			const settings = await AutoReactionSchema.findOne({
				guildID: interaction.guild.id,
				channelID: channel.id,
				emojiID: EmojiIDSplit,
			});

			if (!settings) {
				const newSettings = new AutoReactionSchema({
					guildID: interaction.guild.id,
					channelID: channel.id,
					emojiObject: emoji,
					emojiID: EmojiIDSplit,
					toggleStatus: true,
				});
				await newSettings.save();
				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Add Reaction To Channel')
					.setDescription(`> Channel ${channel} added successfully to auto reaction.\n> Emoji : ${emoji}`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed1] });
			}

			if (settings) {
				await AutoReactionSchema.findOneAndDelete({
					guildID: interaction.guild.id,
					channelID: channel.id,
					emojiID: EmojiIDSplit,
				});
				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Remove Reaction From Channel')
					.setDescription(`> Channel ${channel} removed successfully.\n> Emoji : ${emoji}`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed2] });
			}
		}

		if (interaction.options.getSubcommand() === 'delete-reaction') {
			const emoji = interaction.options.getString('emojiid');
			const settings = await AutoReactionSchema.findOne({
				guildID: interaction.guild.id,
				channelID: channel.id,
				emojiObject: emoji,
			});

			if (!settings) {
				const embed3 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Delete Reaction From Channel')
					.setDescription(`> Channel ${channel} doesn't have that reaction`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed3] });
			}

			if (settings) {
				await AutoReactionSchema.findOneAndDelete({
					guildID: interaction.guild.id,
					channelID: channel.id,
					emojiObject: emoji,
				});
				const embed4 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Remove Reaction From Channel')
					.setDescription(`> Channel ${channel} Removed successfully reaction.\n> Emoji : ${emoji}`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed4] });
			}
		}

		if (interaction.options.getSubcommand() === 'list-reaction') {
			const Results = await AutoReactionSchema.find({
				guildID: interaction.guild.id,
			});

			if (Results.length === 0) {
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | List Reaction')
					.setDescription(`> There is no reaction in this server.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed5] });
			}

			if (Results.length > 0) {
				Results.forEach(async (e) => {
					const channel = await interaction.guild.channels.cache.get(e.channelID);
					if (channel === undefined || channel === null || channel === 'undefined' || channel === 'null' || !channel) {
						await AutoReactionSchema.findOneAndDelete({
							guildID: interaction.guild.id,
							channelID: e.channelID,
						});
					}
				});
			}

			const ResultsTwo = await AutoReactionSchema.find({
				guildID: interaction.guild.id,
			});

			if (ResultsTwo.length === 0) {
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | List Reaction')
					.setDescription(`> There is no reaction in this server.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed5] });
			}

			if (ResultsTwo.length > 0) {
				const embed6 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | List Reaction')
					.setDescription(
						`> List of reaction in this server.\n\n${ResultsTwo.map(
							(cmd, i) => `${i + 1} : **${cmd.emojiObject}** - **<#${cmd.channelID}>**`,
						).join('\n')}`,
					)
					.setColor(client.embed.color.green)
					.setFooter({
						text: `Use /setup-autoreaction list-reaction again to to remove (#deleted-channel).`,
					});
				return await interaction.reply({ embeds: [embed6] });
			}
		}

		if (interaction.options.getSubcommand() === 'toggle') {
			const toggle = interaction.options.getBoolean('choice');
			const settings = await AutoReactionSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new AutoReactionSchema({
					guildID: interaction.guild.id,
					toggleStatus: toggle,
				});
				await newSettings.save();
				const embed7 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Toggle Setup')
					.setDescription(`> AutoReaction toggle update to **${toggle}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed7],
				});
			}
			if (settings) {
				await AutoReactionSchema.updateMany({ guildID: interaction.guild.id }, { toggleStatus: toggle });
				const embed8 = new container.Discord.MessageEmbed()
					.setTitle('Auto Reaction | Toggle Setup')
					.setDescription(`> AutoReaction toggle update to **${toggle}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed8],
				});
			}

			await settings.save();
			const embed9 = new container.Discord.MessageEmbed()
				.setTitle('Auto Reaction | Toggle Setup')
				.setDescription(`> AutoReaction toggle update to **${toggle}**`)
				.setColor(client.embed.color.green);
			return interaction.reply({
				embeds: [embed9],
			});
		}
	},
};
