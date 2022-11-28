const { Color, isColor } = require('coloras');
module.exports = {
	name: 'color',
	description: 'Shows color info or made random color.',
	usage: ['color <color>'],
	category: 'Utility',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'color',
			description: 'The color to show info about.',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		const ColorString = interaction.options.getString('color');
		if (!ColorString) {
			const RandomColor = new Color();
			const embed = new container.Discord.MessageEmbed()
				.setTitle(RandomColor ? `Random Color` : `Color: ${RandomColor.toHex()}`)
				.addField('HEX', `> \`${RandomColor.toHex()}\``, true)
				.addField('RGB', `> \`${RandomColor.toRgb()}\``, true)
				.addField('HSL', `> \`${RandomColor.toHsl()}\``, true)
				.addField('HSV', `> \`${RandomColor.toHsv()}\``, true)
				.addField('CMYK', `> \`${RandomColor.toCmyk()}\``, true)
				.setImage(RandomColor.imageUrl)
				.setColor(RandomColor.toHex())
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			return interaction.reply({ embeds: [embed] });
		}

		if (ColorString) {
			if (!isColor(ColorString).color) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`> Please provide a valid color`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}
			const ColorStringDone = new Color(ColorString);
			const embed1 = new container.Discord.MessageEmbed()
				.setTitle(`Color : ${ColorStringDone.toHex()}`)
				.addField('HEX', `> \`${ColorStringDone.toHex()}\``, true)
				.addField('RGB', `> \`${ColorStringDone.toRgb()}\``, true)
				.addField('HSL', `> \`${ColorStringDone.toHsl()}\``, true)
				.addField('HSV', `> \`${ColorStringDone.toHsv()}\``, true)
				.addField('CMYK', `> \`${ColorStringDone.toCmyk()}\``, true)
				.setImage(ColorStringDone.imageUrl)
				.setColor(ColorStringDone.toHex())
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			return interaction.reply({ embeds: [embed1] });
		}
	},
};
