module.exports = {
	name: 'fetchinvite',
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

		var textChats = guild.channels.cache.find(
			(ch) => ch.type === 'GUILD_TEXT' && ch.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'),
		);

		if (!textChats) {
			const embed2 = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription('No channel found or I dont have permission to create an invite');
			return message.reply({ embeds: [embed2] });
		}

		await textChats
			.createInvite({
				maxAge: 0,
				maxUses: 0,
			})
			.then((inv) => {
				const embed3 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.green)
					.setDescription(`Done create invite for **${guild.name}**`);
				return message.reply({ content: `**${guild.name}** | ${inv.url}`, embeds: [embed3] });
			})
			.catch((err) => {
				const embed4 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`Don't have permission to create invite`);
				return message.reply({ embeds: [embed4] });
			});
	},
};
