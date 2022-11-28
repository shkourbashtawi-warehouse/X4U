module.exports = {
	name: 'guildMemberRemove',
	run: async (member, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = member.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const embed = new container.Discord.MessageEmbed()
							.setTitle('📤 Member Left')
							.setAuthor({
								name: member.user.username + '#' + member.user.discriminator,
								iconURL: member.user.displayAvatarURL({ dynamic: true }),
								url: member.user.displayAvatarURL({ dynamic: true }),
							})
							.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
							.addFields(
								{
									name: 'User Created At',
									value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
									inline: true,
								},
								{
									name: 'User Joined At',
									value: `<t:${Math.floor(member.joinedAt / 1000)}:R>`,
									inline: true,
								},
								{
									name: 'User ID',
									value: member.user.id,
									inline: true,
								},
								{
									name: 'User Tag',
									value: member.user.tag,
									inline: true,
								},
								{
									name: 'User Username',
									value: member.user.username,
									inline: true,
								},
								{
									name: 'User Discriminator',
									value: member.user.discriminator,
									inline: true,
								},
								{
									name: 'User Avatar',
									value: `[Link Avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
									inline: true,
								},
								{
									name: 'User Bot',
									value: member.user.bot ? 'Yes' : 'No',
									inline: true,
								},
								{
									name: 'ID',
									value: `\`\`\`ini\nMember = ${member.user.id}\`\`\``,
								},
							)

							.setColor(client.embed.color.onix)
							.setFooter({
								text: `${member.guild.name} | ${member.guild.memberCount}th member`,
								iconURL: member.guild.iconURL({ dynamic: true }),
							})
							.setTimestamp();

						const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
						if (!ChannelFetch) return;
						if (ChannelFetch) {
							await ChannelFetch.fetchWebhooks()
								.then((webhooks) => {
									const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);

									if (!webhook) return;
									if (webhook) {
										return webhook.send({ embeds: [embed] });
									}
								})
								.catch(() => {});
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
