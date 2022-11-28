module.exports = {
	name: 'support-link',
	description: 'Sends you X4U Bot Support server.',
	usage: ['support-link'],
	category: 'Utility',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		const SupportLink = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setLabel('Support Server')
				.setStyle('LINK')
				.setURL('https://discord.gg/7V9cgntvak')
				.setEmoji('<:link:938144203211427880>'),
		]);
		let embed = new container.Discord.MessageEmbed()
			.setAuthor({ name: 'This Vesrion clone from Onix', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(
				`> Support Server for help:\n> [Support Server](https://discord.gg/7V9cgntvak) or click button below`,
			)
			.setImage('https://i.imgur.com/MLpiOlD.png')
			.setTimestamp()
			.setColor(client.embed.color.onix)
			.setFooter({
				text: client.user.username + ' - Support Server',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});
		interaction.reply({ embeds: [embed], components: [SupportLink] });
	},
};
