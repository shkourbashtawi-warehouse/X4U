module.exports = {
	name: 'channelCreate',
	run: async (channel, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = channel.guild;
		if (channel.type === 1 || channel.type === 3) return;

		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE', limit: 10 }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchLogs = allLogs.entries.filter((entry) => entry.target.id === channel.id).first();
							if (!fetchLogs) return;
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
								.setTitle('✅ Channel Created')
								.setDescription(
									`✅ **Channel Name:** \`${channel.name}\` ${channel}\n🆔 **Channel ID:** \`${channel.id}\`\n🔨 **Channel Type:** \`${channel.type}\``,
								)
								.addFields({
									name: 'ID',
									value: `\`\`\`ini\nChannel = ${channel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
								})
								.setColor(client.embed.color.onix)
								.setFooter({
									text: fetchLogs.executor.tag,
									iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
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
