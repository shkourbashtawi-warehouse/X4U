const GuildMemberAddSchema = require('../../../Database/EventsSchema/guildMemberAdd');
const TextWelcomeSchema = require('../../../Database/Settings/Welcome/TextWelcome');
module.exports = {
	name: 'setup-welcome',
	description: 'Setup welcome system | (See /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'With this option you can add or remove welcome channel',
			type: 1,
			options: [
				{
					name: 'channel',
					description: 'What channel do you want your welcome to be in?',
					type: 7,
					channel_types: [0],
					required: true,
				},
			],
		},
		{
			name: 'message',
			description: 'With this option you can change the welcome message',
			type: 1,
			options: [
				{
					name: 'message',
					description: 'What message do you want to send in embed welcomer?',
					type: 3,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'channel') {
			const channel = interaction.options.getChannel('channel');

			const settings = await GuildMemberAddSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new GuildMemberAddSchema({
					guildID: interaction.guild.id,
					channelID: channel.id,
				});
				await newSettings.save();

				const embed = new container.Discord.MessageEmbed()
					.setTitle('Welcome System | Setup Channel')
					.setDescription(
						`> WelcomeChannel ${channel} added successfully, Use command again to remove welcome channel.`,
					)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed] });
			}

			if (settings) {
				await GuildMemberAddSchema.findOneAndDelete({
					guildID: interaction.guild.id,
				});

				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Welcome System | Setup Channel')
					.setDescription(`> WelcomeChannel ${channel} removed successfully, Use command again to add welcome channel `)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed1] });
			}
		}
		if (interaction.options.getSubcommand() === 'message') {
			const message = interaction.options.getString('message');
			const embed2 = new container.Discord.MessageEmbed()
				.setTitle('Welcome System | Setup Message')
				.setDescription(`> Soon we will add this feature `)
				.setColor(client.embed.color.orange);
			return interaction.reply({ embeds: [embed2] });

			const settings = await TextWelcomeSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new TextWelcomeSchema({
					guildID: interaction.guild.id,
					Text: message,
				});
				await newSettings.save();
				return interaction.reply({
					content: `**${message}** Set As Welcome Message, Use Command Again To Remove Welcome Message __Default Welcome__ (Welcome Message)`,
				});
			}

			if (settings) {
				await TextWelcomeSchema.findOneAndDelete({
					guildID: interaction.guild.id,
				});
				return interaction.reply({
					content: `Disable Welcome Message (Welcome Message)`,
				});
			}
		}
	},
};
