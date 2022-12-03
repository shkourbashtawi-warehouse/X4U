const Button = require('../../../Structures/Button');
const UserSchema = require('../../../Database/Schema/User');
const TeamSchema = require('../../../Database/Schema/Team');
module.exports = class SubmitDataButton extends Button {
  constructor(client) {
    super(client, {
      id: 'submit-data-button',
    });
  }
  async run(client, interaction) {
    const Message = interaction.message.content;
    const UserId = Message.substring(2).substring(0, Message.length - 3);
    const UserFetch = interaction.guild.members.cache.get(UserId);
    let User = await UserSchema.findOne({
      userId: UserId,
    });

    if (!User) {
      const newUser = new UserSchema({
        userId: UserId,
        userName: UserFetch.user.username,
      });
      await newUser.save().catch((e) => this.client.logger.error(e));
      User = await UserSchema.findOne({ userId: UserId });
    }

    let Team = await TeamSchema.findOne({
      teamId: User?.teamId,
    });
    const TeamMember = Team?.usersData.map((cmd, i) => `${cmd.join('\n')}`).join('\n');
    const Embed = new client.Discord.EmbedBuilder()
      .setTitle('User Data')
      .addFields(
        {
          name: `Team Name:`,
          value: `${Team?.teamName ?? 'So far no team has entered'}`,
          inline: true,
        },
        {
          name: `Team Id:`,
          value: `${User?.teamId ?? 'So far no team has entered'}`,
          inline: true,
        },
        {
          name: `Team Members:`,
          value: `${TeamMember ?? 'So far no team has entered'}`,
          inline: false,
        },
      )
      .setColor(client.config.Color.basicColor);
    return interaction.reply({ embeds: [Embed], ephemeral: true });
  }
};
