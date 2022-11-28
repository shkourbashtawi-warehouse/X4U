module.exports = {
	name: 'hide',
	description: 'Hide channel from specific role',
	usage: ['hide <channel> <role>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS', 'SEND_MESSAGES'],
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

		//Hide Command
		await channel.permissionOverwrites.edit(role, {
			VIEW_CHANNEL: false,
		});

		const embed = new container.Discord.MessageEmbed()
			.setDescription(`> Hidden **${channel}** for **${role}**`)
			.setColor(client.embed.color.green);

		return interaction.reply({ embeds: [embed] });
	},
};
