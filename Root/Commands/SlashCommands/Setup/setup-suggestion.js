const SugestionSchema = require('../../../Database/Other/Sugestion');
module.exports = {
	name: 'setup-suggestion',
	description: 'Setup suggestion system | (See /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'channel',
			description: 'With this option you can add or remove suggestion channel',
			type: 1,
			options: [
				{
					name: 'channel',
					description: 'What channel do you want your suggestion to be in?',
					type: 7,
					channel_types: [0],
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'channel') {
			const channel = interaction.options.getChannel('channel');

			const settings = await SugestionSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new SugestionSchema({
					guildID: interaction.guild.id,
					channelID: channel.id,
				});
				await newSettings.save();

				const embed = new container.Discord.MessageEmbed()
					.setTitle('Suggestion System | Setup Channel')
					.setDescription(`> SuggestionChannel ${channel} added successfully`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed] });
			}

			if (settings) {
				await SugestionSchema.findOneAndDelete({
					guildID: interaction.guild.id,
				});

				const embed1 = new container.Discord.MessageEmbed()
					.setTitle('Suggestion System | Setup Channel')
					.setDescription(`> SuggestionChannel ${channel} removed successfully`)
					.setColor(client.embed.color.green);
				return interaction.reply({ embeds: [embed1] });
			}
		}
	},
};
