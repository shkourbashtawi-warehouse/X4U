module.exports = async function (client, message, command, isInteraction, interactionType, Discord) {
	const prettyMilliseconds = require('pretty-ms');
	const cooldownSchema = require('../../Database/Other/CooldownCommands');
	if (!command.cooldown) return false;

	let cooldown;
	try {
		cooldown = await cooldownSchema.findOne({
			userID: message.member.user.id,
			commandName: command.name,
		});
		if (!cooldown) {
			cooldown = await cooldownSchema.create({
				userID: message.member.user.id,
				commandName: command.name,
				cooldown: 0,
			});
			cooldown.save();
		}
	} catch (e) {
		console.error(e);
	}

	if (command.returnCooldown == false || command.returnNoErrors) return true;

	if (cooldown && command.cooldown * 1000 - (Date.now() - cooldown.cooldown) <= 0) {
		await cooldownSchema.findOneAndUpdate(
			{
				userID: message.member.user.id,
				commandName: command.name,
			},
			{
				cooldown: Date.now(),
			},
		);
		return false;
	}

	if (!cooldown || command.cooldown * 1000 - (Date.now() - cooldown.cooldown) > 0) {
		let timecommand = prettyMilliseconds(command.cooldown * 1000, { verbose: true, verbose: true });
		const timeleft = prettyMilliseconds(command.cooldown * 1000 - (Date.now() - cooldown.cooldown), { verbose: true });

		let cooldownEmbed = new Discord.MessageEmbed()
			.setTitle(`Slow Down`)
			.setDescription(
				`> <:point:938144204629082172> You can use this command every **${timecommand}**!\n> <:point:938144204629082172> Try again in: **${timeleft}**`,
			)
			.setColor(client.embed.color.red);

		message.reply({
			embeds: [cooldownEmbed],
			ephemeral: true,
			allowedMentions: {
				repliedUser: false,
			},
		});

		return true;
	}
};
