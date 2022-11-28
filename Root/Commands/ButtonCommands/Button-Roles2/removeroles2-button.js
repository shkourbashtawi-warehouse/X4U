module.exports = {
	name: 'removeroles2-button',
	run: async (client, interaction, container) => {
		const User = interaction.user;
		const Fetched = await interaction.guild.members.fetch(User.id, {
			force: true,
		});
		const Member = interaction.guild.members.cache.get(Fetched.id);

		const Role1 = await interaction.guild.roles.cache.get('799731807305334784');
		const Role2 = await interaction.guild.roles.cache.get('850543323616772106');
		const Role3 = await interaction.guild.roles.cache.get('850543175705165824');
		const Role4 = await interaction.guild.roles.cache.get('854383446793257021');
		const Role5 = await interaction.guild.roles.cache.get('953299216179003502');
		const Role6 = await interaction.guild.roles.cache.get('953298862569840661');
		const Role7 = await interaction.guild.roles.cache.get('973299575865634816');

		const embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'X4U Gamers - Reaction Role',
				iconURL: interaction.guild.iconURL({ dynamic: true }),
				url: interaction.guild.iconURL({ dynamic: true }),
			})
			.setDescription(`> Successfully removed all games roles.`)
			.setColor(client.embed.color.noemebd);
		interaction.reply({ embeds: [embed], ephemeral: true });

		if (Member.roles.cache.has(Role1.id)) {
			Member.roles.remove(Role1);
		}

		if (Member.roles.cache.has(Role2.id)) {
			Member.roles.remove(Role2);
		}

		if (Member.roles.cache.has(Role3.id)) {
			Member.roles.remove(Role3);
		}

		if (Member.roles.cache.has(Role4.id)) {
			Member.roles.remove(Role4);
		}

		if (Member.roles.cache.has(Role5.id)) {
			Member.roles.remove(Role5);
		}

		if (Member.roles.cache.has(Role6.id)) {
			Member.roles.remove(Role6);
		}

		if (Member.roles.cache.has(Role7.id)) {
			Member.roles.remove(Role7);
		}

		return;
	},
};
