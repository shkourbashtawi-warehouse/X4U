const { stripIndent } = require('common-tags');
const { mem, cpu, os, drive } = require('node-os-utils');
module.exports = {
	name: 'bot',
	description: 'inforomation about the bot',
	usage: ['bot'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		const embed = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.orange)
			.setDescription(`I'm collecting info about myself, Please wait...`);
		await interaction.reply({ embeds: [embed], fetchReply: true });

		const tech = stripIndent`
Vesrion -- X4U Bot v6.0.0
Library -- Discord.js v13.6.0
Environment -- Node.js v17.3.0
SlashCommands -- ${client.commands.slashCommands.size}
      `;
		let rss = process.memoryUsage().rss;
		if (rss instanceof Array) {
			rss = rss.reduce((sum, val) => sum + val, 0);
		}
		let heapUsed = process.memoryUsage().heapUsed;
		if (heapUsed instanceof Array) {
			heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
		}

		let { totalMemMb } = await mem.info();
		//${await os.oos()}
		let serverStats = stripIndent`
      OS -- Ubuntu 18.04
      CPU -- ${cpu.model()}
      Cores -- ${await cpu.count()}
      CPU Usage -- ${await cpu.usage()} %
      RAM -- ${totalMemMb} MB
      RAM Usage -- ${(heapUsed / 1024 / 1024).toFixed(2)} MB 
    `;

		let Button = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton()
				.setLabel('Support Server')
				.setStyle('LINK')
				.setURL('https://discord.gg/7V9cgntvak')
				.setEmoji('<:link:938144203211427880>'),
			new container.Discord.MessageButton()
				.setURL(
					'https://discord.com/api/oauth2/authorize?client_id=931455955013599273&permissions=8&scope=bot%20applications.commands',
				)
				.setLabel(`Invite Me`)
				.setStyle('LINK')
				.setEmoji('<:add:938144199117774858>'),
			new container.Discord.MessageButton()
				.setLabel(`TOP.GG`)
				.setStyle(`LINK`)
				.setURL(`https://top.gg/bot/931455955013599273`)
				.setEmoji('<:topgg:954225060380569640>'),
		]);

		let embed1 = new container.Discord.MessageEmbed();
		embed1.setAuthor({
			name: 'Onix Information',
			iconURL: client.user.displayAvatarURL({ dynamic: true }),
			url: client.user.displayAvatarURL({ dynamic: true }),
		});
		embed1.addField(
			`<:peep:957216574568271943> Developer`,
			`<@685868171755913293> [[Github](https://github.com/AhmadShkour71)]`,
		);
		embed1.addField(
			`<:members:957206414852521984> User Count`,
			`\`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} Members\``,
			true,
		);
		embed1.addField(`<:hash:938144201907011674> Channel Count`, `\`${client.channels.cache.size} Channels\``, true);
		embed1.addField(`<:note:963914219852558386> Bot Statistics`, `\`\`\`fix\n${tech}\`\`\``, true);
		if (interaction.user.id === container.Config.developers[0]) {
			embed1.addField(`<:note:963914219852558386> Host Information`, `\`\`\`yaml\n${serverStats}\`\`\``);
		}
		embed1.setFooter({
			text: `Shard #${interaction.guild.shardId + 1}`,
		});
		embed1.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

		embed1.setTimestamp();
		embed1.setColor(client.embed.color.onix);
		return interaction.editReply({ embeds: [embed1], components: [Button] });
	},
};
