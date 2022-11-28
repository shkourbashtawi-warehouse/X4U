const LineChannelSchema = require('../../../Database/Settings/Line/LineChannel');
const LineURLSchema = require('../../../Database/Settings/Line/LineURL');
module.exports = {
	name: 'setup-autoline',
	description: 'Setup line system | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'With this option you can add or remove reply line in specific channel',
			type: 1,
			options: [
				{
					name: 'channel',
					description: 'What channel do you want your Azkar to be in',
					type: 7,
					channel_types: [0],
					required: true,
				},
			],
		},
		{
			name: 'url',
			description: 'With this option you can edit url line in Database',
			type: 1,
			options: [
				{
					name: 'line-url',
					description: 'Input Line URL to send it in channels',
					type: 3,
					required: true,
				},
			],
		},
		{
			name: 'list',
			description: 'With this option, you can list all the lines that are currently set.',
			type: 1,
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'channel') {
			const channel = interaction.options.getChannel('channel');

			const Results = await LineChannelSchema.find({
				guildID: interaction.guild.id,
			});

			if (Results.length >= 10) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Line System | Error')
					.setDescription("> You can't add more 10 line's in this guild.")
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const settings = await LineChannelSchema.findOne({
				guildID: interaction.guild.id,
				channelID: channel.id,
			});
			if (!settings) {
				const newSettings = new LineChannelSchema({
					guildID: interaction.guild.id,
					channelID: channel.id,
				});
				await newSettings.save();

				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('Line System | Channel Added')
					.setDescription(`> Channel ${channel} added successfully, Use command again to remove channel.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed2] });
			}

			if (settings) {
				await LineChannelSchema.findOneAndDelete({
					guildID: interaction.guild.id,
					channelID: channel.id,
				});

				const embed3 = new container.Discord.MessageEmbed()
					.setTitle('Line System | Channel Removed')
					.setDescription(`> Channel ${channel} removed successfully.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed3] });
			}
		}

		if (interaction.options.getSubcommand() === 'url') {
			const url = interaction.options.getString('line-url');

			const settings = await LineURLSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new LineURLSchema({
					guildID: interaction.guild.id,
					lineURL: url,
				});
				await newSettings.save();

				const embed = new container.Discord.MessageEmbed()
					.setTitle('Line System | Add Line')
					.setDescription(`> LineURL added successfully`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed] });
			}

			if (settings) {
				settings.lineURL = url;
				await settings.save();

				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Line System | Edit Line')
					.setDescription(`> LineURL update successfully`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed1] });
			}
		}

		if (interaction.options.getSubcommand() === 'list') {
			const Results = await LineChannelSchema.find({
				guildID: interaction.guild.id,
			});

			if (Results.length === 0) {
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle('Line System | List Lines')
					.setDescription(`> There is no reaction in this server.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed5] });
			}

			if (Results.length > 0) {
				Results.forEach(async (e) => {
					const channel = await interaction.guild.channels.cache.get(e.channelID);
					if (channel === undefined || channel === null || channel === 'undefined' || channel === 'null' || !channel) {
						await LineChannelSchema.findOneAndDelete({
							guildID: interaction.guild.id,
							channelID: e.channelID,
						});
					}
				});
			}

			const ResultsTwo = await LineChannelSchema.find({
				guildID: interaction.guild.id,
			});

			if (ResultsTwo.length === 0) {
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle('Line System | List Reaction')
					.setDescription(`> There is no lines channel in this server.`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed5] });
			}

			if (ResultsTwo.length > 0) {
				const embed6 = new container.Discord.MessageEmbed()
					.setTitle('Line System | List Reaction')
					.setDescription(
						`> List of lines in this server.\n\n${ResultsTwo.map(
							(cmd, i) => `${i + 1} : **${cmd.channelID}** - **<#${cmd.channelID}>**`,
						).join('\n')}`,
					)
					.setColor(client.embed.color.green)
					.setFooter({
						text: `Use /setup-line list again to to remove (#deleted-channel).`,
					});
				return await interaction.reply({ embeds: [embed6] });
			}
		}
	},
};
