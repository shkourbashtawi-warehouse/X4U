module.exports = {
	name: 'guildMemberUpdate',
	run: async (oldMember, newMember, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = newMember.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const role = oldMember.roles.cache.difference(newMember.roles.cache).first();
						if (!role) return;
						if (!oldMember.isCommunicationDisabled() && newMember.isCommunicationDisabled()) {
							const allLogs = await newMember.guild
								.fetchAuditLogs({ type: 'MEMBER_UPDATE', limit: 10 })
								.catch(() => {});
							if (allLogs) {
								const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === newMember.id).first();
								const embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: newMember.user.tag,
										iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
									})
									.setDescription(`**🤫 ${newMember} has been timeout **`)
									.addField(
										'Timeout will be removed at:',
										`<t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:R>`,
										true,
									)
									.addFields(
										{
											name: 'Reason',
											value: `\`\`\`css\n${fetchModerator.reason || 'No reason provided.'}\`\`\``,
										},
										{
											name: 'ID',
											value: `\`\`\`ini\nUser = ${newMember.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
										},
									)
									.setColor(client.embed.color.onix)
									.setFooter({
										text: fetchModerator.executor.tag,
										iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
									});
								const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
								if (!ChannelFetch) return;
								if (ChannelFetch) {
									await ChannelFetch.fetchWebhooks().then((webhooks) => {
										const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);

										if (!webhook) return;
										if (webhook) {
											webhook.send({ embeds: [embed] });
										}
									});
								}
							}
						}
						const allLogs = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE', limit: 10 }).catch(() => {});
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === newMember.id).first();
							if (oldMember.isCommunicationDisabled() && !newMember.isCommunicationDisabled()) {
								const embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: newMember.user.tag,
										iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
									})
									.setDescription(`**😏 ${newMember} has been removed from timeout**`)
									.addFields(
										{
											name: 'Reason',
											value: `\`\`\`css\nTimeout ended\`\`\``,
										},
										{
											name: 'ID',
											value: `\`\`\`ini\nUser = ${newMember.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
										},
									)
									.setColor(client.embed.color.onix)
									.setFooter({
										text: fetchModerator.executor.tag,
										iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
									});
								const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
								if (!ChannelFetch) return;
								if (ChannelFetch) {
									await ChannelFetch.fetchWebhooks().then((webhooks) => {
										const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
										if (!webhook) return;
										if (webhook) {
											webhook.send({ embeds: [embed] });
										}
									});
								}
							}
						}
						if (oldMember.roles.cache.size < newMember.roles.cache.size) {
							const allLogs = await newMember.guild
								.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 10 })
								.catch(() => {});
							if (!allLogs) return;
							if (allLogs) {
								const fetchModerator = allLogs.entries.find(
									(entry) => entry.target.id === newMember.id && entry.actionType === 'UPDATE',
								);
								if (!fetchModerator) return;
								if (fetchModerator) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({
											name: `${newMember.user.tag} | Role Add`,
											iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
										})
										.setTimestamp()
										.setColor(client.embed.color.onix)
										.setDescription(
											`**Added Roles**\n Role: ${role}\n User: ${newMember}\n\n ${newMember} Was given the **${role.name}** Role.`,
										)
										.setFooter({
											text: fetchModerator.executor.tag,
											iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
										});
									const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
									if (!ChannelFetch) return;
									if (ChannelFetch) {
										await ChannelFetch.fetchWebhooks().then((webhooks) => {
											const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
											if (!webhook) return;
											if (webhook) {
												webhook.send({ embeds: [embed] });
											}
										});
									}
								}
							}
						}

						if (oldMember.roles.cache.size > newMember.roles.cache.size) {
							const allLogs = await newMember.guild
								.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 10 })
								.catch(() => {});
							if (!allLogs) return;
							if (allLogs) {
								const fetchModerator = allLogs.entries.find(
									(entry) => entry.target.id === newMember.id && entry.actionType === 'UPDATE',
								);
								if (fetchModerator) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({
											name: `${newMember.user.tag} | Role Remove`,
											iconURL: newMember.user.displayAvatarURL({ dynamic: true }),
										})
										.setTimestamp()
										.setColor(client.embed.color.onix)
										.setDescription(
											`**Removed Roles**\n Role: ${role}\n User: ${newMember}\n\n The **${role.name}** role was removed from ${newMember}`,
										)
										.setFooter({
											text: fetchModerator.executor.tag,
											iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
										});

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
