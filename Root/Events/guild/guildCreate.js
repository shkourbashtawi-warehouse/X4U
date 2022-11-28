module.exports = {
	name: 'guildCreate',
	run: async (guild, client, container) => {
		try {
			const channels = (await guild.channels.fetch()).filter(
				(ch) => ch.permissionsFor(guild.me).has('SEND_MESSAGES') && ch.type === 'GUILD_TEXT',
			);
			if (channels.length === 0) return;
			const randomChannel = channels.random();
			const channel = await client.channels.cache.get(randomChannel.id);
			if (channel) {
				const row = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton()
						.setLabel(`Invite Me`)
						.setStyle('LINK')
						.setURL(
							'https://discord.com/api/oauth2/authorize?client_id=931455955013599273&permissions=8&scope=bot%20applications.commands',
						)
						.setEmoji('<:add:938144199117774858>'),
					new container.Discord.MessageButton()
						.setLabel('Support Server')
						.setStyle('LINK')
						.setURL('https://discord.gg/7V9cgntvak')
						.setEmoji('<:link:938144203211427880>'),
					new container.Discord.MessageButton()
						.setLabel(`TOP.GG`)
						.setStyle(`LINK`)
						.setURL(`https://top.gg/bot/931455955013599273`)
						.setEmoji('<:topgg:954225060380569640>'),
				);

				const embed = new container.Discord.MessageEmbed()
					.setTitle(`Hello, I'm X4U Bot, What's Up?`)
					.setAuthor({
						name: client.user.username,
						iconURL: client.user.displayAvatarURL({ dynamic: true }),
					})
					.setDescription(`Hey Guys! I'm **X4U Bot**, a multi-use Discord Bot to assist with your needs..`)
					.addField(
						`__What Does X4U Bot Do?__`,
						`X4U Bot has all sorts of command, Have alot of setup like azkar + line + autoreply + welcome + etc. , Supports all new Discord features`,
					)
					.addField(
						`__Getting Started__`,
						`To get started, use the \`/help\` command so you know every single command X4U Bot has!`,
					)
					.setColor(client.embed.color.onix)
					.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
				await channel.send({ embeds: [embed], components: [row] }).catch(() => {});
			}
			const welcomeEmbed = new container.Discord.MessageEmbed()
				.setTitle('New Server')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Onix was added to a new Server!`)
				.addField(`Server Name`, `\`${guild.name}\``, true)
				.addField(`Server ID`, `\`${guild.id}\``, true)
				.addField(`Server Owner`, `\`${guild.ownerId}\``, true)
				.addField(`Server Members`, `\`${guild.memberCount}\``, true)
				.addField(`Server Created At`, `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, true)
				.setColor(client.embed.color.onix)
				.setFooter({
					text: client.guilds.cache.size + ' guilds',
					iconURL: client.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			client.WebhookGuildJoin.send({
				username: 'Guild Joined',
				embeds: [welcomeEmbed],
			});
		} catch (e) {
			return;
		}
	},
};
