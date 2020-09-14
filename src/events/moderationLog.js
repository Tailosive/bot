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
      .field('Member', `${member.user ? member.user.mention : 'Unknown'} \`${member.user ? member.user.username : 'Unknown'}#${member.user ? member.user.discriminator : '0000'}\``, true)
      .field('Moderator', `${moderator.mention} \`${moderator.username}#${moderator.discriminator}\``, true)
      .field('Reason', reason, false)
      .timestamp(date)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    const publicEmbed = this.client.embed()
      .field('Member', `${member.user ? member.user.mention : 'Unknown'} \`${member.user ? member.user.username : 'Unknown'}#${member.user ? member.user.discriminator : '0000'}\``, true)
      .field('Reason', reason, false)
      .timestamp(date)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    if (caseNum) {
      embed.title(`Case #${caseNum} | **${action}**`)
      publicEmbed.title(`Case #${caseNum} | **${action}**`)
    } else {
      embed.title(`**${action}**`)
      publicEmbed.title(`**${action}**`)
    }
    if (duration) {
      embed.field('Duration', duration)
      publicEmbed.field('Duration', duration)
    }
    switch (action) {
      case 'Member Warned':
        embed.color(0xFFD230)
        publicEmbed.color(0xFFD230)
      case 'Member Muted':
        embed.color(0xf45f42)
        publicEmbed.color(0xf45f42)
      case 'Member Unmuted':
        embed.color(0x41f4e8)
        publicEmbed.color(0x41f4e8)
      case 'Member Kicked':
        embed.color(0xE3C053)
        publicEmbed.color(0xE3C053)
      case 'Member Banned':
        embed.color(0xFF0000)
        publicEmbed.color(0xFF0000)
      case 'Member Unbanned':
        embed.color(0xFF0000)
        publicEmbed.color(0xFF0000)
      case 'Member Trusted':
        embed.color(0x99ff66)
        publicEmbed.color(0x99ff66)
      case 'Member Untrusted':
        embed.color(0x99ff66)
        publicEmbed.color(0x99ff66)
    }
    await this.client.createMessage(this.client.config.channels.public_channel, { embed: publicEmbed })
    return this.client.createMessage(this.client.config.channels.log_channel, { embed: embed })
  }
}

module.exports = ModerationLogListener
