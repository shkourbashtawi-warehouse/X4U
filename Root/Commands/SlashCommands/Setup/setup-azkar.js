const AzkarSchema = require('../../../Database/Other/Azkar');
module.exports = {
	name: 'setup-azkar',
	description: 'Setup azkar system | (See /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'With this option you can add or remove Azkar channel',
			type: 1,
			options: [
				{
					name: 'channel',
					description: 'What channel do you want your Azkar to be in?',
					type: 7,
					channel_types: [0],
					required: true,
				},
			],
		},
		{
			name: 'toggle',
			description: 'With this option you can turn on or off Azkar',
			type: 1,
			options: [
				{
					name: 'choice',
					description: 'Choose true(Enable) or false(Disable).',
					type: 5,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'channel') {
			const channel = interaction.options.getChannel('channel');

			const settings = await AzkarSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new AzkarSchema({
					guildID: interaction.guild.id,
					channelID: channel.id,
					toggleStatus: true,
				});

				await newSettings.save();
				const embed = new container.Discord.MessageEmbed()
					.setTitle('Azkar System | Channel Setup')
					.setDescription(`> **${channel}** Set As Azkar Channel, Use Command Again To Update Azkar Channel`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed],
				});
			}
			if (settings) {
				settings.channelID = channel.id;
				await settings.save();

				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Azkar System | Channel Setup')
					.setDescription(`> AzkarChannel Update to **${channel}**, Use command again to update Azkar Channel`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed1],
				});
			}
		}

		if (interaction.options.getSubcommand() === 'toggle') {
			const boolean = interaction.options.getBoolean('choice');
			const settings = await AzkarSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('Azkar System | Toggle Setup')
					.setDescription(`Please set AzkarChannel first`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed2],
				});
			}

			if (settings) {
				settings.toggleStatus = boolean;
				await settings.save();
				const embed3 = new container.Discord.MessageEmbed()
					.setTitle('Azkar System | Toggle Setup')
					.setDescription(`AzkarToggle update to ${boolean}`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed3],
				});
			}
		}
	},
};
