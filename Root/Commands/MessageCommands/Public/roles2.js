module.exports = {
	name: 'roles2',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		let embed = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'Roles Notification - الرولات الاشعارات ',
				iconURL: message.guild.iconURL({ dynamic: true }),
			})
			.setDescription(
				`
			> **__Choose Your Notification And take Its Role : __**
			
            🔔   : News Server Notification
 
            🛒   : Free Games Notification
           
            🎙️   : Streaming Notification
           
            🌙   : Questions After Midnight Notification
           
            🎩   : Games Sources Notification

            😂   : Memes Notification

            <:a7a:786284673575551006>   : Highlights Notification
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
			new container.Discord.MessageButton().setStyle('DANGER').setEmoji('🔔').setCustomId('news-button'),
			new container.Discord.MessageButton().setStyle('DANGER').setEmoji('🛒').setCustomId('freegame-button'),
			new container.Discord.MessageButton().setStyle('DANGER').setEmoji('🎙️').setCustomId('streaming-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('🌙')
				.setCustomId('questionssftermidnight-button'),
		]);
		let ButtonRoles2 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton().setStyle('DANGER').setEmoji('🎩').setCustomId('gamessources-button'),
			new container.Discord.MessageButton().setStyle('DANGER').setEmoji('😂').setCustomId('funny-button'),
			new container.Discord.MessageButton()
				.setStyle('DANGER')
				.setEmoji('<:a7a:786284673575551006>')
				.setCustomId('highlights-button'),
		]);
		let ButtonRoles3 = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Get All Roles')
				.setEmoji('➕')
				.setCustomId('addroles2-button'),
			new container.Discord.MessageButton()
				.setStyle('PRIMARY')
				.setLabel('Remove All Roles')
				.setEmoji('➖')
				.setCustomId('removeroles2-button'),
		]);
		message.channel.send({ embeds: [embed], components: [ButtonRoles1, ButtonRoles2, ButtonRoles3] });
	},
};
