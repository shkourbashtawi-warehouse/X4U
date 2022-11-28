const AutoReplyScehma = require('../../../Database/Other/AutoReply');
module.exports = {
	name: 'setup-autoreply',
	description: 'Setup autoreply | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'add-reply',
			description: 'With this option you can add reply',
			type: 1,
			options: [
				{
					name: 'command',
					description: 'What command do you want to reply (this command use to get reply)?',
					type: 3,
					required: true,
				},
				{
					name: 'reply',
					description: 'What reply do you want to send (this reply send when use command)?',
					type: 3,
					required: true,
				},
				{
					name: 'toggle',
					description: 'Choose true(Enable) or false(Disable).',
					type: 5,
				},
			],
		},
		{
			type: 1,
			name: 'delete-reply',
			description: 'With this option you can delete reply',
			options: [
				{
					type: 3,
					name: 'command',
					description: 'What command do you want to delete reply (this command use to get reply)?',
					required: true,
				},
			],
		},
		{
			type: 1,
			name: 'list-reply',
			description: 'With this option you can list reply',
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'add-reply') {
			const NameCommand = interaction.options.getString('command');
			const ResponseCommand = interaction.options.getString('reply');
			const NameCommandLower = NameCommand.toLowerCase();

			if (NameCommand.length > 30) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Add Reply')
					.setDescription(`> Command name must be less than 30 characters`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			if (ResponseCommand.length > 2000) {
				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Add Reply')
					.setDescription(`> Reply muse be less than 2000 characters`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed1] });
			}

			const Results = await AutoReplyScehma.find({
				guildID: interaction.guild.id,
			});

			if (Results.length >= 10) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Error')
					.setDescription("> You Can't Add More Than 10 Replies.")
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const CheckCommandExist = await AutoReplyScehma.findOne({
				guildID: interaction.guild.id,
				CommandA: NameCommandLower,
			});

			if (CheckCommandExist) {
				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Add Reply')
					.setDescription(`> This command already exists`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed2] });
			} else {
				let toggle = interaction.options.getBoolean('toggle');
				const AutoReply = new AutoReplyScehma({
					guildID: interaction.guild.id,
					CommandA: NameCommandLower,
					ResponseB: ResponseCommand,
					toggleStatus: toggle,
				});
				AutoReply.save();
				const embed3 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Add Reply')
					.setDescription(`> Successfully added command **${NameCommand}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed3] });
			}
		}

		if (interaction.options.getSubcommand() === 'delete-reply') {
			const NameCommand = interaction.options.getString('command');
			const NameCommandLower = NameCommand.toLowerCase();

			const CheckCommandExist = await AutoReplyScehma.findOne({
				guildID: interaction.guild.id,
				CommandA: NameCommandLower,
			});

			if (!CheckCommandExist) {
				const embed4 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Delete Reply')
					.setDescription(`> This command does not exist`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed4] });
			}

			if (CheckCommandExist) {
				await AutoReplyScehma.findOneAndDelete({
					guildID: interaction.guild.id,
					CommandA: NameCommandLower,
				});
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | Delete Reply')
					.setDescription(`> Successfully deleted command **${NameCommand}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed5] });
			}
		}
		if (interaction.options.getSubcommand() === 'list-reply') {
			const AutoReply = await AutoReplyScehma.find({
				guildID: interaction.guild.id,
			});

			if (!!AutoReply === false) {
				const embed6 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | List Reply')
					.setDescription(`> There are no commands`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed6] });
			}

			if (AutoReply) {
				const embed7 = new container.Discord.MessageEmbed()
					.setTitle('Autoreply System | List Reply')
					.setDescription(AutoReply.map((cmd, i) => `${i + 1} : **${cmd.CommandA}** - **${cmd.ResponseB}**`).join('\n'))
					.setColor(client.embed.color.onix);
				return interaction.reply({ embeds: [embed7] });
			}
		}
	},
};
