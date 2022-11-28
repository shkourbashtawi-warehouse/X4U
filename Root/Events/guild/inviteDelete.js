module.exports = {
	name: 'inviteDelete',
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
						const allLogs = await invite.guild.fetchAuditLogs({ type: 'INVITE_DELETE' }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === invite.id).first();
							if (!fetchModerator) return;
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: invite.guild.name, iconURL: invite.guild.iconURL({ dynamic: true }) })
								.setTitle('🗑 Invite Deleted')
								.setDescription(
									`**<@${fetchModerator.executor.id}> has deleted a invite for ${invite.channel} channel**`,
								)
								.setTimestamp()
								.setColor(client.embed.color.onix)
								.setFooter({
									text: fetchModerator.executor.tag,
									iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
								})
								.addFields(
									{
										name: 'Invite link:',
										value: `https://discord.gg/${invite.code}`,
										inline: true,
									},
									{
										name: 'Invite Code:',
										value: invite.code,
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
