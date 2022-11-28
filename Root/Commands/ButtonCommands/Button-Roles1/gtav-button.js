module.exports = {
	name: 'gtav-button',
	run: async (client, interaction, container) => {
		const User = interaction.user;
		const Fetched = await interaction.guild.members.fetch(User.id, {
			force: true,
		});
		const Member = interaction.guild.members.cache.get(Fetched.id);
		const Role = await interaction.guild.roles.cache.get('799487116857835520');

		if (!Member.roles.cache.has(Role.id)) {
			Member.roles.add(Role);
			const embed = new container.Discord.MessageEmbed()
				.setAuthor({
					name: 'X4U Gamers - Reaction Role',
					iconURL: interaction.guild.iconURL({ dynamic: true }),
					url: interaction.guild.iconURL({ dynamic: true }),
				})
				.setDescription(`> Successfully added the role **${Role.name}** to you!\nClick button again to remove role.`)
				.setColor(client.embed.color.noemebd);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (Member.roles.cache.has(Role.id)) {
			Member.roles.remove(Role);
			const embed1 = new container.Discord.MessageEmbed()
				.setAuthor({
					name: 'X4U Gamers - Reaction Role',
					iconURL: interaction.guild.iconURL({ dynamic: true }),
					url: interaction.guild.iconURL({ dynamic: true }),
				})
				.setDescription(`> Successfully removed the role **${Role.name}** from you!\nClick button again to get role.`)
				.setColor(client.embed.color.noemebd);
			return interaction.reply({ embeds: [embed1], ephemeral: true });
		}
	},
};
