const config = require('../../Storage/Vault/Config');
module.exports = async function (message, command, Discord) {
	if (!command.ownerOnly) return false;
	if (config.developers.some((id) => message.member.user.id == id)) return false;
	else {
		if (command.returnOwnerOnly == false || command.returnNoErrors) return true;
		else
			message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setAuthor({
							name: message.member.user.tag,
							iconURL: message.member.user.displayAvatarURL({ dynamic: true }),
							url: message.member.user.displayAvatarURL({ dynamic: true }),
						})
						.setColor('#FF0000')
						.setTimestamp()
						.setDescription(`This command is reserved for the developers of the bot.`),
				],
				allowedMentions: {
					repliedUser: false,
				},
			});
		return true;
	}
};
