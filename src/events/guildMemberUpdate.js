'use strict'

const { Event } = require('quartz')

class GuildMemberUpdateListener extends Event {
  constructor (client) {
    super(client, {
      name: 'guildMemberUpdate'
    })
  }

  async run (guild, member, oldMember) {
    if (guild.id !== this.client.config.main_guild) return
    if (oldMember.nick !== member.nick) {
      const audit = await this.client.functions.fetchLastAudit(guild, 24)
      if (!audit || audit.actionType !== 24) return
      let reason = 'No reason given'
      let moderator = 'Unknown'
      const target = audit.targetID
      const exec = audit.user
      if (audit.reason) reason = audit.reason
      if (exec.id && exec.id !== member.id) moderator = `<@${exec.id}>`
      if (exec.id === this.client.user.id) return
      if (target !== member.id) return
      const oldNickname = oldMember.nick || oldMember.user.username
      const newNickname = member.nick || member.user.username
      if (!oldNickname || !oldNickname) return
      const embed = this.client.embed()
        .title('**Nickname Changed**')
        .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, false)
        .field('Before', `\`${oldNickname}\``, true)
        .field('After', `\`${newNickname}\``, true)
        .timestamp(new Date())
        .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .color(0xFF00FF)
        .footer(`ID: ${member.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
      if (moderator && moderator !== 'Unknown') embed.field('Moderator', `${moderator}`)
      if (reason && reason !== 'No reason given') embed.field('Reason', reason)
      return this.client.createMessage(this.client.config.channels.nickname_channel, { embed: embed })
    } else if (oldMember.roles.length !== member.roles.length) {
      if (oldMember.roles.length > member.roles.length) {
        const dif = await oldMember.roles.filter(r => !member.roles.includes(r))[0]
        if (!dif) return
        if (this.client.config.roles.donator_roles.includes(dif)) {
          let removeRole = true
          await member.roles.forEach(async role => {
            if (this.client.config.roles.donator_roles.includes(role)) removeRole = false
          })
          if (removeRole) await member.removeRole(this.client.config.roles.donator_role)
        }
      } else if (oldMember.roles.length < member.roles.length) {
        const dif = member.roles.filter(r => !oldMember.roles.includes(r))[0]
        if (!dif) return
        if (this.client.config.roles.donator_roles.includes(dif)) {
          await member.addRole(this.client.config.roles.donator_role)
        }
      }
    }
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = GuildMemberUpdateListener
