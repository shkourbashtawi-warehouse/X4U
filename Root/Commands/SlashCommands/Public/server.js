module.exports = {
	name: 'server',
	description: 'Information about the server!',
	usage: ['server'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		let FetchMember = await interaction.guild.members.fetch();

		const embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: interaction.guild.name,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setColor(interaction.member.displayHexColor)
			.setFooter({
				text: `Server info of ${interaction.guild.name}`,
				iconURL: interaction.guild.iconURL({ dynamic: true }),
			})
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.addFields(
				{
					name: '🌍 | General',
					value: `
		- **Name**: ${interaction.guild.name}
		- **Created**: <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>
		- **Description**: ${interaction.guild.description ?? 'No Description'}
		
		`,
					inline: true,
				},
				{
					name: '👥 | Users',
					value: `
		- **Members**: ${FetchMember.filter((m) => !m.user.bot).size}
		- **Bots**: ${FetchMember.filter((m) => m.user.bot).size}
		- **Total**: ${interaction.guild.memberCount}
		`,
					inline: true,
				},
				{
					name: '📜 | Channels',
					value: `
		- **Text**: ${interaction.guild.channels.cache.filter((c) => c.type === 'GUILD_TEXT').size}
		- **Voice**: ${interaction.guild.channels.cache.filter((c) => c.type === 'GUILD_VOICE').size}
		- **Threads**: ${
			interaction.guild.channels.cache.filter(
				(c) => c.type === 'GUILD_NEWS_THREAD' && 'GUILD_PRIVATE_THREAD' && 'PUILD_PUBLIC_THREAD',
			).size
		}
		- **Categories**: ${interaction.guild.channels.cache.filter((c) => c.type === 'GUILD_CATEGORY').size}
		- **Stages**: ${interaction.guild.channels.cache.filter((c) => c.type === 'GUILD_STAGE_VOICE').size}
		- **Total**: ${interaction.guild.channels.cache.size}
		`,
					inline: true,
				},
				{
					name: '😁 | Emojis & Stickers',
					value: `
		- **Animated**: ${interaction.guild.emojis.cache.filter((e) => e.animated).size}
		- **Normal**: ${interaction.guild.emojis.cache.filter((e) => !e.animated).size}
		- **Stickers**: ${interaction.guild.stickers.cache.size}
		- **Total**: ${interaction.guild.stickers.cache.size + interaction.guild.emojis.cache.size}
		
		`,
					inline: true,
				},
				{
					name: '🥳 | Boost Information',
					value: `
		- **Tier**: ${interaction.guild.premiumTier.replace('TIER_', '')}
		- **Boosts**: ${interaction.guild.premiumSubscriptionCount}
		- **Boosters**: ${interaction.guild.members.cache.filter((m) => m.premiumSince).size}
		`,
					inline: true,
				},
			);
		interaction.reply({ embeds: [embed] });
	},
};
