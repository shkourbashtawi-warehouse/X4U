module.exports = {
	customEvent: true,
	run: async (client) => {
		const LineChannelSchema = require('../../Database/Settings/Line/LineChannel');
		const LineURLSchema = require('../../Database/Settings/Line/LineURL');
		const SugestionSchema = require('../../Database/Other/Sugestion');
		const container = require('../../../bot');
		const { MessageEmbed } = require('discord.js');
		const Discord = require('discord.js');

		const wait = require('util').promisify(setTimeout);
		//• ───────────────── ● ───────────────── Auto Area• ───────────────── ● ───────────────── •
		client.on('messageCreate', async (message) => {
			if (!message.guild || message.author.bot) return;
			//Only to send LINE
			let LineChannel = await LineChannelSchema.findOne({
				guildID: message.guildId,
				channelID: message.channel.id,
			});
			if (LineChannel) {
				if (!message.guild || message.author.bot) return;
				if (client.user.id === message.author.id) return;

				const LineURL = await LineURLSchema.findOne({
					guildID: message.guildId,
				});
				if (!LineURL) {
					const embed = new MessageEmbed()
						.setColor(client.embed.color.red)
						.setDescription(`Please set LineURL via \`/setup-autoline url\``);
					return message.channel
						.send({
							embeds: [embed],
						})
						.then((msg) => {
							setTimeout(() => {
								msg.delete();
							}, 3 * 1000);
						});
				}
				return message.channel.send({
					files: [`${LineURL.lineURL}`],
				});
			}
		});

		client.on('messageCreate', async (message) => {
			//sugestion in client channel
			if (!message.guild || message.author.bot) return;
			SugestionSchema.findOne({
				guildID: message.guildId,
			})
				.then(async (doc) => {
					if (!doc) {
						return;
					} else {
						if (doc.channelID === message.channel.id) {
							let args = message.content.split(' ').slice('').join(' ');
							if (message.content.startsWith('')) {
								setTimeout(() => {
									message.delete();
								}, 100);
								const embed = new MessageEmbed().setDescription('Processing...');
								let msgsend = await client.channels.cache.get(doc.channelID);
								let msgEmbed = await client.channels.cache.get(doc.channelID).send({ embeds: [embed] });
								const rEmbed = new MessageEmbed()
									.setAuthor({
										name: message.author.username,
										iconURL: message.author.displayAvatarURL({ dynamic: true }),
										url: message.author.displayAvatarURL({ dynamic: true }),
									})
									.addFields(
										{
											name: '**__Suggestion__**',
											value: `${args}`,
										},
										{
											name: `**__Status__**`,
											value: `📊 Waiting for action from Mods , Please vote!`,
										},
									)
									.setThumbnail(message.guild.iconURL({ dynamic: true }))
									.setColor('#25282b')
									.setFooter({
										text: `ID: (${msgEmbed.id}) - Want to suggest? write in this channel`,
									})
									.setTimestamp();
								await msgEmbed
									.edit({
										embeds: [rEmbed],
									})
									.then(async (msg) => {
										await msg.react('<:like:938144200745181194>');
										await msg.react('<:dislike:938144205245648947>');
									})
									.then(async () => {
										return msgsend.send({
											files: [`https://i.imgur.com/sSgkjUS.png`],
										});
									});
							}
						}
					}
				})
				.catch(() => {});
		});

		client.on('messageCreate', async (message) => {
			// 🎵︰𝐑𝐨𝐨𝐦-𝐌𝐮𝐬𝐢𝐜
			
			if (message.guild.id != container.config.GuildID) return;
			let channeMusic = '899043237422039122';
			if (message.channel != channeMusic) return;
			setTimeout(() => {
				message.delete();
			}, 180000);
		});

		client.on('messageCreate', async (message) => {
			// 🎤︰𝐑𝐨𝐨𝐦-𝐀𝐧𝐝-𝐌𝐢𝐜
			
			if (message.guild.id != container.config.GuildID) return;
			let channeMIC = '799706724261036092';
			if (message.channel != channeMIC) return;
			setTimeout(() => {
				message.delete();
			}, 180000);
		});

		client.on('messageCreate', async (message) => {
			//LINES
		
			if (message.guild.id != container.config.GuildID) return;
			if (message.content.startsWith('خط') || message.content.startsWith('line')) {
				message.delete();
				if (!message.member.roles.cache.get('889087145061515265')) return;
				message.channel.send({ files: ['https://i.imgur.com/QW9cv5M.gif'] });
			}
		});

		client.on('messageCreate', async (message) => {
			//😂︰mems
			
			if (message.guild.id != container.config.GuildID) return;
			if (message.channel.id != '799487195907620874') return;
			if (message.author.id === client.user.id) return;

			if (!message.content.includes('https://') && !message.attachments.size > 0) message.delete().catch(() => {});

			if (message.attachments.size > 0) {
				if (message.author.send) {
					message.react('<a:trollparrot:779559060953104395>');
					message.react('<:brua:791705332967669771>');
					message.react('<a:pepeRain:779556343014359060>');
					message.react('<a:loveeee:784945903986278410>');
					message.react('<:like:779564146328076308>');
				}
				message.channel.threads
					.create({
						name: 'Meme - ' + message.author.username,
						reason: 'Chat For Memes',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						let embed = new MessageEmbed()
							.setColor(client.embed.color.noembed)
							.setDescription(
								`Welcome to the chat for Memes, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
							);
						Thread.send({ embeds: [embed] });
						Thread.send({ files: [`${message.attachments.first().url}`] });
					});
				return;
			}

			if (!message.content.includes('https://')) message.delete().catch(() => {});
			if (message.content.includes('https://')) {
				if (message.author.send) {
					message.react('<a:trollparrot:779559060953104395>');
					message.react('<:brua:791705332967669771>');
					message.react('<a:pepeRain:779556343014359060>');
					message.react('<a:loveeee:784945903986278410>');
					message.react('<:like:779564146328076308>');
				}
				message.channel.threads
					.create({
						name: 'Meme - ' + message.author.username,
						reason: 'Chat For Memes',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						const Photo = message.content.match(/\.(gif|jpg|jpeg|tiff|png|webm)$/);
						if (!Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for Memes, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							Thread.send({ content: `${message.content || "I`am can't upload this photo"}` });
							return;
						}
						if (Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for Memes, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							const attachments = new Discord.MessageAttachment(Photo.input);
							Thread.send({ files: [attachments] });
							return;
						}
					});
				return;
			}
		});

		client.on('messageCreate', async (message) => {
			//💥︰highlights
			
			if (message.guild.id != container.config.GuildID) return;
			if (message.channel.id != '864555281232691211') return;
			if (message.author.id === client.user.id) return;
			if (!message.content.includes('https://') && !message.attachments.size > 0) message.delete().catch(() => {});

			if (message.attachments.size > 0) {
				if (message.author.send) {
					message.react('<:fa5r:779564145435475968>');
					message.react('<:what:902670113449316423>');
					message.react('<:a7a:786284673575551006>');
				}
				message.channel.threads
					.create({
						name: 'Highlight - ' + message.author.username,
						reason: 'Chat For Highlight',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						let embed = new MessageEmbed()
							.setColor(client.embed.color.noembed)
							.setDescription(
								`Welcome to the chat for Highlights, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
							);
						Thread.send({ embeds: [embed] });
						Thread.send({ files: [`${message.attachments.first().url}`] });
					});
				return;
			}

			if (!message.content.includes('https://')) message.delete().catch(() => {});
			if (message.content.includes('https://')) {
				if (message.author.send) {
					message.react('<:fa5r:779564145435475968>');
					message.react('<:what:902670113449316423>');
					message.react('<:a7a:786284673575551006>');
				}
				message.channel.threads
					.create({
						name: 'Highlight - ' + message.author.username,
						reason: 'Chat For Highlight',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						const Photo = message.content.match(/\.(gif|jpg|jpeg|tiff|png|mp4)$/);
						if (!Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for Highlights, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							Thread.send({ content: `${message.content || "I`am can't upload this photo"}` });
							return;
						}
						if (Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for Highlights, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							const attachments = new Discord.MessageAttachment(Photo.input);
							Thread.send({ files: [attachments] });
							return;
						}
					});
				return;
			}
		});

		client.on('messageCreate', async (message) => {
			//📰︰news
			
			if (message.guild.id != container.config.GuildID) return;
			if (message.channel.id != '948526139754811412') return;
			if (message.author.id === client.user.id) return;
			if (!message.content.includes('https://') && !message.attachments.size > 0) message.delete().catch(() => {});

			if (message.attachments.size > 0) {
				if (message.author.send) {
					message.react('<a:trollparrot:779559060953104395>');
					message.react('<:brua:791705332967669771>');
					message.react('<a:pepeRain:779556343014359060>');
					message.react('<a:loveeee:784945903986278410>');
					message.react('<:like:779564146328076308>');
				}
				message.channel.threads
					.create({
						name: 'News - ' + message.author.username,
						reason: 'Chat For News',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						let embed = new MessageEmbed()
							.setColor(client.embed.color.noembed)
							.setDescription(
								`Welcome to the chat for News, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
							);
						Thread.send({ embeds: [embed] });
						Thread.send({ files: [`${message.attachments.first().url}`] });
					});
				return;
			}

			if (!message.content.includes('https://')) message.delete().catch(() => {});
			if (message.content.includes('https://')) {
				if (message.author.send) {
					message.react('<a:trollparrot:779559060953104395>');
					message.react('<:brua:791705332967669771>');
					message.react('<a:pepeRain:779556343014359060>');
					message.react('<a:loveeee:784945903986278410>');
					message.react('<:like:779564146328076308>');
				}
				message.channel.threads
					.create({
						name: 'News - ' + message.author.username,
						reason: 'Chat For News',
						type: 'GUILD_PUBLIC_THREAD',
						autoArchiveDuration: 'MAX',
					})
					.then((Thread) => {
						const Photo = message.content.match(/\.(gif|jpg|jpeg|tiff|png|mp4)$/);
						if (!Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for News, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							Thread.send({ content: `${message.content || "I`am can't upload this photo"}` });
							return;
						}
						if (Photo) {
							let embed = new MessageEmbed()
								.setColor(client.embed.color.noembed)
								.setDescription(
									`Welcome to the chat for News, Please chat here.\nThe meme has been posted by **__${message.author.username}__**`,
								);
							Thread.send({ embeds: [embed] });
							const attachments = new Discord.MessageAttachment(Photo.input);
							Thread.send({ files: [attachments] });
							return;
						}
					});
				return;
			}
		});
	},
};
