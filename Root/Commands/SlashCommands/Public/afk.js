const AFKSchema = require('../../../Database/Other/AFK.js');
module.exports = {
	name: 'afk',
	description: 'Set yourself as AFK',
	usage: ['afk <reason>'],
	category: 'Public',
	cooldown: 30,
	requiredAnyRole: ['799487104026542151'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'reason',
			description: 'The reason for being AFK',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		let User = interaction.user;
		let Reason = interaction.options.getString('reason') || 'No Provided Reason';
		let UserFindSchema = await AFKSchema.findOne({
			userId: User.id,
			guildId: interaction.guild.id,
		});

		if (UserFindSchema) {
			await AFKSchema.deleteOne({
				userId: User.id,
				guildId: interaction.guild.id,
			});

			let embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.green)
				.setDescription(`> ${User} is no longer AFK`);
			return interaction.reply({ embeds: [embed] });
		}

		if (!UserFindSchema) {
			if (Reason.length > 150) {
				let embed1 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> ${User}'s AFK reason is too long (150 characters max)`);
				return interaction.reply({ embeds: [embed1] });
			}

			const newAFKUser = new AFKSchema({
				userId: User.id,
				guildId: interaction.guild.id,
				reason: Reason,
				timestamp: Date.now(),
			});
			await newAFKUser.save();
			let embed2 = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.green)
				.setDescription(`> ${User} is now AFK for ${Reason}`);
			return interaction.reply({ embeds: [embed2] });
		}
	},
};
