module.exports = {
	name: 'guildDelete',
	run: async (guild, client, container) => {
		const leaveEmbed = new container.Discord.MessageEmbed()
			.setTitle('**Leave Server**')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`X4U Bot was left from a Server!`)
			.addField(`Server Name`, `\`${guild.name}\``, true)
			.addField(`Server ID`, `\`${guild.id}\``, true)
			.addField(`Server Owner`, `\`${guild.ownerId}\``, true)
			.addField(`Server Members`, `\`${guild.memberCount}\``, true)
			.addField(`Server Created At`, `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, true)
			.setColor(client.embed.color.onix)
			.setFooter({
				text: client.guilds.cache.size + ' guilds',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp();
		client.WebhookGuildLeft.send({
			username: 'Guild Lefted',
			embeds: [leaveEmbed],
		});
	},
};
