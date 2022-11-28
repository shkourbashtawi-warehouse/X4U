module.exports = {
	name: 'roleCreate',
	run: async (role, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		if (!role) return;
		if (role.managed) return;
		const guild = role.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const allLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_CREATE', limit: 5 }).catch(() => {});
						if (!allLogs) return;
						if (allLogs) {
							const fetchModerator = allLogs.entries.filter((entry) => entry.target.id === role.id).first();
							if (!fetchModerator) return;
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: role.guild.name, iconURL: role.guild.iconURL({ dynamic: true }) })
								.setTitle('✅ Role Created')
								.setDescription(`✅ **${role}** role has been created.`)
								.setColor(client.embed.color.onix)
								.setFooter({
									text: fetchModerator.executor.tag,
									iconURL: fetchModerator.executor.displayAvatarURL({ dynamic: true }),
								})
								.setTimestamp()

								.addFields(
									{
										name: 'Role',
										value: `\`\`\`bf\nName = ${role.name}\nColor = ${
											role.hexColor
										}\nPosition = ${role.position.toString()}\`\`\``,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nRole = ${role.id}\nPerpetrator = ${fetchModerator.executor.id}\`\`\``,
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
