module.exports = {
	name: 'setup-help',
	description: 'Setup help explain all setup commands.',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		const embed = new container.Discord.MessageEmbed()
			.setTitle('Setup Help')
			.setDescription('> **__This command is used to change something in the DataBase__**')
			.addField(
				'**Welcome System**',
				`This command is used to send a welcome message when a new member join the server.\`\`\`/setup-welcome channel:\nIn order to update the channel that is used to send the welcome message.\n\n/setup-welcome message:\nunder dev.\`\`\``,
			)
			.addField(
				'**Suggestion System**',
				`This command is used to a suggestion channel.\`\`\`/setup-suggestion channel:\nIn order to update the channel that is used to send the suggestion message.\`\`\``,
			)
			.addField(
				'**AutoRely System**',
				`This command is used to setup auto reply like as when someone write hello bot reply welcome bro.\`\`\`/setup-autoreply add-reply:\n In order you can add relpy.\n\n/setup-autoreply delete-reply:\nIn order you can remove reply.\n\n/setup-autoreply list-reply:\nIn order you can see all reply.\`\`\``,
			)
			.addField(
				'**Line System**',
				`This command is used to send a picture when writing in a specific channel.\`\`\`/setup-autoline url:\nIn order to update the image that is sent.\n\n/setup-autoline channel:\nIn order to update the channel that is used to send the image.\n\n/setup-autoline list:\nIn order you can see all channels setup with line.\`\`\``,
			)
			.addField(
				'**AutoReaction System**',
				`This command is used to setup  reaction like when someone send message in specific channel bot will reaction message.\`\`\`/setup-autoreaction add-reaction:\nIn order you can add reacion in specific channel.\n\n/setup-autoreaction delete-reaction:\nIn order you can remove reacion in specific channel.\n\n/setup-autoreaction toggle:\nIn order you can enable or disable autor reaction.\n\n/setup-autoreaction list-reaction:\nIn order you can see all reactions.\`\`\``,
			)
			.addField(
				'**AutoRole System**',
				`This command is used to setup auto role like when someone join the server bot will give him a role.\`\`\`/setup-autorole role:\nIn order you can select role for when someone join server bot he will give him role.\n\n/setup-autorole toggle:\nIn order you can enable or disable auto role.\`\`\``,
			)
			.addField(
				'**Azkar System**',
				`This command is used to setup Azkar for every 30m send azkar.\`\`\`/setup-azkar channel:\nIn order you can select channel for send Azkar.\n\n/setup-azkar toggle:\nIn order you can enable or disable Azkar.\`\`\``,
			)
			.addField(
				'**Backup System**',
				`This command is used to backup all data.\`\`\`/setup-backup create:\nIn order you can backup all data.\n\n/setup-backup load:\nIn order you can restore all data.\n\n/setup-backup delete:\nIn order you can delete all data.\n\n/setup-backup info:\nIn order you can informations for backup.\`\`\``,
			)
			.addField(
				'**Color System**',
				`This command is used to setup color for made roles with random colors and used for give users roles with nice colors.\`\`\`/setup-color color:\nIn this matter to determine the number of roels to be made with random colors.\`\`\``,
			)
			.addField(
				'**Fastrole System**',
				`This command is used to setup fastrole to give someone a direct role such as when setting iam command for @vip role and when /fastrole shkour-x4u bot is used the bot gives them the role of vip without specifying the role again.\`\`\`/setup-fastrole role:\nIn order you can select role for use in fastrole command.\n\n/setup-fastrole toggle:\nIn order you can enable or disable fast role.\`\`\``,
			)
			.setColor(client.embed.color.onix)
			.setFooter({
				text: 'If you need any help, join the support server',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			});
		return interaction.reply({ embeds: [embed] });
	},
};
