module.exports = {
	name: 'help',
	description: `See My Commands`,
	category: 'Public',
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	returnNoErrors: true,
	run: async (client, message, args, container) => {
		let embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'X4U Bot',
				iconURL: message.guild.iconURL({ dynamic: true }),
			})
			.setDescription(`This bot is used slash commands so use \`/help\` to see all commands.`)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setFooter({
				text: `X4U Bot | ${message.guild.name}`,
				iconURL: message.guild.iconURL({ dynamic: true }),
			})
			.setTimestamp()
			.setColor(client.embed.color.onix);
		message.reply({ embeds: [embed] });
	},
};
