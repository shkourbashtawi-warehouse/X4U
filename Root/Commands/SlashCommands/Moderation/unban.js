module.exports = {
	name: 'unban',
	description: 'Unban user from this server',
	usage: ['unban [id/all]'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS', 'SEND_MEMESSAGES'],
	options: [
		{
			name: 'user',
			description: 'User to unban.',
			type: 3,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		const input = interaction.options.getString('user');
		if (input === 'all') {
			const fetchBans = await interaction.guild.bans.fetch();
			if (!fetchBans) {
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> There are no banned users`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed],
				});
			}
			const usersBanned = fetchBans.map((r) => r.user.id);
			usersBanned.forEach((user) => {
				interaction.guild.bans.remove(user, `By: ${interaction.user.tag} unban all`);
			});
			let embed1 = new container.Discord.MessageEmbed()
				.setDescription(
					`> **${fetchBans.size}** members being unbanned (if you write in input **all** he will unban for all users)`,
				)
				.setColor(client.embed.color.green);
			return interaction.reply({
				embeds: [embed1],
			});
		}
		try {
			const user = await interaction.guild.bans.remove(input, `By: ${interaction.user.tag}`);
			let embed2 = new container.Discord.MessageEmbed()
				.setDescription(`> **${user.username} has been unbanned**`)
				.setColor(client.embed.color.green);
			interaction.reply({
				embeds: [embed2],
			});
		} catch (error) {
			let embed3 = new container.Discord.MessageEmbed()
				.setDescription(`> this id is not banned`)
				.setColor(client.embed.color.red);
			interaction.reply({
				embeds: [embed3],
			});
		}
	},
};
