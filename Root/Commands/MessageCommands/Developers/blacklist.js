const BlacklistScehma = require('../../../Database/Other/Blacklist.js');
module.exports = {
	name: 'blacklist',
	category: 'Developers',
	onlyUsers: ['685868171755913293', '913497938129469461', '760285856811974656', '787956837403197510'],
	returnOnlyUsers: false,
	run: async (client, message, args, container) => {
		if (
			message.author.id === '685868171755913293' ||
			message.author.id === '913497938129469461' ||
			message.author.id === '760285856811974656' ||
			message.author.id === '787956837403197510'
		) {
			if (!args[0]) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(
						`> Provide me with a user or guildId.\n\n> .blacklist user [ID user/Mention user] ➜ .blacklist user 685868171755913293\n> .blacklist server [ID Guild] ➜ .blacklist guild 937377447589072906`,
					)
					.setColor(client.embed.color.red);
				return message.reply({ embeds: [embed] });
			}

			if (args[0] === 'user') {
				const member = args[1];
				if (!member) {
					const embed = new container.Discord.MessageEmbed()
						.setDescription(
							`> Provide me with a user or can't find him.\n\n> .blacklist user [ID user/Mention user] ➜ .blacklist user 685868171755913293`,
						)
						.setColor(client.embed.color.red);
					return message.reply({ embeds: [embed] });
				}
				const Blacklist = await BlacklistScehma.findOne({ userID: member });
				if (!Blacklist) {
					const newBlacklist = new BlacklistScehma({
						userID: member,
						type: 'user',
					});
					newBlacklist.save();
					const embed3 = new container.Discord.MessageEmbed()
						.setDescription(`> User <@${member}> has been added to the blacklist!`)
						.setColor(client.embed.color.onix);
					return message.reply({ embeds: [embed3] });
				} else if (Blacklist) {
					await BlacklistScehma.findOneAndDelete({ userID: member });
					const embed4 = new container.Discord.MessageEmbed()
						.setDescription(`> User <@${member}> removed from blacklist!`)
						.setColor(client.embed.color.onix);
					return message.reply({ embeds: [embed4] });
				}
			}

			if (args[0] === 'server' || args[0] === 'guild') {
				const guild = args[1];
				if (!guild) {
					const embed = new container.Discord.MessageEmbed()
						.setDescription(
							`>  I can't find the guild.\n\n> \n> .blacklist server [ID Guild] ➜ .blacklist guild 937377447589072906`,
						)
						.setColor(client.embed.color.red);
					return message.reply({ embeds: [embed] });
				}
				const Blacklist = await BlacklistScehma.findOne({ guildID: guild });
				if (!Blacklist) {
					const newBlacklist = new BlacklistScehma({
						guildID: guild,
						type: 'guild',
					});
					newBlacklist.save();
					const embed5 = new container.Discord.MessageEmbed()
						.setDescription(`> Server ${guild} added to the blacklist!`)
						.setColor(client.embed.color.onix);
					return message.reply({ embeds: [embed5] });
				} else if (Blacklist) {
					await BlacklistScehma.findOneAndDelete({ guildID: guild });
					const embed6 = new container.Discord.MessageEmbed()
						.setDescription(`> Server ${guild} removed from blacklist!`)
						.setColor(client.embed.color.onix);
					return message.reply({ embeds: [embed6] });
				}
			}
		}
	},
};
