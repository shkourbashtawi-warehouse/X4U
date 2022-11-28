module.exports = {
	name: 'changename',
	category: 'Developers',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		try {
			if (args.join(' ').length > 32) {
				return message.reply({
					embeds: [
						new container.Discord.MessageEmbed()
							.setFooter({
								text: `${message.guild.name} - Support `,
								iconURL: message.guild.iconURL({ dynamic: true }),
							})
							.setTitle(`:x: Bot Name too long, can't have more then 32 Letters!`),
					],
				});
			}
			client.user
				.setUsername(args.join(' '))
				.then((user) => {
					return message.reply({
						embeds: [new container.Discord.MessageEmbed().setTitle(`Changed my Name to: \`${user.username}\``)],
					});
				})
				.catch((e) => {
					return message.reply({
						embeds: [
							new container.Discord.MessageEmbed()
								.setTitle(`:x: Something went Wrong`)
								.setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``),
						],
					});
				});
		} catch (e) {
			console.log(String(e.stack).bgRed);
			return message.reply({
				embeds: [
					new container.Discord.MessageEmbed()
						.setTitle(`❌ ERROR | An error occurred`)
						.setDescription(`\`\`\`${e}\`\`\``),
				],
			});
		}
	},
};
