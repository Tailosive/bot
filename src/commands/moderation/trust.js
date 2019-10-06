'use strict'

const { Command } = require('quartz')

class Trust extends Command {
  constructor (client) {
    super(client, {
      name: 'trust'
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
    if (!member) return msg.embed(`${msg.author.mention}, Please give me a member to trust.`)
    else if (member.id === msg.member.id) return msg.embed(`${msg.author.mention}, You can't trust yourself.`)
    else if (member.roles.length > 0 && member.roles.includes(this.client.config.roles.mod_role)) return msg.embed(`${msg.author.mention}, Unable to trust a moderator.`)
    else {
      if (member.roles.length > 0 && member.roles.includes(this.client.config.roles.trusted_role)) {
        await member.removeRole(this.client.config.roles.trusted_role)
        await this.client.emit('moderationLog', null, 'Member Untrusted', member, msg.author, new Date(), reason || 'No reason was given')
      } else {
        await member.addRole(this.client.config.roles.trusted_role)
        await this.client.emit('moderationLog', null, 'Member Trusted', member, msg.author, new Date(), reason || 'No reason was given')
      }
      return msg.embed(`Successfully Updated Trust: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, 0xE3C053)
    }
  }
}

module.exports = Trust
