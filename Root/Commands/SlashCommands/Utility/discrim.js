module.exports = {
	name: 'discrim',
	description: 'Shows a list of members with the same discriminator.',
	usage: ['discrim <discriminator>'],
	category: 'Utility',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'discriminator',
			description: 'The discriminator to search for.',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		let userId = interaction.options.getString('discriminator') || interaction.user.discriminator;
		if (userId) {
			if (!/^\d{4}$/.test(userId)) {
				let embed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> Invalid discriminator, Please provide me with a valid user discriminator.`);
				return interaction.reply({ embeds: [embed] });
			}
		}
		let members = interaction.guild.members.cache
			.filter((member) => member.user.discriminator === userId)
			.map((member) => member.user.tag);
		if (members.length === 0) {
			let embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(`> No members found with the discriminator **${userId}**`);
			return interaction.reply({ embeds: [embed] });
		}
		let total = members.length || 0;
		members = members.length > 0 ? members.slice(0, 10).join('\n') : `None`;
		let embed = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.onix)
			.setTitle(`${total} members with the discriminator **${userId}**`)
			.setDescription(`Found **${total}** users with discriminator **${userId}**`)
			.addField('Users', total > 10 ? `${members} and ${total - 10} more.` : members);

		interaction.reply({ embeds: [embed] });
	},
};
