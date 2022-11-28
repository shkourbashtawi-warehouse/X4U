module.exports = {
	name: 'banner',
	type: 'MESSAGE',
	run: async (client, interaction, container) => {
		const message = interaction.options.getMessage('message');
		const user = await client.users.cache.get(message.author.id);
		await user.fetch();
		if (!user.banner) {
			if (user.accentColor) {
				const bannerlink = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton()
						.setURL(`https://www.thecolorapi.com/id?format=svg&named=false&hex=${message.author.accentColor}`)
						.setLabel('Download Custom Color')
						.setStyle('LINK')
						.setEmoji('👻'),
				);
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> ${message.author}, You have custom banner only so click to button to see it!`)
					.setColor(message.author.accentColor);
				return interaction.followUp({ embeds: [embed], components: [bannerlink] });
			} else if (message.author.accentColor === null) {
				let embed1 = new container.Discord.MessageEmbed()
					.setDescription(`> ${message.author}, This user don't have a banner or a hex color .. or this user is a bot.`)
					.setColor(client.embed.color.onix);
				return interaction.followUp({ embeds: [embed1] });
			}
		}
		if (user.banner) {
			let embed = new container.Discord.MessageEmbed()
				.setTitle(`${message.author.username}'s Banner`)
				.setColor(interaction.member.displayHexColor)
				.setDescription(
					`\`Need Other Format?:\`[PNG](${message.author.bannerURL({
						format: 'png',
						size: 1024,
					})}) | [JPG](${message.author.bannerURL({
						format: 'jpg',
						size: 1024,
					})}) | [GIF](${message.author.bannerURL({
						format: 'gif',
						size: 1024,
						dynamic: true,
					})})
          `,
				)
				.setImage(message.author.bannerURL({ size: 4096, dynamic: true }))
				.setFooter({
					text: client.embed.text.setFooter + message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();

			const BannerButton = new container.Discord.MessageActionRow().addComponents(
				new container.Discord.MessageButton()
					.setURL(`${message.author.bannerURL({ dynamic: true, size: 512 })}`)
					.setLabel('Download Banner')
					.setStyle('LINK')
					.setEmoji('👻'),
			);

			await interaction.followUp({
				embeds: [embed],
				components: [BannerButton],
			});
		}
	},
};
