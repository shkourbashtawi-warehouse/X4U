module.exports = {
	name: 'send-image',
	description: 'Send image to channel',
	usage: ['send-image [url] <channel>'],
	category: 'Moderation',
	cooldown: 5,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES', 'ATTACH_FILES'],
	options: [
		{
			name: 'url',
			description: 'What the link do you want for send photo?',
			type: 3,
			required: true,
		},
		{
			name: 'channel',
			description: 'What channel do you want your send photo to be in?',
			type: 7,
			channel_types: [0],
		},
	],
	run: async (client, interaction, container) => {
		const URL = interaction.options.getString('url');
		if (!URL.includes('https://')) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please input vaild url photo`)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed],
			});
		}
		const channel = interaction.options.getChannel('channel') || interaction.channel;
		const embed2 = new container.Discord.MessageEmbed()
			.setDescription(`> Wait some 5 Seconds to __upload__ and __send Image__`)
			.setColor(client.embed.color.green);
		interaction.reply({
			embeds: [embed2],
			ephemeral: true,
			fetchReply: true,
		});
		let attachment = new container.Discord.MessageAttachment(URL);
		await interaction.guild.channels.cache
			.get(channel.id)
			.send({ files: [attachment] })
			.then(() => {
				const embed3 = new container.Discord.MessageEmbed()
					.setDescription(`> Done send Image to ${channel}`)
					.setColor(client.embed.color.green);
				interaction.editReply({ embeds: [embed3] });
			});
	},
};
