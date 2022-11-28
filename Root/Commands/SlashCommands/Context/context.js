module.exports = {
	name: 'context',
	description: 'what it is?',
	category: 'Context',
	run: async (client, interaction, container) => {
		const ping = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.onix)
			.setTitle('What is Context Menu?')
			.setDescription('He is way to use application and commands but fast way')
			.setImage('https://i.imgur.com/KWk64Zd.png')
			.setFooter({
				text: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})

			.setTimestamp();
		interaction.reply({ embeds: [ping] });
	},
};
