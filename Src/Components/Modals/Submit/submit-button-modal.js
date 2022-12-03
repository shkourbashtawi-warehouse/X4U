const Modal = require('../../../Structures/Modal');
const UserSchema = require('../../../Database/Schema/User');
module.exports = class SubmitButtonModal extends Modal {
  constructor(client) {
    super(client, {
      id: 'submit-button-modal',
    });
  }
  async run(client, interaction) {
    const MainRoles = interaction.fields.getTextInputValue('submit-button-mainroles-modal');
    const RiotId = interaction.fields.getTextInputValue('submit-button-riotid-modal');
    const Channel = await interaction.guild.channels.cache.get('1047650167144329316');

    let User = await UserSchema.findOne({
      userId: interaction.user.id,
    });
    if (!User) {
      const newUser = new UserSchema({
        userId: interaction.user.id,
        userName: interaction.user.username,
      });
      await newUser.save().catch((e) => this.client.logger.error(e));
      User = await UserSchema.findOne({ userId: interaction.user.id });
    } 
    
    const Role = interaction.guild.roles.cache.get('1048360192988950579');
    interaction.member.roles.add(Role)

    const Button0 = new client.Discord.ActionRowBuilder().addComponents(
      new client.Discord.ButtonBuilder()
        .setCustomId('submit-data-button')
        .setLabel('Data User')
        .setStyle(client.Discord.ButtonStyle.Secondary),
    );
    const Embed0 = new client.Discord.EmbedBuilder()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ forceStatic: true }),
        url: interaction.user.displayAvatarURL({ forceStatic: true }),
      })
      .addFields(
        {
          name: `MainRoles`,
          value: `${MainRoles}`,
          inline: false,
        },
        {
          name: `RiotId`,
          value: `${RiotId}`,
          inline: false,
        },
      )
      .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: true }))
      .setColor(client.config.Color.basicColor);
    Channel.send({ content: `${interaction.user}`, embeds: [Embed0], components: [Button0] });

    const Embed = new client.Discord.EmbedBuilder()
      .setDescription(
        `Thank you for submitting to the competition. A role <@&1048360192988950579> has been given to you to be notified when the competition starts and also keep you informed`,
      )
      .setColor(client.config.Color.basicColor);
     return interaction.reply({ embeds: [Embed], ephemeral: true });
  }
};
