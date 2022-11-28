module.exports = {
	name: 'guildBanRemove',
	run: async (ban, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = ban.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE', limit: 5 }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.targetId === ban.id).first();
							if (!fetchModerator) return;
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: ban.guild.name, iconURL: ban.guild.iconURL({ dynamic: true }) })
								.setDescription(`**🔨 <@${ban.user.id}> unbanned**`)
								.addFields(
									{
										name: 'Unban Reason:',
										value: `\`\`\`css\n${fetchModerator.reason || 'No Reason'}\`\`\``,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nUserBanned = ${ban.user.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
									},
								)
								.setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
								.setColor(client.embed.color.onix)
								.setFooter({
									text: fetchModerator.executor.tag,
									iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
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
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
