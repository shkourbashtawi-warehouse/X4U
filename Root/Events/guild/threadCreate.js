module.exports = {
	name: 'threadCreate',
	run: async (thread, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = thread.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await thread.guild.fetchAuditLogs({ type: 'THREAD_CREATE' }).catch(() => {
							return;
						});
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === thread.id).first();
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: thread.guild.name, iconURL: thread.guild.iconURL({ dynamic: true }) })
								.setDescription(`**<@${fetchModerator.executor.id}> has created <#${thread.id}> thread.**`)
								.addFields({
									name: 'ID',
									value: `\`\`\`ini\nThread = ${thread.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
								})
								.setColor(client.embed.color.onix)
								.setFooter({
									text: fetchModerator.executor.tag,
									iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
								})
								.setTimestamp();

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
