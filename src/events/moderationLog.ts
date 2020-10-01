import { Event, Embed } from '@points.city/quartz'
import { Member } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class ModerationLogListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'moderationLog'
    })
  }

  async run(
    caseNum: number,
    action: string,
    member: Member,
    moderator: Member,
    date: Date,
    reason: string,
    duration: any
  ) {
    if (!member || !member.guild || !action || !moderator) return
    if (member.guild.id !== this.client.config.main_guild) return
    const embed = new Embed()
      .addField(
        'Member',
        `${member.user ? member.user.mention : 'Unknown'} \`${
          member.user ? member.user.username : 'Unknown'
        }#${member.user ? member.user.discriminator : '0000'}\``,
        true
      )
      .addField(
        'Moderator',
        `${moderator.mention} \`${moderator.username}#${moderator.discriminator}\``,
        true
      )
      .addField('Reason', reason, false)
      .setTimestamp(date)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    const publicEmbed = new Embed()
      .addField(
        'Member',
        `${member.user ? member.user.mention : 'Unknown'} \`${
          member.user ? member.user.username : 'Unknown'
        }#${member.user ? member.user.discriminator : '0000'}\``,
        true
      )
      .addField('Reason', reason, false)
      .setTimestamp(date)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    if (caseNum) {
      embed.setTitle(`Case #${caseNum} | **${action}**`)
      publicEmbed.setTitle(`Case #${caseNum} | **${action}**`)
    } else {
      embed.setTitle(`**${action}**`)
      publicEmbed.setTitle(`**${action}**`)
    }
    if (duration) {
      embed.addField('Duration', duration)
      publicEmbed.addField('Duration', duration)
    }
    switch (action) {
      case 'Member Warned':
        embed.setColor(0xffd230)
        publicEmbed.setColor(0xffd230)
        break
      case 'Member Muted':
        embed.setColor(0xf45f42)
        publicEmbed.setColor(0xf45f42)
        break
      case 'Member Unmuted':
        embed.setColor(0x41f4e8)
        publicEmbed.setColor(0x41f4e8)
        break
      case 'Member Kicked':
        embed.setColor(0xe3c053)
        publicEmbed.setColor(0xe3c053)
        break
      case 'Member Banned':
        embed.setColor(0xff0000)
        publicEmbed.setColor(0xff0000)
        break
      case 'Member Unbanned':
        embed.setColor(0xff0000)
        publicEmbed.setColor(0xff0000)
        break
      case 'Member Trusted':
        embed.setColor(0x99ff66)
        publicEmbed.setColor(0x99ff66)
        break
      case 'Member Untrusted':
        embed.setColor(0x99ff66)
        publicEmbed.setColor(0x99ff66)
        break
    }
    await this.client.createMessage(
      this.client.config.channels.public_channel,
      { embed: publicEmbed }
    )
    return this.client.createMessage(this.client.config.channels.log_channel, {
      embed: embed
    })
  }
}

export default ModerationLogListener
