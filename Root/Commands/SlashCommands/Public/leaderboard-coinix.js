module.exports = {
	name: 'leaderboard-coinix',
	description: `Displays the top 10 users with the most coins.`,
	usage: ['leaderboard-coinix'],
	category: 'Public',
	cooldown: 60,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		const leaderboard = require('../../../Database/Economy/UserCredit');
		const top10 = await leaderboard.find({}).sort({ wallet: -1 }).limit(10);
		const embed = new container.Discord.MessageEmbed()

			.setAuthor({
				name: 'Coinix Leaderboard | Top 10 Users with the most coins',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp()
			.setColor(client.embed.color.onix)
			.setDescription(
				top10
					.map(
						(user, index) =>
							`${index + 1}. ${
								client.users.cache.get(user.userID) ? client.users.cache.get(user.userID).username : 'User not found'
							} ➜ ${user.wallet} coins`,
					)
					.join('\n'),
			)
			.setFooter({
				text: client.embed.text.setFooter + interaction.user.username,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});
		interaction.reply({ embeds: [embed] });
	},
};
