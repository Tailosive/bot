'use strict'

const { Command } = require('quartz')

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

  async run (msg, args) {
    msg.delete('Tailosive Moderation')
    const member = args[0] && this.client.functions.getUserFromMention(args[0]) ? msg.guild.members.get(this.client.functions.getUserFromMention(args[0]).id) : undefined
    const reason = args ? this.reason(args) : undefined
    if (!member) return msg.embed(`${msg.author.mention}, Please give me a member to warn.`)
    if (!reason) return msg.embed(`${msg.author.mention}, Please give me a reason for the warning.`)
    else if (member.id === msg.member.id) return msg.embed(`${msg.author}, You can't ban yourself.`)
    else if (member.roles.includes(this.client.config.mod_role)) return msg.embed(`${msg.author.mention}, Unable to ban a moderator.`)
    else {
      const submitCase = await this.client.cases.create(msg.guild.id, 'ban', member.id, msg.author.id, reason || 'No reason was given', new Date(), 'active')
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process the ban... Please contact dev man!`)
      if (reason !== 'DEV_TEST') await member.ban(`Moderator: ${msg.author.username}#${msg.author.discriminator} | Reason: ${reason || 'No reason was given'}`)
      await this.client.emit('moderationLog', submitCase, 'Member Banned', member, msg.author, new Date(), reason || 'No reason was given')
      return msg.embed(`Successfully Banned: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, 0xDB411B)
    }
  }
}

module.exports = Ban
