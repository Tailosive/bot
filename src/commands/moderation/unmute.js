'use strict'
const { Command } = require('quartz')

class Unmute extends Command {
  constructor (client) {
    super(client, {
      name: 'unmute'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  reason (args) {
    args.shift()
    return args.join(' ')
  }

  async cases (msg, member) {
    let cases = await this.client.cases.get(msg.guild.id)
    if (!cases || cases.length <= 0) return undefined
    cases = cases.filter(c => c.type === 'mute' && c.status === 'active' && c.userID === member.id)
    if (!cases || cases.length <= 0) return undefined
    cases.sort((a, b) => b.caseID - a.caseID)
    return cases[0]
  }

  async run (msg, args) {
    msg.delete('Tailosive Moderation')
    const member = args[0] && this.client.functions.getUserFromMention(args[0]) ? msg.guild.members.get(this.client.functions.getUserFromMention(args[0]).id) : undefined
    const reason = args ? this.reason(args) : undefined
    if (!member) return msg.embed(`${msg.author.mention}, Please give me a member to unmute.`)
    if (!reason) return msg.embed(`${msg.author.mention}, Please give me a reason for the unmute.`)
    const getCase = await this.cases(msg, member)
    if (!getCase) {
      if (!member.roles.includes(this.client.config.roles.mute_role)) return msg.embed(`${msg.author.mention}, This member is not muted.`)
      else await member.addRole(this.client.config.roles.mute_role)
      await this.client.emit('moderationLog', null, 'Member Unmuted', member, msg.author, new Date(), reason || 'No reason was given')
      return msg.embed(`Successfully Unmuted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, { color: 0xE3C053 })
    } else if (getCase.type !== 'mute' || getCase.status === 'inactive') return msg.embed('An error happened while getting case details! Make sure the case is vaild, it is a mute and is active.')
    else {
      console.log(getCase)
      console.log(this.client.config.roles.mute_role)
      const caseMember = await msg.guild.members.get(getCase.userID)
      if (!caseMember) return msg.embed('An error happened while getting member details! Make sure the case is vaild, it is a mute and is active.')
      if (!caseMember.roles.includes(this.client.config.roles.mute_role)) return msg.embed(`${msg.author.mention}, This member is not muted.`)
      else await caseMember.removeRole(this.client.config.roles.mute_role)
      await this.client.cases.edit(msg.guild.id, getCase.caseID, reason || 'No reason given', 'inactive', true)
      await this.client.emit('moderationLog', getCase.caseID, 'Member Unmuted', caseMember, msg.author, new Date(), reason || 'No reason was given')
      return msg.embed(`Successfully Unmuted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, { color: 0xE3C053 })
    }
  }
}
module.exports = Unmute
