'use strict'

const { Command } = require('quartz')
const ms = require('ms')
const moment = require('moment')

class Ban extends Command {
  constructor (client) {
    super(client, {
      name: 'ban'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  reason (args) {
    args.shift()
    return args.join(' ')
  }

  duration (string) {
    if (!string) return undefined
    const rawduration = ms(string)
    if (rawduration && rawduration >= 300000 && !isNaN(rawduration)) return new Date(Date.now() + rawduration)
    else return undefined
  }

  async run (msg, args) {
    msg.delete('Tailosive Moderation')
    const member = args[0] && this.client.functions.getUserFromMention(args[0]) ? msg.guild.members.get(this.client.functions.getUserFromMention(args[0]).id) : undefined
    if (!member) return msg.embed(`${msg.author.mention}, Please give me a member to ban.`)
    const durationString = args[1]
    const duration = args[1] ? this.duration(args[1]) : undefined
    if (duration) args.shift()
    const reason = args ? this.reason(args) : undefined
    if (!reason) return msg.embed(`${msg.author.mention}, Please give me a reason for the ban.`)
    else if (member.id === msg.member.id) return msg.embed(`${msg.author}, You can't ban yourself.`)
    else if (member.roles.includes(this.client.config.mod_role)) return msg.embed(`${msg.author.mention}, Unable to ban a moderator.`)
    else {
      const submitCase = await this.client.cases.create(msg.guild.id, 'ban', member.id, msg.author.id, reason || 'No reason was given', new Date(), 'active', duration)
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process the ban... Please contact dev man!`)
      if (reason !== 'DEV_TEST') await member.ban(0, `Moderator: ${msg.author.username}#${msg.author.discriminator} | Reason: ${reason || 'No reason was given'}`)
      let displayBan
      if (duration) {
        displayBan = moment.duration(ms(durationString)).asMinutes()
        if (displayBan > 60) {
          displayBan = moment.duration(ms(durationString)).asHours()
          displayBan = `${displayBan} hours`
        }
        if (displayBan < 1) {
          displayBan = moment.duration(ms(durationString)).asSeconds()
          displayBan = `${displayBan} sec`
        } else displayBan = `${displayBan} min`
      }
      await this.client.emit('moderationLog', submitCase, 'Member Banned', member, msg.author, new Date(), reason || 'No reason was given', displayBan)
      if (duration) await this.client.functions.ban(duration, msg.guild.id, submitCase, member.id)
      return msg.embed(`Successfully Banned: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, 0xDB411B)
    }
  }
}

module.exports = Ban
