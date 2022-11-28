const wait = require('util').promisify(setTimeout);
const randomColor = require('randomcolor');
module.exports = {
	name: 'setup-colors',
	description: 'Setup colors system | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 200,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'colors',
			description: 'Setup list of colors',
			type: 1,
			options: [
				{
					name: 'number',
					description: 'How many colors you want to create.',
					type: 4,
					required: true,
					maxValue: 50,
					minValue: 1,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'colors') {
			const number = interaction.options.getInteger('number');

			let Time = number * 3000;
			const embed1 = new container.Discord.MessageEmbed()
				.setTitle('Colors System | Add Colors')
				.setDescription(
					`> **${number} Colors** is being created ,every color will be created in **3 seconds**.\n> Please wait **${
						Time / 1000
					} seconds**`,
				)
				.setColor(client.embed.color.green);
			interaction.reply({ embeds: [embed1] });

			for (let i = 0; i < number; i++) {
				await interaction.guild.roles.create({
					name: `${i + 1}`,
					color: randomColor(),
					reason: 'Colors System | Add Colors',
				});
				await wait(2000);
			}
		}
	},
};
