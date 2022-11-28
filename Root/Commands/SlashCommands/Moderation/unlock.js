module.exports = {
	name: 'unlock',
	description: 'Enable user to sending messages in specific channel.',
	usage: ['unlock <channel> <role>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_CHANNELS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'the channel you want to management.',
			type: 7,
			channel_types: [0],
		},
		{
			name: 'role',
			description: 'the role which cant type in the channel.',
			type: 8,
		},
	],
	run: async (client, interaction, container) => {
		const channel = interaction.options.getChannel('channel') || interaction.channel;

		let role = interaction.options.getRole('role') || channel.guild.roles.everyone;

		//UnLOCK Command
		await channel.permissionOverwrites.edit(role, {
			SEND_MESSAGES: null,
		});

		const embed = new container.Discord.MessageEmbed()
			.setDescription(`> Unlocked **${channel}** for **${role}**`)
			.setColor(client.embed.color.green);
		return interaction.reply({ embeds: [embed] });
	},
};
