module.exports = {
	name: 'lock',
	description: 'Disables user from sending messages in specific channel.',
	usage: ['lock <channel> <role>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_CHANNELS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'the channel you want to management.',
			channel_types: [0],
			type: 7,
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

		//LOCK Command
		await channel.permissionOverwrites.edit(role, {
			SEND_MESSAGES: false,
		});

		const embed = new container.Discord.MessageEmbed()
			.setDescription(`> Locked **${channel}** for **${role}**`)
			.setColor(client.embed.color.green);
		return interaction.reply({ embeds: [embed] });
	},
};
