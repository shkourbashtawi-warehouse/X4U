module.exports = {
	name: 'send-msg',
	description: 'Send message to spefic channel',
	usage: ['send-msg [text] <channel>'],
	category: 'Moderation',
	cooldown: 5,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'text',
			description: 'Write here what the message he want send to channel.',
			type: 3,
			required: true,
		},
		{
			name: 'channel',
			description: 'What channel do you want your message to be in?',
			type: 7,
			channel_types: [0],
		},
	],
	run: async (client, interaction, container) => {
		const Channel = interaction.options.getChannel('channel') || interaction.channel;
		const Text = interaction.options.getString('text');
		if (Text.length > 1990) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please input vaild url photo`)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed],
			});
		}
		interaction.guild.channels.cache.get(Channel.id).send({
			content: `${Text}`,
		});

		const embed = new container.Discord.MessageEmbed()
			.setDescription(`> Done send message to ${Channel.name}`)
			.setColor(client.embed.color.green);
		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};
