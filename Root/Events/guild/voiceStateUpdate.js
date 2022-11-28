module.exports = {
	name: 'voiceStateUpdate',
	ignoreFile: true,
	run: async (oldState, newState, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}
		if (!oldState || !newState) return;
		const guild = newState.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						let oldChannel =
							oldState.channelId != null && typeof oldState.channelId != undefined
								? client.channels.cache.get(oldState.channelId)
								: 'None';
						let newChannel =
							newState.channelId != null && typeof newState.channelId != undefined
								? client.channels.cache.get(newState.channelId)
								: 'None';
						if (oldState.serverMute != newState.serverMute) {
							if (newState.serverMute == true) {
								let embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: oldState.guild.name,
										iconURL: oldState.guild.iconURL({ dynamic: true }),
									})
									.setDescription(`❌ ${oldState.member.user} muted in channel ${newChannel}`)
									.addFields({
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\`\`\``,
									})
									.setColor(client.embed.color.onix)
									.setFooter({
										text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
										iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
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

							if (newState.serverMute == false) {
								let embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: oldState.guild.name,
										iconURL: oldState.guild.iconURL({ dynamic: true }),
									})
									.setDescription(`✅ ${oldState.member.user} unmuted in channel ${newChannel}`)
									.addFields({
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\`\`\``,
									})
									.setColor(client.embed.color.onix)
									.setFooter({
										text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
										iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
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
						if (oldState.serverDeaf != newState.serverDeaf) {
							if (newState.serverDeaf == true) {
								let embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: oldState.guild.name,
										iconURL: oldState.guild.iconURL({ dynamic: true }),
									})
									.setDescription(`❌ ${oldState.member.user} deafed in channel ${newChannel}`)
									.addFields({
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\`\`\``,
									})
									.setColor(client.embed.color.onix)
									.setFooter({
										text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
										iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
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

							if (newState.serverDeaf == false) {
								let embed = new container.Discord.MessageEmbed()
									.setAuthor({
										name: oldState.guild.name,
										iconURL: oldState.guild.iconURL({ dynamic: true }),
									})
									.setDescription(`✅ ${oldState.member.user} undeafed in channel ${newChannel}`)
									.addFields({
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\`\`\``,
									})
									.setColor(client.embed.color.onix)
									.setFooter({
										text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
										iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
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
						if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({
									name: newState.guild.name,
									iconURL: newState.guild.iconURL({ dynamic: true }),
								})
								.setColor(client.embed.color.onix)
								.setDescription(`✅ ${newState.member} moved from ${oldState.channel} to ${newState.channel}`)
								.addFields(
									{
										name: 'Current channel they are in',
										value: `<#${newState.channel.id}> (${newState.channel.name})`,
									},
									{
										name: 'Previously occupied channel',
										value: `<#${oldState.channel.id}> (${oldState.channel.name})`,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nUser = ${newState.member.id}\nNew = ${newState.channel.id}\nOld = ${oldState.channel.id}\`\`\``,
									},
								)
								.setFooter({
									text: newState.member.user.username + '#' + newState.member.user.discriminator,
									iconURL: newState.member.user.displayAvatarURL({ dynamic: true }),
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

						let oldChannelName;
						let oldparentname = 'unknown';
						let oldchannelname = 'unknown';
						let oldchanelid = 'unknown';
						if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name)
							oldparentname = oldState.channel.parent.name;
						if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name;
						if (oldState && oldState.channelId) oldchanelid = oldState.channelId;
						if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name)
							newparentname = newState.channel.parent.name;
						if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name;
						if (newState && newState.channelId) newchanelid = newState.channelId;
						if (oldState.channelId && oldState.channel) {
							if (typeof oldState.channel.parent !== 'undefined') {
								oldChannelName = `${oldchannelname}`;
							} else {
								oldChannelName = `-${oldparentname}`;
							}
						} else {
							oldChannelName = `Voice Channel not found`;
						}

						if (oldState.channelId && !newState.channelId) {
							const leaveembed = new container.Discord.MessageEmbed()
								.setAuthor({
									name: oldState.guild.name,
									iconURL: oldState.guild.iconURL({ dynamic: true }),
								})
								.setDescription(`✅ ${oldState.member.user.tag ?? 'Unknown'} has left ${oldChannelName}`)
								.addFields(
									{
										name: 'Channel',
										value: `${oldChannelName}`,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\nChannel = ${oldChannelName}\`\`\``,
									},
								)
								.setColor(client.embed.color.onix)
								.setFooter({
									text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
									iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
								})
								.setTimestamp();

							const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
							if (ChannelFetch) {
								await ChannelFetch.fetchWebhooks().then((webhooks) => {
									const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
									if (!webhook) return;
									if (webhook) {
										return webhook.send({ embeds: [leaveembed] });
									}
								});
							}
						}

						if (newChannel) {
							let embed = new container.Discord.MessageEmbed()
								.setAuthor({
									name: oldState.guild.name,
									iconURL: oldState.guild.iconURL({ dynamic: true }),
								})
								.setDescription(`✅ ${oldState.member.user.tag} joined to channel ${newChannel.name}`)
								.addFields(
									{
										name: 'Channel',
										value: `<#${newChannel.id}> (${newChannel.name})`,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nUser = ${oldState.member.id}\nChannel = ${newChannel.id}\`\`\``,
									},
								)
								.setColor(client.embed.color.onix)
								.setFooter({
									text: oldState.member.user.username + '#' + oldState.member.user.discriminator,
									iconURL: oldState.member.user.displayAvatarURL({ dynamic: true }),
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
					}
				} else {
					return;
				}
			},
		);
	},
};
