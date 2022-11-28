module.exports = async function (message, command, Discord) {
	if (!command.userPermissions) return false;
	let missing = [];
	command.userPermissions.forEach((i) => {
		if (!message.member.permissions.has(i)) missing.push(i);
	});
	if (missing.length == 0) return false;
	else {
		if (command.returnUserPermissions == false || command.returnNoErrors) return true;
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
						.setDescription(
							`You are required to have these permissions to be able to run this command.\n•${missing.join('\n•')}`,
						),
				],
				allowedMentions: {
					repliedUser: false,
				},
				ephemeral: true,
			});
		return true;
	}
};
