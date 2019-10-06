'use strict'

const { Command } = require('quartz')
const ms = require('ms')
const moment = require('moment')

class Mute extends Command {
  constructor (client) {
    super(client, {
      name: 'mute'
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
    const durationString = args[1]
    const duration = args[1] ? this.duration(args[1]) : undefined
    if (!member) return msg.embed(`${msg.author}, Please give me a member to mute.`)
    if (duration) args.shift()
    const reason = args ? this.reason(args) : undefined
    if (!reason) return msg.embed(`${msg.author}, Please give me a reason for the mute.`)
    else if (member.id === msg.member.id && process.env.NODE_ENV === 'production') return msg.embed(`${msg.author.mention}, You can't mute yourself.`)
    else if (member.roles.length > 0 && member.roles.includes(this.client.config.roles.mod_role)) return msg.embed(`${msg.author.mention}, Unable to mute a moderator.`)
    else if (member.bot) return msg.embed(`${msg.author.mention}, Can't mute bots... They aren't humans :(`)
    else {
      const submitCase = await this.client.cases.create(msg.guild.id, 'mute', member.id, msg.author.id, reason || 'No reason was given', new Date(), 'active', duration)
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process the mute... Please contact dev man!`)
      if (member.roles.length > 0 && member.roles.includes(this.client.config.roles.mute_role)) return msg.embed(`${msg.author.mention}, This member is already muted.`)
      else await member.addRole(this.client.config.roles.mute_role)
      let displayMute
      if (duration) {
        displayMute = moment.duration(ms(durationString)).asMinutes()
        if (displayMute > 60) {
          displayMute = moment.duration(ms(durationString)).asHours()
          displayMute = `${displayMute} hours`
        }
        if (displayMute < 1) {
          displayMute = moment.duration(ms(durationString)).asSeconds()
          displayMute = `${displayMute} sec`
        } else {
          displayMute = `${displayMute} min`
        }
      }
      await this.client.emit('moderationLog', submitCase, 'Member Muted', member, msg.author, new Date(), reason || 'No reason was given', displayMute)
      if (duration) await this.client.functions.mute(duration, msg.guild.id, submitCase, member.id)
      return msg.embed(`Successfully Muted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, { color: 0xE3C053 })
    }
  }
}

module.exports = Mute
