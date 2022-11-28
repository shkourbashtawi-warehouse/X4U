module.exports = {
	name: 'avatar',
	description: 'Show avatar user!',
	usage: ['avatar <user>'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'mention someone to get their avatar',
			type: 6,
		},
	],
	run: async (client, interaction, container) => {
		let member = interaction.options.getUser('user') || interaction.user;

		const png = member.displayAvatarURL({ dynamic: false, format: 'png' });
		const jpg = member.displayAvatarURL({ dynamic: false, format: 'jpg' });
		const webp = member.displayAvatarURL({ dynamic: false, format: 'webp' });
		const gif = member.displayAvatarURL({ dynamic: true });
		const avatarMenu = new container.Discord.MessageActionRow().addComponents(
			new container.Discord.MessageSelectMenu({
				placeholder: 'Choose the Image Size',
				customId: 'main',
				options: [
					{
						label: 'No Animation',
						value: 'Option 1',
						emoji: '🖼️',
					},
					{
						label: '256 pixels',
						value: 'Option 2',
						emoji: '🖼️',
					},
					{
						label: '1024 pixels',
						value: 'Option 0',
						emoji: '🖼️',
					},
				],
			}),
		);

		const avtEmbed = new container.Discord.MessageEmbed()
			.setTitle(`${member.username}'s Avatar`)
			.setImage(member.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }))
			.setDescription(
				`> Download Avatar Image At:\n**[PNG](${png}) | [JPG](${jpg}) | [GIF](${gif}) | [WEBP](${webp})**` ||
					`**[PNG](${png}) | [JPG](${jpg})**`,
			)
			.setColor(interaction.member.displayHexColor)
			.setFooter({
				text: client.embed.text.setFooter + interaction.user.username,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})

			.setTimestamp();

		const avt = await interaction.reply({ embeds: [avtEmbed], components: [avatarMenu], fetchReply: true });
		const filter = async (interaction) => {
			if (interaction.user.id !== interaction.user.id) {
				interaction.reply({
					content: "Don't help other people to select the menu!",
					ephemeral: true,
				});
				return false;
			}
			return true;
		};

		const collector = avt.createMessageComponentCollector({
			filter,
			componentType: 'SELECT_MENU',
			time: 30000,
		});

		collector.on('collect', async (menu) => {
			if (menu.values[0] === 'Option 1') {
				menu.update({
					embeds: [
						avtEmbed
							.setTitle('No Animation')
							.setImage(
								member.displayAvatarURL({
									size: 1024,
									dynamic: false,
									format: 'png',
								}),
							)
							.setFooter({
								text: client.embed.text.setFooter + interaction.user.username,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
							})
							.setTimestamp()
							.setColor(interaction.member.displayHexColor),
					],
				});
			} else if (menu.values[0] === 'Option 0') {
				menu.update({
					embeds: [
						avtEmbed
							.setTitle('Size : 1024px')
							.setImage(
								member.displayAvatarURL({
									size: 1024,
									dynamic: true,
									format: 'png',
								}),
							)
							.setFooter({
								text: client.embed.text.setFooter + interaction.user.username,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
							})
							.setTimestamp()
							.setColor(interaction.member.displayHexColor),
					],
				});
			} else if (menu.values[0] === 'Option 2') {
				menu.update({
					embeds: [
						avtEmbed
							.setTitle('Size : 256px')
							.setImage(
								member.displayAvatarURL({
									size: 256,
									dynamic: true,
									format: 'png',
								}),
							)
							.setFooter({
								text: client.embed.text.setFooter + interaction.user.username,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
							})
							.setTimestamp()
							.setColor(interaction.member.displayHexColor),
					],
				});
			}
		});

		collector.on('end', async (menu) => {
			await interaction.editReply({ embeds: [avtEmbed], components: [] });
		});
	},
};
