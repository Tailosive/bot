const { Event } = require('quartz')

class ModerationLogListener extends Event {
  constructor (client) {
    super(client, {
      name: 'moderationLog'
    })
  }

  run (caseNum, action, member, moderator, date, reason, duration) {
    if (!member || !member.guild || !action || !moderator) return
    if (member.guild.id !== this.client.config.main_guild) return
    const embed = this.client.embed()
      .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, true)
      .field('Moderator', `${moderator.mention} \`${moderator.username}#${moderator.discriminator}\``, true)
      .field('Reason', reason, false)
      .timestamp(date)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    if (caseNum) embed.title(`Case #${caseNum} | **${action}**`)
    else embed.title(`**${action}**`)
    if (duration) embed.field('Duration', duration)
    if (action === 'Member Warned') {
      embed.color(0xFFD230)
    } else if (action === 'Member Muted') {
      embed.color(0xf45f42)
    } else if (action === 'Member Unmuted') {
      embed.color(0x41f4e8)
    } else if (action === 'Member Kicked') {
      embed.color(0xE3C053)
    } else if (action === 'Member Banned') {
      embed.color(0xFF0000)
    } else if (action === 'Member Trusted' || action === 'Member Untrusted') {
      embed.color(0x99ff66)
    }
    return this.client.createMessage(this.client.config.channels.log_channel, { embed: embed })
  }
}

module.exports = ModerationLogListener
