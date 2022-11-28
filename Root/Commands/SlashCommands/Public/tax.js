const probot = require('probot-tax');
module.exports = {
	name: 'tax',
	description: 'tax for coinix/probot',
	usage: ['tax [amount]'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'number',
			description: 'Enter the number to calculate the tax amount.',
			type: 3,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		const design = interaction.options.getString('number');

		try {
			const regex = /^[0-9]+(\.[0-9]+)?(k|K|m|M|b|B)?$/;
			if (!regex.test(design)) {
				const embed1 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> Please enter a Invalid number.`);
				return interaction.reply({ embeds: [embed1] });
			}

			const design1 = design
				.replace('k', '000')
				.replace('K', '000')
				.replace('m', '000000')
				.replace('M', '000000')
				.replace('b', '000000000')
				.replace('B', '000000000');

			const designAfter = Math.round(design1);

			if (designAfter === 1 || designAfter === 0) {
				const embed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> You can't calculate a tax for a number from 0 to 1.`);
				return interaction.reply({ embeds: [embed] });
			}

			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.onix)
				.addFields(
					{
						name: 'Amount to be paid :',
						value: `**${designAfter}**`,
					},
					{
						name: 'The amount includes tax :',
						value: `**${probot.taxs(designAfter)}**`,
						inline: false,
					},
				)
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setTimestamp();
			return interaction.reply({ embeds: [embed] });
		} catch (error) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(`> Please enter a number like : **20k** or **20000** or **1m** or **1000000**`);
			return interaction.reply({ embeds: [embed] });
		}
	},
};
