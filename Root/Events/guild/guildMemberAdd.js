module.exports = {
	name: 'guildMemberAdd',
	run: async (member, client, container) => {
		const LogsSchema = require('../../Database/Other/Logs');
		const guildMemberAddSchema = require('../../Database/EventsSchema/guildMemberAdd');
		const TextWelcomeSchema = require('../../Database/Settings/Welcome/TextWelcome');
		const AutoRoleSchema = require('../../Database/Other/AutoRole');
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		guildMemberAddSchema.findOne(
			{
				guildID: member.guild.id,
			},
			async (err, doc) => {
				if (doc) {
					const embed = new container.Discord.MessageEmbed()
						.setTitle('📥 Member Joined')
						.setAuthor({
							name: member.user.username,
							iconURL: member.user.displayAvatarURL({ dynamic: true }),
							url: member.user.displayAvatarURL({ dynamic: true }),
						})
						.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
						.setDescription(
							`__Welcome Bro in **${member.guild.name}**.__\n\n> • Information •\n> Username: ${member}\n> ID: ${
								member.user.id
							}\n> User Created At: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
						)
						.setColor(client.embed.color.onix)
						.setFooter({
							text: `${member.guild.name} | ${member.guild.memberCount}th member`,
							iconURL: member.guild.iconURL({ dynamic: true }),
						})
						.setTimestamp();
					const channel = member.guild.channels.cache.get(doc.channelID);
					if (channel) {
						channel.send({ embeds: [embed] });
					} else {
						return;
					}
				} else if (!doc) {
					return;
				}
			},
		);

		AutoRoleSchema.findOne({ guildId: member.guild.id, toggleStatus: true }, async (err, data) => {
			if (!data) return;
			const RoleAddToMember = member.guild.roles.cache.get(data.roleObject);
			if (!RoleAddToMember) return;
			member.roles.add(RoleAddToMember.id).catch(() => {});
		});

		const guild = member.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const embed = new container.Discord.MessageEmbed()
							.setTitle('📥 Member Joined')
							.setAuthor({
								name: member.user.username + '#' + member.user.discriminator,
								iconURL: member.user.displayAvatarURL({ dynamic: true }),
								url: member.user.displayAvatarURL({ dynamic: true }),
							})
							.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
							.addFields(
								{
									name: 'User Created At',
									value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
									inline: true,
								},
								{
									name: 'User Joined At',
									value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
									inline: true,
								},
								{
									name: 'User ID',
									value: member.user.id,
									inline: true,
								},
								{
									name: 'User Tag',
									value: member.user.tag,
									inline: true,
								},
								{
									name: 'User Username',
									value: member.user.username,
									inline: true,
								},
								{
									name: 'User Discriminator',
									value: member.user.discriminator,
									inline: true,
								},
								{
									name: 'User Avatar',
									value: `[Link Avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
									inline: true,
								},
								{
									name: 'User Bot',
									value: member.user.bot ? 'Yes' : 'No',
									inline: true,
								},
								{
									name: 'ID',
									value: `\`\`\`ini\nMember = ${member.user.id}\nGuild = ${member.guild.id}\`\`\``,
								},
							)

							.setColor(client.embed.color.onix)
							.setFooter({
								text: `${member.guild.name} | ${member.guild.memberCount}th member`,
								iconURL: member.guild.iconURL({ dynamic: true }),
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
					} else {
						return;
					}
				}
			},
		);
	},
};
