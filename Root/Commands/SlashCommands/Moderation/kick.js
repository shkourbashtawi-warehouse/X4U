module.exports = {
	name: 'kick',
	description: 'kick a user',
	usage: ['kick [user] <reason>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['KICK_MEMBERS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'The user you want to kick.',
			type: 6,
			required: true,
		},
		{
			name: 'reason',
			description: 'Optional kick reason.',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		const member = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') || '';

		if (member.id === interaction.user.id) {
			let embed = new container.Discord.MessageEmbed()
				.setDescription("> You can't kick yourself!")
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed] });
		}
		if (member.id === client.user.id) {
			let embed1 = new container.Discord.MessageEmbed()
				.setDescription("> You can't kick me!")
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed1] });
		}
		if (!member.kickable) {
			let embed2 = new container.Discord.MessageEmbed()
				.setDescription("> i can't kick this user!")
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed2] });
		}

		const role = member.roles.highest.position;
		const authorRole = interaction.member.roles.highest.position;

		if (role >= authorRole) {
			let embed3 = new container.Discord.MessageEmbed()
				.setDescription("> You can't kick a member who has the same role as you or a higher role than you.")
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed3] });
		}

		try {
			await member.kick(reason);
			let embed4 = new container.Discord.MessageEmbed()
				.setDescription(`> ${member} has been kicked`)
				.setColor(client.embed.color.green);
			return interaction.reply({
				embeds: [embed4],
			});
		} catch (error) {
			return;
		}
	},
};
