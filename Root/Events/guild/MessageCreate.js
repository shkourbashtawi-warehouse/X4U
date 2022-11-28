module.exports = {
	name: 'messageCreate',
	run: async (message, client, container) => {
		const loadCommandOptions = require(`../../Structures/CommandOptions/loadCommandOptions`);
		const AutoReplyScehma = require('../../Database/Other/AutoReply');
		const AutoReactionScehma = require('../../Database/Other/AutoReaction');
		const AFKSchema = require('../../Database/Other/AFK');
		const MaintenanceScehma = require('../../Database/Other/Maintenance');

		// Load the command options
		container.Config.prefix.forEach((prefix) => {
			if (!message.content.toLowerCase().startsWith(prefix)) return;
			const cmdName = message.content.toString().toLowerCase().slice(prefix.length).trim().split(' ')[0];
			const command =
				client.commands.messageCommands.get(cmdName) ??
				client.commands.messageCommands.get(client.commands.messageCommands.aliases.get(cmdName));
			if (!command) return;

			if (command.allowBots) loadCommandOptions(client, message, command, false);
			else if (message.author.bot) return;
			else if (command.guildOnly == false) loadCommandOptions(client, message, command, false);
			else if (!message.guild) return;
			else loadCommandOptions(client, message, command, false);
		});

		// Mention Bot
		const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
		if (message.content.match(mentionRegex)) {
			const proofita = `\`\`\`diff\n-     Prefix: Slash     -\`\`\``;
			const proofitaa = `\`\`\`diff\n-      Help: /help    -\`\`\``;
			const embed = new container.Discord.MessageEmbed()
				.setTitle("Hello, I'm X4U Bot, What's Up?")
				.addField(`Prefix`, proofita, true)
				.addField(`Usage`, proofitaa, true)
				.setFooter({
					text: 'Thank you for using X4U Bot',
					iconURL: client.user.displayAvatarURL({ dynamic: true }),
				})
				.setColor(client.embed.color.onix);
			message.reply({ embeds: [embed] }).catch(() => {});
		}

		if (!message.guild || message.author.bot) return;
		if (client.user.id === message.author.id) return;
		if (message.channel.type !== 'GUILD_TEXT') return;

		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		// Auto Reply
		const Name = message.content.trim().split(/ +/g);

		const AutoReply = await AutoReplyScehma.findOne({ guildID: message.guild.id, CommandA: Name });
		if (AutoReply) {
			if (AutoReply.toggleStatus === true) {
				message.delete();
			}
			if (AutoReply.ResponseB.includes('.png') || AutoReply.ResponseB.includes('.jpg')) {
				const Attachment = new container.Discord.MessageAttachment(AutoReply.ResponseB);
				return message.channel.send({ files: [Attachment] });
			}
			if (message.content === AutoReply.CommandA) {
				return message.channel.send(AutoReply.ResponseB);
			}
		}

		// User Check + AFK Mention Check
		let UserDisableAFK = await AFKSchema.findOne({
			userId: message.author.id,
			guildId: message.guild.id,
		});
		if (UserDisableAFK) {
			await UserDisableAFK.delete();
			const embed = new container.Discord.MessageEmbed()
				.setTitle(`> Welcome ${message.author.username}, I removed your AFK!`)
				.setColor(client.embed.color.green);
			message.reply({ embeds: [embed] }).catch(() => {});
		}
		const mentionedUser = message.mentions.users.first();
		if (mentionedUser) {
			let UserFind = await AFKSchema.findOne({
				userId: mentionedUser.id,
				guildId: message.guild.id,
			});
			if (UserFind) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle(`${mentionedUser.username} is currently AFK Now!`)
					.setDescription(`> Reason: ${UserFind.reason}\n> Since: <t:${Math.round(UserFind.timestamp / 1000)}:R>`)
					.setColor(client.embed.color.onix);
				message.reply({ embeds: [embed] }).catch(() => {});
			}
		}

		// Auto Reaction
		const AutoReaction = await AutoReactionScehma.findOne({ guildID: message.guild.id, channelID: message.channel.id });
		if (AutoReaction) {
			if (AutoReaction.toggleStatus === true) {
				let EmojiIDData = AutoReaction.emojiObject;
				let EmojiIDSplit = EmojiIDData.split(':')[2].split('>')[0];
				const Emoji = message.guild.emojis.cache.find((emoji) => emoji.id === EmojiIDSplit);
				if (Emoji) {
					message.react(Emoji).catch(() => {});
				} else {
					return;
				}
			} else {
				return;
			}
		}
	},
};
