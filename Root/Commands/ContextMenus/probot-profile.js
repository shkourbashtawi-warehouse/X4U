module.exports = {
	name: 'probot-profile',
	type: 'MESSAGE',
	run: async (client, interaction, container) => {
		const message = interaction.options.getMessage('message');
		const user = await client.users.cache.get(message.author.id);
		if (user) {
			let banner1 = `https://api.probot.io/profile/${user.id}`;
			let embed = new container.Discord.MessageEmbed()
				.setTitle(`${message.author.username}'s profile on Probot`)
				.setColor(interaction.member.displayHexColor)
				.setImage(banner1)
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();

			await interaction.followUp({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
