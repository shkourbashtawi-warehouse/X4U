module.exports = {
	name: 'roles1',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		let embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'Roles Games - الرولات الالعاب',
				iconURL: message.guild.iconURL({ dynamic: true }),
			})
			.setDescription(
				`
			> **__Choose Your Game And take Its Role :__**
			
			<:minecraft:973259244856049764>   : Minecraft

			<:brawlhalla:973259847598502018>   : Brawlhalla
		  
			<:amoung_us:973259243140546610>   : Among Us
		  
			<:rocket_league:973259243861987389>   : Rocket League
		  
			<:gtav:973259241974554674>   : Gta V
		  
			<:fortnite:973259846667341864>   : Fortnite
		  
			<:valorant:973259239353110588>   : Valorant
		  
			<:lol:973259243870367744>   : League Of Legends
			`,
			)
			.setColor(client.embed.color.red)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setFooter({
				text: 'X4U Gamers - Roles',
				iconURL: message.guild.iconURL({ dynamic: true }),
			})
			.setTimestamp();

		let ButtonRoles1 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:minecraft:973259244856049764>')
				.setCustomId('minecraft-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:brawlhalla:973259847598502018>')
				.setCustomId('brawlhalla-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:amoung_us:973259243140546610>')
				.setCustomId('amongus-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:rocket_league:973259243861987389>')
				.setCustomId('rocketleague-button'),
		]);
		let ButtonRoles2 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:gtav:973259241974554674>')
				.setCustomId('gtav-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:fortnite:973259846667341864>')
				.setCustomId('fortnite-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:valorant:973259239353110588>')
				.setCustomId('valorant-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:lol:973259243870367744>')
				.setCustomId('lol-button'),
		]);

		let ButtonRoles3 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Get All Roles')
				.setEmoji('➕')
				.setCustomId('addroles-button'),
			new container.Discord.MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Remove All Roles')
				.setEmoji('➖')
				.setCustomId('removeroles-button'),
		]);
		message.channel.send({ embeds: [embed], components: [ButtonRoles1, ButtonRoles2, ButtonRoles3] });
	},
};
