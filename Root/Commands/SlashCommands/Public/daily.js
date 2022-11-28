const userSchema = require('../../../Database/Economy/UserCredit');
const globalSchema = require('../../../Database/Economy/UserCredit');
module.exports = {
	name: 'daily',
	description: 'Get your daily coinixs!',
	usage: ['daily'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		if (!(Date.now() - interaction.user.createdTimestamp > 60 * 1e3 * 60 * 24 * 60)) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(
					`> Daily coinix from new accounts or to new accounts is temporarily disabled!\n> The account must be 2 months old.\n> Account age: <t:${parseInt(
						interaction.user.createdAt / 1000,
					)}:R>`,
				);
			return interaction.reply({ embeds: [embed] });
		}

		const random = Math.floor(Math.random() * 20) + 1;

		const setLabel1 = Math.floor(Math.random() * 15) + 1;
		const setLabel2 = random;
		const setLabel3 = Math.floor(Math.random() * 8) + 1;

		const Button = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton().setLabel(`${setLabel1}`).setStyle('SUCCESS').setCustomId('math1'),
			new container.Discord.MessageButton().setLabel(`${setLabel2}`).setStyle('SUCCESS').setCustomId('math2'),
			new container.Discord.MessageButton().setLabel(`${setLabel3}`).setStyle('SUCCESS').setCustomId('math3'),
		]);

		const EmbedCheck = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.orange)
			.setDescription(`> Please choose this number ${random} in the button below!`);

		interaction.reply({ embeds: [EmbedCheck], components: [Button], fetchReply: true });
		const filter = async (interaction) => {
			if (interaction.user.id !== interaction.user.id) {
				interaction.reply({
					content: "Don't help other people to select the button!",
					ephemeral: true,
				});
				return false;
			}
			return true;
		};
		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			time: 6000,
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'math1') {
				const successEmbed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> Wrong answer!`);
				return interaction.editReply({ embeds: [successEmbed], components: [] });
			} else if (i.customId === 'math2') {
				let userData;
				try {
					userData = await userSchema.findOne({ userID: i.user.id });
					if (!userData) userData = await userSchema.create({ userID: i.user.id });
				} catch (err) {
					console.log(err);
				}

				let globalData;
				try {
					globalData = await globalSchema.findOne({ userID: i.user.id });
					if (!globalData) globalData = await globalSchema.create({ userID: i.user.id });
				} catch (err) {
					console.log(err);
				}

				const author = await userSchema.findOne({ userID: i.user.id });
				const timestamp = author.dailyAt ? Date.now() - author.dailyAt : 86400 * 1000;

				if (timestamp < 86400 * 1000) {
					const waitEmbed = new container.Discord.MessageEmbed()
						.setColor(client.embed.color.red)
						.setDescription(`> Your next daily is ready in: <t:${Math.ceil(author.dailyAt / 1000 + 86400)}:R>`);
					return interaction.editReply({ embeds: [waitEmbed], components: [] });
				}

				author.dailyAt = Date.now();
				var array = [];
				array.push(`${Math.ceil(Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000)}`);
				var arrayOfNumbers = array.map(Number);
				author.wallet += arrayOfNumbers[0];
				await author.save();

				const successEmbed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.green)
					.setDescription(`> <:coinix:963914221513474088> | **${arrayOfNumbers[0]}** has been added to your wallet`);
				return interaction.editReply({ embeds: [successEmbed], components: [] });
			} else if (i.customId === 'math3') {
				const successEmbed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> Wrong answer!`);
				return interaction.editReply({ embeds: [successEmbed], components: [] });
			}
		});

		collector.on('end', async (collected) => {
			if (collected.size === 0) {
				const endEmbed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> You didn't choose the number in time!`);
				return interaction.editReply({ embeds: [endEmbed], components: [] });
			}
		});
	},
};
