module.exports = {
	name: 'channelUpdate',
	run: async (oldChannel, newChannel, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = oldChannel.guild;
		if (newChannel.type === 1 || newChannel.type === 3) return;
		if (newChannel.position !== oldChannel.position) return;

		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						let perms = {
							1: 'CREATE_INSTANT_INVITE',
							2: 'KICK_MEMBERS',
							4: 'BAN_MEMBERS',
							8: 'ADMINISTRATOR',
							16: 'MANAGE_CHANNELS',
							32: 'MANAGE_GUILD',
							64: 'ADD_REACTIONS',
							128: 'VIEW_AUDIT_LOG',
							256: 'PRIORITY_SPEAKER',
							1024: 'VIEW_CHANNEL',
							1024: 'READ_MESSAGES',
							2048: 'SEND_MESSAGES',
							4096: 'SEND_TTS_MESSAGES',
							8192: 'MANAGE_MESSAGES',
							16384: 'EMBED_LINKS',
							32768: 'ATTACH_FILES',
							65536: 'READ_MESSAGE_HISTORY',
							131072: 'MENTION_EVERYONE',
							262144: 'EXTERNAL_EMOJIS',
							262144: 'USE_EXTERNAL_EMOJIS',
							1048576: 'CONNECT',
							2097152: 'SPEAK',
							4194304: 'MUTE_MEMBERS',
							8388608: 'DEAFEN_MEMBERS',
							16777216: 'MOVE_MEMBERS',
							33554432: 'USE_VAD',
							67108864: 'CHANGE_NICKNAME',
							134217728: 'MANAGE_NICKNAMES',
							268435456: 'MANAGE_ROLES',
							268435456: 'MANAGE_ROLES_OR_PERMISSIONS',
							536870912: 'MANAGE_WEBHOOKS',
							'1073741824 ': 'MANAGE_EMOJIS',
							CREATE_INSTANT_INVITE: 'CREATE_INSTANT_INVITE',
							KICK_MEMBERS: 'KICK_MEMBERS',
							BAN_MEMBERS: 'BAN_MEMBERS',
							ADMINISTRATOR: 'ADMINISTRATOR',
							MANAGE_CHANNELS: 'MANAGE_CHANNELS',
							MANAGE_GUILD: 'MANAGE_GUILD',
							ADD_REACTIONS: 'ADD_REACTIONS',
							VIEW_AUDIT_LOG: 'VIEW_AUDIT_LOG',
							PRIORITY_SPEAKER: 'PRIORITY_SPEAKER',
							VIEW_CHANNEL: 'VIEW_CHANNEL',
							READ_MESSAGES: 'READ_MESSAGES',
							SEND_MESSAGES: 'SEND_MESSAGES',
							SEND_TTS_MESSAGES: 'SEND_TTS_MESSAGES',
							MANAGE_MESSAGES: 'MANAGE_MESSAGES',
							EMBED_LINKS: 'EMBED_LINKS',
							ATTACH_FILES: 'ATTACH_FILES',
							READ_MESSAGE_HISTORY: 'READ_MESSAGE_HISTORY',
							MENTION_EVERYONE: 'MENTION_EVERYONE',
							EXTERNAL_EMOJIS: 'EXTERNAL_EMOJIS',
							USE_EXTERNAL_EMOJIS: 'USE_EXTERNAL_EMOJIS',
							CONNECT: 'CONNECT',
							SPEAK: 'SPEAK',
							MUTE_MEMBERS: 'MUTE_MEMBERS',
							DEAFEN_MEMBERS: 'DEAFEN_MEMBERS',
							MOVE_MEMBERS: 'MOVE_MEMBERS',
							USE_VAD: 'USE_VAD',
							CHANGE_NICKNAME: 'CHANGE_NICKNAME',
							MANAGE_NICKNAMES: 'MANAGE_NICKNAMES',
							MANAGE_ROLES: 'MANAGE_ROLES',
							MANAGE_ROLES_OR_PERMISSIONS: 'MANAGE_ROLES_OR_PERMISSIONS',
							MANAGE_WEBHOOKS: 'MANAGE_WEBHOOKS',
							MANAGE_EMOJIS: 'MANAGE_EMOJIS',
						};
						const allLogs = await newChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE', limit: 5 }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchLogs = allLogs.entries.filter((entry) => entry.target.id === newChannel.id).first();
							if (!fetchLogs) return;
							if (fetchLogs) {
								if (fetchLogs.executor.bot) return;
								if (oldChannel.name != newChannel.name) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
										.setTitle('♻️ Channel Updated')
										.setDescription(
											`**${
												newChannel.type === 'GUILD_CATEGORY' ? 'Category' : 'Channel'
											} name changed of ${newChannel.toString()}**`,
										)
										.setColor(client.embed.color.onix)
										.addFields(
											{ name: 'Old:', value: `${oldChannel.name}`, inline: true },
											{ name: 'New:', value: `${newChannel.name}`, inline: true },
											{
												name: 'ID',
												value: `\`\`\`ini\nChannel = ${newChannel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
											},
										)
										.setFooter({
											text: fetchLogs.executor.tag,
											iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
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
								}
								if (oldChannel.topic != newChannel.topic) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
										.setTitle('♻️ Channel Updated')
										.setDescription(
											`**${
												newChannel.type === 'GUILD_CATEGORY' ? 'Category' : 'Channel'
											} topic changed of ${newChannel.toString()}**`,
										)
										.addFields(
											{ name: 'Old:', value: `${oldChannel.topic ? oldChannel.topic : '*empty topic*'}`, inline: true },
											{ name: 'New:', value: `${newChannel.topic ? newChannel.topic : '*empty topic*'}`, inline: true },
											{
												name: 'ID',
												value: `\`\`\`ini\nChannel = ${newChannel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
											},
										)
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
								if (oldChannel.rtcRegion != newChannel.rtcRegion) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
										.setTitle('♻️ Channel Updated')
										.setDescription(
											`**${
												newChannel.type === 'GUILD_CATEGORY' ? 'Category' : 'Channel'
											} region changed of ${newChannel.toString()}**`,
										)

										.addFields(
											{ name: 'Old:', value: `${oldChannel.rtcRegion}`, inline: true },
											{ name: 'New:', value: `${newChannel.rtcRegion}`, inline: true },
											{
												name: 'ID',
												value: `\`\`\`ini\nChannel = ${newChannel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
											},
										)
										.setColor(client.embed.color.onix)
										.setFooter({
											text: fetchLogs.executor.tag,
											iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
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
								}
								if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
									const NewCooldown = newChannel.rateLimitPerUser;
									const OldCooldown = oldChannel.rateLimitPerUser;

									var NewC;
									if (NewCooldown === 0) {
										NewC = `Cooldown set to 0`;
									}
									if (NewCooldown < 60 && NewCooldown >= 1) {
										NewC = `${NewCooldown} Seconds`;
									}
									if (NewCooldown < 3600 && NewCooldown >= 60) {
										Convert = Math.floor(NewCooldown / 60);
										NewC = `${Convert} Minutes`;
									}
									if (NewCooldown <= 86400 && NewCooldown >= 3600) {
										Convert = Math.floor(NewCooldown / 3600);
										NewC = `${Convert} Hours`;
									}

									var NewO;
									if (OldCooldown === 0) {
										NewO = `Slowmode set to 0`;
									}
									if (OldCooldown < 60 && OldCooldown >= 1) {
										NewO = `${OldCooldown} Seconds`;
									}
									if (OldCooldown < 3600 && OldCooldown >= 60) {
										Convert = Math.floor(OldCooldown / 60);
										NewO = `${Convert} Minutes`;
									}
									if (OldCooldown <= 86400 && OldCooldown >= 3600) {
										Convert = Math.floor(OldCooldown / 3600);
										NewO = `${Convert} Hours`;
									}
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
										.setTitle('♻️ Channel Updated')
										.setDescription(
											`**${
												newChannel.type === 'GUILD_CATEGORY' ? 'Category' : 'Channel'
											} slowmode changed of ${newChannel.toString()}**`,
										)
										.addFields(
											{ name: 'Old Slowmode:', value: `${NewO}`, inline: true },
											{ name: 'New Slowmode:', value: `${NewC || 'None'}`, inline: true },
											{
												name: 'ID',
												value: `\`\`\`ini\nChannel = ${newChannel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
											},
										)
										.setColor(client.embed.color.onix)
										.setFooter({
											text: fetchLogs.executor.tag,
											iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
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
								}
								if (oldChannel.nsfw !== newChannel.nsfw) {
									const embed = new container.Discord.MessageEmbed()
										.setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL({ dynamic: true }) })
										.setTitle('♻️ Channel Updated')
										.setDescription(
											`**${
												newChannel.type === 'GUILD_CATEGORY' ? 'Category' : 'Channel'
											} NSFW changed of ${newChannel.toString()}**`,
										)

										.addFields(
											{ name: 'Old Status:', value: `${oldChannel.nsfw}`, inline: true },
											{ name: 'New Status:', value: `${newChannel.nsfw}`, inline: true },
											{
												name: 'ID',
												value: `\`\`\`ini\nChannel = ${newChannel.id}\nPerpetrator = ${fetchLogs.executor.id}\`\`\``,
											},
										)
										.setColor(client.embed.color.onix)
										.setFooter({
											text: fetchLogs.executor.tag,
											iconURL: fetchLogs.executor.displayAvatarURL({ dynamic: true }),
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
