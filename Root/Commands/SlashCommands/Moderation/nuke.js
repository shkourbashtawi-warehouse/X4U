module.exports = {
	name: 'nuke',
	description: 'Destroy a channel and create a new one with same everything.',
	usage: ['nuke <channel>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['850492222566039582'],
	clientPermissions: ['MANAGE_CHANNELS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'the channel you want to management.',
			channel_types: [0],
			type: 7,
		},
	],
	run: async (client, interaction, container) => {
		const Channel = interaction.options.getChannel('channel') || interaction.channel;

		//Nuke Command
		if (interaction.channel.id === Channel.id) {
			let embed = new container.Discord.MessageEmbed()
				.setDescription("> Please wait I'm nuking the channel! :--)")
				.setColor(client.embed.color.orange);
			interaction.reply({ embeds: [embed] });

			let NewChannel = await interaction.channel.clone();
			await Channel.delete();
			const embed1 = new container.Discord.MessageEmbed()
				.setTitle('Channel Nuked!')
				.setDescription(`> I cloned the channel with the same name and the same permissions.`)
				.setImage('https://c.tenor.com/eTXmcz6tDIwAAAAC/nuclear-explosion.gif')
				.setColor(client.embed.color.onix)
				.setFooter({
					text: 'Nuked By: ' + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});
			return NewChannel.send({ embeds: [embed1] });
		}

		if (interaction.channel.id !== Channel.id) {
			let embed2 = new container.Discord.MessageEmbed()
				.setDescription("> Please wait I'm nuking the channel! :--)")
				.setColor(client.embed.color.orange);
			interaction.reply({ embeds: [embed2], ephemeral: true, fetchReply: true });

			let NewChannel = await Channel.clone();
			await Channel.delete();
			const embed3 = new container.Discord.MessageEmbed()
				.setTitle('Channel Nuked!')
				.setDescription(`> I cloned the channel with the same name and the same permissions.`)
				.setImage('https://c.tenor.com/eTXmcz6tDIwAAAAC/nuclear-explosion.gif')
				.setColor(client.embed.color.onix)
				.setFooter({
					text: 'Nuked By: ' + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});
			NewChannel.send({ embeds: [embed3] });

			const embed4 = new container.Discord.MessageEmbed()
				.setDescription('> Done nuked the channel! :--)')
				.setColor(client.embed.color.green);
			return interaction.editReply({ embeds: [embed4], ephemeral: true });
		}
	},
};
