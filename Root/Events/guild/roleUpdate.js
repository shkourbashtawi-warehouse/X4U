module.exports = {
	name: 'roleUpdate',
	run: async (oldRole, newRole, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = oldRole.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE', limit: 5 }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === newRole.id).first();
							if (!fetchModerator) return;
							if (oldRole.color !== newRole.color) {
								if (fetchModerator) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL({ dynamic: true }) })
										.setDescription(`♻️ **${newRole}** has been updated with a new color.`)
										.addFields(
											{
												name: 'Color',
												value: `\`\`\`bf\nOld = ${oldRole.hexColor}\nNew = ${newRole.hexColor}\`\`\``,
											},
											{
												name: 'ID',
												value: `\`\`\`ini\nRole = ${newRole.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
											},
										)
										.setColor(client.embed.color.onix)

										.setFooter({
											text: fetchModerator.executor.tag,
											iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
										})
										.setTimestamp();

									const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
									if (ChannelFetch) {
										await ChannelFetch.fetchWebhooks().then((webhooks) => {
											const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
											if (!webhook) return;
											if (webhook) {
												return webhook.send({ embeds: [embed] });
											}
										});
									}
									return;
								}
							} else if (oldRole.name !== newRole.name) {
								if (fetchModerator) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL({ dynamic: true }) })
										.setDescription(`♻️ **${newRole}** has been updated with a new name.`)
										.addFields(
											{
												name: 'Old name:',
												value: oldRole.name,
												inline: true,
											},
											{
												name: 'New name:',
												value: newRole.name,
												inline: true,
											},
											{
												name: 'ID',
												value: `\`\`\`ini\nRole = ${newRole.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
											},
										)
										.setColor(client.embed.color.onix)
										.setFooter({
											text: fetchModerator.executor.tag,
											iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
										})
										.setTimestamp();

									const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
									if (ChannelFetch) {
										await ChannelFetch.fetchWebhooks().then((webhooks) => {
											const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
											if (!webhook) return;
											if (webhook) {
												return webhook.send({ embeds: [embed] });
											}
										});
									}
									return;
								}
							}
							/*
	
						else {
							let perms = {
								"1": "CREATE_INSTANT_INVITE",
								"2": "KICK_MEMBERS",
								"4": "BAN_MEMBERS",
								"8": "ADMINISTRATOR",
								"16": "MANAGE_CHANNELS",
								"32": "MANAGE_GUILD",
								"64": "ADD_REACTIONS",
								"128": "VIEW_AUDIT_LOG",
								"256": "PRIORITY_SPEAKER",
								"1024": "VIEW_CHANNEL",
								"1024": "READ_MESSAGES",
								"2048": "SEND_MESSAGES",
								"4096": "SEND_TTS_MESSAGES",
								"8192": "MANAGE_MESSAGES",
								"16384": "EMBED_LINKS",
								"32768": "ATTACH_FILES",
								"65536": "READ_MESSAGE_HISTORY",
								"131072": "MENTION_EVERYONE",
								"262144": "EXTERNAL_EMOJIS",
								"262144": "USE_EXTERNAL_EMOJIS",
								"1048576": "CONNECT",
								"2097152": "SPEAK",
								"4194304": "MUTE_MEMBERS",
								"8388608": "DEAFEN_MEMBERS",
								"16777216": "MOVE_MEMBERS",
								"33554432": "USE_VAD",
								"67108864": "CHANGE_NICKNAME",
								"134217728": "MANAGE_NICKNAMES",
								"268435456": "MANAGE_ROLES",
								"268435456": "MANAGE_ROLES_OR_PERMISSIONS",
								"536870912": "MANAGE_WEBHOOKS",
								"1073741824 ": "MANAGE_EMOJIS",
								CREATE_INSTANT_INVITE: "CREATE_INSTANT_INVITE",
								KICK_MEMBERS: "KICK_MEMBERS",
								BAN_MEMBERS: "BAN_MEMBERS",
								ADMINISTRATOR: "ADMINISTRATOR",
								MANAGE_CHANNELS: "MANAGE_CHANNELS",
								MANAGE_GUILD: "MANAGE_GUILD",
								ADD_REACTIONS: "ADD_REACTIONS",
								VIEW_AUDIT_LOG: "VIEW_AUDIT_LOG",
								PRIORITY_SPEAKER: "PRIORITY_SPEAKER",
								VIEW_CHANNEL: "VIEW_CHANNEL",
								READ_MESSAGES: "READ_MESSAGES",
								SEND_MESSAGES: "SEND_MESSAGES",
								SEND_TTS_MESSAGES: "SEND_TTS_MESSAGES",
								MANAGE_MESSAGES: "MANAGE_MESSAGES",
								EMBED_LINKS: "EMBED_LINKS",
								ATTACH_FILES: "ATTACH_FILES",
								READ_MESSAGE_HISTORY: "READ_MESSAGE_HISTORY",
								MENTION_EVERYONE: "MENTION_EVERYONE",
								EXTERNAL_EMOJIS: "EXTERNAL_EMOJIS",
								USE_EXTERNAL_EMOJIS: "USE_EXTERNAL_EMOJIS",
								CONNECT: "CONNECT",
								SPEAK: "SPEAK",
								MUTE_MEMBERS: "MUTE_MEMBERS",
								DEAFEN_MEMBERS: "DEAFEN_MEMBERS",
								MOVE_MEMBERS: "MOVE_MEMBERS",
								USE_VAD: "USE_VAD",
								CHANGE_NICKNAME: "CHANGE_NICKNAME",
								MANAGE_NICKNAMES: "MANAGE_NICKNAMES",
								MANAGE_ROLES: "MANAGE_ROLES",
								MANAGE_ROLES_OR_PERMISSIONS: "MANAGE_ROLES_OR_PERMISSIONS",
								MANAGE_WEBHOOKS: "MANAGE_WEBHOOKS",
								MANAGE_EMOJIS: "MANAGE_EMOJIS"
							};
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL({ dynamic: true }) })
								.setDescription(`😛 **\`${newRole.name}\` has been updated.**`)
								.setFooter({
									text: fetchModerator.executor.tag,
									iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
								}) 
								.setDescription(`__ROLE: ${newRole}__ \n
									**THE PERMISSIONS CHANGED PLEASE CHECK!!!**
									OLD PERMISSIONS: ${perms[String(oldRole.permissions.bitfield)]}
									NEW PERMISSIONS: ${perms[String(newRole.permissions.bitfield)]}
									**Role ID:** \`${newRole.id}\``)
								.setColor(client.embed.color.onix)
								.setTimestamp()

							const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel)
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
						*/
						}
					}
				} else {
					return;
				}
			},
		);
	},
};
