const { Event } = require('quartz')
const moment = require('moment')

class GuildMemberAddListener extends Event {
  constructor (client) {
    super(client, {
      name: 'guildMemberAdd'
    })
  }

  async run (guild, member) {
    if (guild.id !== this.client.config.main_guild) return
    const cases = await this.client.cases.get(guild.id)
    if (cases) {
      for (const caseObject of cases) {
        if (caseObject.type === 'mute' && caseObject.userID === member.id && caseObject.status === 'active') await member.addRole(this.client.config.roles.mute_role)
      }
    }

    let inv
    const created = moment(member.user.createdAt).format('lll')
    try {
      await member.guild.getInvites().then(async guildInvites => {
        if (guildInvites) {
          const ei = await this.client.invites[member.guild.id]
          if (ei) {
            this.client.invites[member.guild.id] = guildInvites
            const invite = await guildInvites.find(i => ei.get(i.code).uses < i.uses)
            if (invite) inv = invite
          }
        }
      })
    } catch (e) {
      return undefined
    }
    const embed = this.client.embed()
      .title('**Member Joined**')
      .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, true)
      .field('Account Created', created, true)
      .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .timestamp(new Date())
      .color(0x47ff47)
      .footer(`ID: ${member.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
    if (inv) {
      embed.field('Invite', `\`${inv.code}\` by ${inv.inviter.mention} (\`${inv.inviter.username}#${inv.inviter.discriminator}\`)`)
    }
    return this.client.createMessage(this.client.config.channels.member_channel, { embed: embed })
  }
}

module.exports = GuildMemberAddListener
