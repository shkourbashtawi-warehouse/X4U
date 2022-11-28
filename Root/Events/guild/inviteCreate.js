module.exports = {
	name: 'inviteCreate',
	run: async (invite, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = invite.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await invite.guild.fetchAuditLogs({ type: 'INVITE_CREATE' }).catch(() => {
							return;
						});
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === invite.id).first();
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: invite.guild.name, iconURL: invite.guild.iconURL({ dynamic: true }) })
								.setTitle('👩‍👧‍👦 Invite Created')
								.setDescription(
									`**<@${fetchModerator.executor.id}> has created a new invite for ${invite.channel} channel**`,
								)
								.setTimestamp()
								.setColor(client.embed.color.onix)
								.setFooter({ text: invite.inviter.tag, iconURL: invite.inviter.displayAvatarURL({ dynamic: true }) })
								.addFields(
									{
										name: 'Invite link:',
										value: `[Invite](https://discord.gg/${invite.code})`,
										inline: true,
									},
									{
										name: 'Invite Created At:',
										value: `<t:${Math.floor(invite.createdAt / 1000)}:R>`,
										inline: true,
									},
									{
										name: 'Invite Expires At:',
										value: `<t:${Math.floor(invite.expiresTimestamp / 1000)}:R>`,
										inline: true,
									},
									{
										name: 'Max Uses:',
										value: invite.maxUses.toString(),
										inline: true,
									},
								);

							const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
							if (!ChannelFetch) return;
							if (ChannelFetch) {
								await ChannelFetch.fetchWebhooks().then((webhooks) => {
									const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
									if (!webhook) return;
									if (webhook) {
										return webhook.send({ embeds: [embed] });
									}
								});
							}
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
