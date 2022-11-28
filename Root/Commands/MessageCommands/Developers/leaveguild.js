module.exports = {
	name: 'leaveguild',
	category: 'Developers',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		const rgx = /^(?:<@!?)?(\d+)>?$/;

		const guildId = args[0];

		if (!rgx.test(guildId)) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription('Invalid Guild Id');
			return message.reply({ embeds: [embed] });
		}

		const guild = message.client.guilds.cache.get(guildId);
		if (!guild) {
			const embed1 = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription('Invalid Guild Id');
			return message.reply({ embeds: [embed1] });
		}

		await guild.leave();
		const embed3 = new container.Discord.MessageEmbed()
			.setTitle('Leave Guild')
			.setDescription(`I have successfully left **${guild.name}**.`)
			.setColor(client.embed.color.green);
		return message.reply({ embeds: [embed3] });
	},
};
