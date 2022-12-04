const Command = require('../../Structures/Command');
const UserSchema = require('../../Database/Schema/User');
const TeamSchema = require('../../Database/Schema/Team');
module.exports = class Create extends Command {
  constructor(client) {
    super(client, {
      name: 'create',
      description: {
        content: 'To create system for the competition.',
      },
      category: 'Public',
      permissions: {
        botPermissions: [
          client.Discord.PermissionsBitField.Flags.EmbedLinks,
          client.Discord.PermissionsBitField.Flags.SendMessages,
        ],
        team: ['685868171755913293', '575790052152573989'],
      },
      slashCommand: true,
      options: [
        {
          name: 'team',
          description: 'To create teams and responsible for them.',
          type: client.Discord.ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'leader',
              description: 'The user responsible for the team.',
              type: client.Discord.ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: 'name',
              description: 'The name of team.',
              type: client.Discord.ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: 'role',
              description: 'The role of team.',
              type: client.Discord.ApplicationCommandOptionType.Role,
              required: true,
            },
            {
              name: 'id',
              description: 'The id of this team (use number only like 1 or 2 or 3).',
              type: client.Discord.ApplicationCommandOptionType.Number,
              required: true,
            },
          ],
        },
        {
          name: 'message',
          description: 'The message to send.',
          type: client.Discord.ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'select',
              description: 'Please select a message',
              type: client.Discord.ApplicationCommandOptionType.String,
              choices: [
                {
                  name: 'submit',
                  value: 'submit',
                },
                {
                  name: 'selection',
                  value: 'selection',
                },
                {
                  name: 'teams',
                  value: 'teams',
                },
              ],
              required: true,
            },
          ],
        },
      ],
    });
  }
  async run(client, ctx) {
    if (!this.permissions.team.includes(ctx.user.id)) {
      return ctx.reply({
        content: 'You are not allowed to use this command.',
        ephemeral: true,
      });
    }
    if (ctx.messageHelper.getSubcommand() === 'team') {
      const LeaderTeam = ctx.messageHelper.getMember('leader');
      const TeamName = ctx.messageHelper.getString('name');
      const TeamId = ctx.messageHelper.getNumber('id');
      const Role = ctx.messageHelper.getRole('role');

      const Fetched = await ctx.guild.members.fetch(LeaderTeam.user.id, {
        force: true,
      });
      const MemberFetched = ctx.guild.members.cache.get(Fetched.id);
      MemberFetched.roles.add(Role);

      const RoleCompetitor = ctx.guild.roles.cache.get('1048360192988950579');
      MemberFetched.roles.add(RoleCompetitor);

      let Team = await TeamSchema.findOne({
        teamId: TeamId,
      });
      if (Team) {
        const Embed = new client.Discord.EmbedBuilder()
          .setDescription(`Please choose another Id.`)
          .setColor(client.config.Color.red);
        return ctx.sendReply({
          embeds: [Embed],
        });
      }
      if (!Team) {
        let Team = new TeamSchema({
          teamId: Number(TeamId),
          teamLeader: LeaderTeam.id,
          teamName: TeamName,
          teamRoleId: Role.id,
        });
        await Team.save().catch((e) => this.client.logger.error(e));
        Team = await TeamSchema.findOne({ teamId: Number(TeamId) });
      }
      const Embed = new client.Discord.EmbedBuilder()
        .setDescription(
          `The team was created.\nTeam Id: **${Number(
            TeamId,
          )}**\nLeader Team: **${LeaderTeam}**\nTeam Name: **${TeamName}**\nTeam Role: <@&${Role.id}>`,
        )
        .setColor(client.config.Color.basicColor);
      ctx.sendReply({
        embeds: [Embed],
      });
    }

    if (ctx.messageHelper.getSubcommand() === 'message') {
      const Select = ctx.messageHelper.getString('select');
      if (Select === 'submit') {
        const Button = new client.Discord.ActionRowBuilder().addComponents(
          new client.Discord.ButtonBuilder()
            .setCustomId('submit-button')
            .setLabel('Submit')
            .setEmoji('<a:Fire:779564144705798164>')
            .setStyle(client.Discord.ButtonStyle.Secondary),
        );

        const Embed = new client.Discord.EmbedBuilder()
          .setTitle('Submit to Competition')
          .setDescription(
            `Welcome to the contest for the **X4U** Server. We would like to thank you for your time, so we can start on the way to join the contest.
    
        **First:** you must know that you will be chosen from Leader Teams when the people are distributed as an advertisement in the <#1047647550997549137> channel, and you will be notified when the selection begins shortly before.
        
        **Secondly:** the prizes will be beautiful and wonderful, and there will be money.
        
        **Thirdly:** it is forbidden to insult or insult, nor use illegal methods to win. Anything contrary to it will be discredited directly without warning, and there will be no warnings, and there will be special rules in the game. You will be informed about them soon in a special channel, and you will be notified.
        
        Now, the moment of enthusiasm, you will notice that there is a button below the message. When you click on it, a questionnaire will appear, please fill it out, and all the data will be stored in the bot data`,
          )
          .setColor(client.config.Color.basicColor);
        ctx.channel.send({ embeds: [Embed], components: [Button] });
        return ctx.sendReply({
          content: `Done send message.`,
          ephemeral: true,
        });
      }

      if (Select === 'selection') {
        const UsersData = await UserSchema.find({ userStatus: false });
        if (UsersData.length == 0) {
          const Embed = new client.Discord.EmbedBuilder()
            .setDescription(`There is no data because all users are now inside Teams.`)
            .setColor(client.config.Color.red);
          return ctx.sendReply({
            embeds: [Embed],
          });
        }

        const Menu = new client.Discord.ActionRowBuilder().addComponents(
          new client.Discord.StringSelectMenuBuilder({
            placeholder: 'Please choose one player only.',
            customId: 'team-setup-player-choose-main',
            maxValues: 1,
          }),
        );
        const Button = new client.Discord.ActionRowBuilder().addComponents(
          new client.Discord.ButtonBuilder()
            .setCustomId('team-setup-player-refresh-main')
            .setLabel('Refresh')
            .setStyle(client.Discord.ButtonStyle.Danger),
        );
        const Embed = new client.Discord.EmbedBuilder()
          .setTitle('Players Selection')
          .setDescription(
            `Welcome to the player selection stage. Now players are being selected by the Team Leader.\n**__Please follow the management notes__**\n**__The members in the menu have also been refreshed__**`,
          )
          .setColor(client.config.Color.basicColor);

        let UsernameFromDatabase = [];
        for (let i = 0; i < UsersData.length; i++) {
          UsernameFromDatabase.push(UsersData[i].userName);
        }

        UsernameFromDatabase.forEach((i) => {
          Menu.components[0].addOptions({
            label: i,
            value: i,
          });
        });

        ctx.channel.send({
          embeds: [Embed],
          components: [Menu, Button],
        });
        return ctx.sendReply({
          content: `Done send message.`,
          ephemeral: true,
        });
      }

      if (Select === 'teams') {
        const TeamData = await TeamSchema.find({ userStatus: true }).sort({ 'Team.teamId': -1 });
        if (TeamData.length == 0) {
          const Embed = new client.Discord.EmbedBuilder()
            .setDescription(`There are currently no teams.`)
            .setColor(client.config.Color.red);
          return ctx.sendReply({
            embeds: [Embed],
          });
        }
        const EmbedTeam = new client.Discord.EmbedBuilder()
          .setTitle('The Teams')
          .setDescription(
            TeamData.map(
              (cmd, i) => `**Team Name:** __${cmd.teamName}__ | **Team Id:** __${cmd.teamId}__\n${cmd.usersData.join('\n')}\n`,
            ).join('\n'),
          )
          .setColor(client.config.Color.basicColor);
        ctx.channel.send({
          embeds: [EmbedTeam],
        });
        return ctx.sendReply({
          content: `Done send message.`,
          ephemeral: true,
        });
      }
    }
  }
};
