module.exports = {
	name: 'banner-profile',
	description: 'Show banner user!',
	usage: ['banner-profile <user>'],
	category: 'Public',
	cooldown: 5,
	requiredAnyRole: ['799487104026542151'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'mention someone to get their banner',
			type: 6,
		},
	],
	run: async (client, interaction, container) => {
		let user = interaction.options.getUser('user') || interaction.user;

		user = await user.fetch();
		if (!user.banner) {
			if (user.accentColor) {
				const bannerlink = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton()
						.setURL(`https://www.thecolorapi.com/id?format=svg&named=false&hex=${user.accentColor}`)
						.setLabel('Download Custom Color')
						.setStyle('LINK')
						.setEmoji('👻'),
				);
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> ${user}, You have custom banner only so click to button to see it!`)
					.setColor(user.accentColor);
				return interaction.reply({ embeds: [embed], components: [bannerlink] });
			} else if (user.accentColor === null) {
				let embed1 = new container.Discord.MessageEmbed()
					.setDescription(`> ${user}, This user don't have a banner or a hex color .. or this user is a bot.`)
					.setColor(client.embed.color.onix);
				return interaction.reply({ embeds: [embed1] });
			}
		}
		if (user.banner) {
			const png = user.bannerURL({
				format: 'png',
				size: 1024,
			});
			const jpg = user.bannerURL({ format: 'jpg', size: 1024 });
			const gif = user.bannerURL({
				format: 'gif',
				size: 1024,
				dynamic: true,
			});
			let embed2 = new container.Discord.MessageEmbed()
				.setTitle(`${user.username}'s Banner`)
				.setColor(interaction.member.displayHexColor)
				.setDescription(
					`> Download Banner Image At:\n**[PNG](${png}) | [JPG](${jpg}) | [GIF](${gif})**` ||
						`**[PNG](${png}) | [JPG](${jpg})**`,
				)

				.setImage(user.bannerURL({ size: 4096, dynamic: true }))
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();

			const bannerlink = new container.Discord.MessageActionRow().addComponents(
				new container.Discord.MessageButton()
					.setURL(`${user.bannerURL({ dynamic: true, size: 512 })}`)
					.setLabel('Download Banner')
					.setStyle('LINK')
					.setEmoji('👻'),
			);

			await interaction.reply({
				embeds: [embed2],
				components: [bannerlink],
			});
		}
	},
};
