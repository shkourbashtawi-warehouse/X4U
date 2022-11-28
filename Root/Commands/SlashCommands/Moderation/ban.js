module.exports = {
	name: 'ban',
	description: 'Ban a user',
	usage: ['ban [user]'],
	category: 'Moderation',
	cooldown: 5,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['BAN_MEMBERS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'The user you want to ban.',
			type: 6,
			required: true,
		},
		{
			name: 'days',
			description: 'How many days of messages to remove',
			type: 4,
			choices: [
				{
					name: '0',
					value: 0,
				},
				{
					name: '1',
					value: 1,
				},
				{
					name: '2',
					value: 2,
				},
				{
					name: '3',
					value: 3,
				},
				{
					name: '4',
					value: 4,
				},
				{
					name: '5',
					value: 5,
				},
				{
					name: '6',
					value: 6,
				},
				{
					name: '7',
					value: 7,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		try {
			const member = interaction.options.getMember('user');
			const Days = interaction.options.getInteger('days') || 0;
			const FetchMember = interaction.guild.members.cache.get(member.id);
			console.log(FetchMember);
			if (FetchMember.id) {
				if (member.id) {
					if (member.id === interaction.user.id) {
						let embed = new container.Discord.MessageEmbed()
							.setDescription("> You can't ban yourself!")
							.setColor(client.embed.color.red);
						return interaction.reply({ embeds: [embed] });
					}
					if (member.id === client.user.id) {
						let embed2 = new container.Discord.MessageEmbed()
							.setDescription("> You can't ban me!")
							.setColor(client.embed.color.red);
						return interaction.reply({ embeds: [embed2] });
					}
					if (!member.bannable) {
						let embed3 = new container.Discord.MessageEmbed()
							.setDescription("> i can't ban this user!")
							.setColor(client.embed.color.red);
						return interaction.reply({ embeds: [embed3] });
					}

					const role = member.roles.highest.position;
					const authorRole = interaction.member.roles.highest.position;

					if (role >= authorRole) {
						let embed3 = new container.Discord.MessageEmbed()
							.setDescription("> You can't ban a member who has the same role as you or a higher role than you.")
							.setColor(client.embed.color.red);
						return interaction.reply({ embeds: [embed3] });
					}

					let reason;
					const EmbedBeforeDone = new container.Discord.MessageEmbed()
						.setTitle('Bann User')
						.setDescription(`> Select a reason for ban user`)
						.addField('User Name', ' > ' + member.user.username, true)
						.addField('User ID', ' > ' + member.user.id, true)
						.setColor(client.embed.color.orange);
					const EmbedAfterDone = new container.Discord.MessageEmbed();
					if (Days === 0) {
						EmbedAfterDone.setDescription(`> **${member} has been banned**`);
					}
					if (Days > 0) {
						EmbedAfterDone.setDescription(
							`> **${member} has been banned\n> Delete all blocked member messages within ${Days} days.**`,
						);
					}
					EmbedAfterDone.setColor(client.embed.color.green);
					const row = new container.Discord.MessageActionRow().addComponents(
						new container.Discord.MessageSelectMenu()
							.setCustomId('reason')
							.setPlaceholder('Select a reason')
							.addOptions([
								{
									label: 'Spaming',
									value: 'spaming',
								},
								{
									label: 'Advertising',
									value: 'advertising',
								},
								{
									label: 'Swearing',
									value: 'swearing',
								},
								{
									label: 'NSFW',
									value: 'nsfw',
								},
								{
									label: 'Other',
									value: 'other',
								},
							]),
					);
					interaction.reply({ embeds: [EmbedBeforeDone], components: [row] });
					const filter = (i) => i.customId === 'reason' && i.user.id === interaction.user.id;
					const collector = interaction.channel.createMessageComponentCollector({
						filter: filter,
						time: 30000,
					});
					collector.on('collect', async (i) => {
						if (i.customId === 'reason') {
							reason = i.values[0];
							await member.ban({
								reason: `By: ${interaction.user.tag} | Reason: ${reason}`,
								days: Days,
							});
							return interaction.editReply({
								embeds: [EmbedAfterDone],
								components: [],
							});
						}
						collector.stop();
					});
					collector.on('end', () => {
						if (!reason) {
							const Failed = new container.Discord.MessageEmbed()
								.setDescription(`> The time is up, please be quick to choose an action!`)
								.setColor(client.embed.color.red);
							return interaction.editReply({
								embeds: [Failed],
								components: [],
							});
						}
					});
				}
			}
		} catch (error) {
			const member = interaction.options.data.filter((i) => i.name === 'user')[0].user;
			const Days = interaction.options.getInteger('days') || 0;
			let reason;
			const EmbedBeforeDone = new container.Discord.MessageEmbed()
				.setTitle('Bann User')
				.setDescription(`> Select a reason for ban user`)
				.addField('User Name', ' > ' + member.username, true)
				.addField('User ID', ' > ' + member.id, true)
				.setColor(client.embed.color.orange);
			const EmbedAfterDone = new container.Discord.MessageEmbed();
			if (Days === 0) {
				EmbedAfterDone.setDescription(`> **${member} has been banned**`);
			}
			if (Days > 0) {
				EmbedAfterDone.setDescription(
					`> **${member} has been banned\n> Delete all blocked member messages within ${Days} days.**`,
				);
			}
			EmbedAfterDone.setColor(client.embed.color.green);
			const row = new container.Discord.MessageActionRow().addComponents(
				new container.Discord.MessageSelectMenu()
					.setCustomId('reason')
					.setPlaceholder('Select a reason')
					.addOptions([
						{
							label: 'Spaming',
							value: 'spaming',
						},
						{
							label: 'Advertising',
							value: 'advertising',
						},
						{
							label: 'Swearing',
							value: 'swearing',
						},
						{
							label: 'NSFW',
							value: 'nsfw',
						},
						{
							label: 'Other',
							value: 'other',
						},
					]),
			);
			interaction.reply({ embeds: [EmbedBeforeDone], components: [row] });
			const filter = (i) => i.customId === 'reason' && i.user.id === interaction.user.id;
			const collector = interaction.channel.createMessageComponentCollector({
				filter: filter,
				time: 30000,
			});
			collector.on('collect', async (i) => {
				if (i.customId === 'reason') {
					reason = i.values[0];

					interaction.guild.members.ban(member, {
						reason: `By: ${interaction.user.tag} | Reason: ${reason}`,
						days: Days,
					});
					return interaction.editReply({
						embeds: [EmbedAfterDone],
						components: [],
					});
				}
				collector.stop();
			});
			collector.on('end', () => {
				if (!reason) {
					const Failed = new container.Discord.MessageEmbed()
						.setDescription(`> The time is up, please be quick to choose an action!`)
						.setColor(client.embed.color.red);
					return interaction.editReply({
						embeds: [Failed],
						components: [],
					});
				}
			});
		}
	},
};
