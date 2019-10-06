const { Command } = require('quartz')

class Warn extends Command {
  constructor (client) {
    super(client, {
      name: 'warn',
      aliases: ['w']
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
    else if (member.id === msg.member.id && process.env.NODE_ENV === 'production') return msg.embed(`${msg.author.mention}, You can't warn yourself.`)
    else if (member.roles.some(r => r.id === this.client.config.modrole)) return msg.embed(`${msg.author.mention}, Unable to warn a moderator.`)
    else if (member.bot) return msg.embed(`${msg.author.mention}, Can't warn bots... They aren't humans :(`)
    else {
      const submitCase = await this.client.cases.create(msg.guild.id, 'warn', member.id, msg.author.id, reason || 'No reason was given', new Date(), 'active')
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process to warn... Please contact dev man!`)
      const warnEmbed = this.client.embed()
        .title('**Warning**')
        .field('Reason', reason || 'No reason was given')
        .color(0xE3C053)
        .timestamp(new Date())
        .footer(this.client.config.embed.text, this.client.config.embed.icon)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client.createMessage(memberChannel.id, { embed: warnEmbed }).catch(() => {
        return msg.embed(`${msg.author.mention}, I was unable to warn that member.`)
      })
      await this.client.emit('moderationLog', submitCase, 'Member Warned', member, msg.author, new Date(), reason || 'No reason was given')
      return msg.embed(`Successfully Warned: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`, 0xE3C053)
    }
  }
}

module.exports = Warn
