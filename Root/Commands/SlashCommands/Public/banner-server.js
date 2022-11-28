module.exports = {
	name: 'banner-server',
	description: 'Show banner server.',
	usage: ['banner-server'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		if (!interaction.guild.banner) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(`This server has no banner.`);
			interaction.reply({ embeds: [embed] });
		}
		const embed1 = new container.Discord.MessageEmbed()
			.setTitle(`${interaction.guild.name}`)
			.setColor(interaction.member.displayHexColor)
			.setImage(`https://cdn.discordapp.com/banners/${interaction.guild.id}/${interaction.guild.banner}.webp?size=600`);
		interaction.reply({ embeds: [embed1] });
	},
};
