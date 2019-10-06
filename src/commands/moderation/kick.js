'use strict'

const { Command } = require('quartz')

class Kick extends Command {
  constructor (client) {
    super(client, {
      name: 'kick'
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
    else if (member.id === msg.member.id) return msg.embed(`${msg.author.mention}, You can't kick yourself.`)
    else if (member.roles.includes(this.client.config.mod_role)) return msg.embed(`${msg.author.mention}, Unable to kick a moderator.`)
    else {
      const submitCase = await this.client.cases.create(msg.guild.id, 'kick', member.id, msg.author.id, reason || 'No reason was given', new Date(), 'active')
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process the kick... Please contact dev man!`)
      const kickEmbed = this.client.embed()
        .title('**Kicked**')
        .field('Reason', reason || 'No reason was given')
        .color(0xE3C053)
        .timestamp(new Date())
        .footer(this.client.config.embed.text, this.client.config.embed.icon)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client.createMessage(memberChannel.id, { embed: kickEmbed }).catch(() => {
        return msg.embed(`${msg.author.mention}, I was unable to warn that member.`)
      })
      if (reason !== 'DEV_TEST') await member.kick(`Moderator: ${msg.author.username}#${msg.author.discriminator} | Reason: ${reason || 'No reason was given'}`)
      await this.client.emit('moderationLog', submitCase, 'Member Kicked', member, msg.author, new Date(), reason || 'No reason was given')
      return msg.embed(`Successfully Kicked: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, { color: 0xE3C053 })
    }
  }
}

module.exports = Kick
