const Snipe = require('../../../Database/Other/Snipe');
module.exports = {
	name: 'snipe',
	description: 'Snipe Messages in the server.',
	category: 'Utility',
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'The channel to snipe messages from.',
			type: 7,
			channel_types: [0],
		},
	],
	run: async (client, interaction, container) => {
		const Channel = interaction.options.getChannel('channel') || interaction.channel;
		const snipe = await Snipe.findOne({ guildId: interaction.guild.id, channelID: Channel.id });
		const embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: `#${Channel.name} Snipe | ` + interaction.guild.name,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setColor(client.embed.color.onix)
			.setDescription(`. Couldn't find any deleted message in **${Channel.name}**`)
			.setFooter({
				text: `Deleted messages in ${Channel.name}`,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setTimestamp();
		if (!snipe) {
			return interaction.reply({ embeds: [embed] });
		}

		if (snipe.message.length < 1) {
			return interaction.reply({ embeds: [embed] });
		}

		const data = [];

		const embed3 = new container.Discord.MessageEmbed()
			.setAuthor({
				name: `#${Channel.name} Snipe` + interaction.guild.name,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setColor(client.embed.color.onix)
			.setFooter({
				text: `Deleted messages in ${Channel.name}`,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setTimestamp();

		for (let i = 0; snipe.message.length > i; i++) {
			data.push(
				`**${i + 1}-**\n**User:** ${(await interaction.client.users.fetch(snipe.tag[i])) || 'Unknown'}\n**Message:** ${
					snipe.message[i] || 'None'
				}\n**image:** [Click Me](${snipe.image[i] || 'none'})`,
			);

			embed3.addField(
				`Message ${i + 1}`,
				`**User:** ${(await interaction.client.users.fetch(snipe.tag[i])) || 'Unknown'}\n**Message:** ${
					snipe.message[i] || 'None'
				}\n**image:** [Click Me](${snipe.image[i] || 'none'})`,
				true,
			);
		}

		if (data.length < 1) {
			return interaction.reply({ embeds: [embed] });
		}

		interaction.reply({ embeds: [embed3] }).catch(async (err) => {
			await snipe.deleteOne().catch(() => {});
			let embed4 = new container.Discord.MessageEmbed()
				.setDescription(
					`> Database has been cleaned due to the large number of messages with more than 1200 characters. New deleted messages will be recorded.`,
				)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed4],
				ephemeral: true,
			});
		});
	},
};
