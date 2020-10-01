import { Event, Embed } from '@points.city/quartz'
import { Emoji, Message } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class MessageReactionAddListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'messageReactionAdd'
    })
  }

  async run(msg: Message, emoji: Emoji, userID: string) {
    if (msg.channel.type !== 0) return
    if (!msg.author) msg = await this.client.getMessage(msg.channel.id, msg.id)
    if (userID === this.client.user.id) return
    if (!msg || !msg.guildID) return
    if (msg.author.id !== this.client.user.id) return
    const moderator = msg.member.guild.members.get(userID)
    if (!moderator) return
    if (
      emoji.name === '✅' &&
      moderator.roles.includes(this.client.config.roles.mod_role)
    ) {
      const find = await this.client.nicknames.get(msg.member.guild.id, msg.id)
      if (!find) return
      const member = await msg.member.guild.members.get(find.userID)
      if (!member) return
      await member.edit(
        { nick: find.nickname },
        `Nickname Approved By: ${moderator.user.username}`
      )
      const logembed = new Embed()
        .setTitle('**Nickname Request Approved**')
        .addField(
          'Member',
          `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``,
          true
        )
        .addField(
          'Moderator',
          `${moderator.user.mention} \`${moderator.user.username}#${moderator.user.discriminator}\``,
          true
        )
        .addField('Nickname', `\`${find.nickname}\``)
        .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .setTimestamp(new Date())
        .setColor(0x4341f4)
        .setFooter(
          `ID: ${member.user.id} | ${this.client.config.embed.text}`,
          this.client.config.embed.icon
        )
      await msg.channel.createMessage({ embed: logembed })
      const edit = await this.client.nicknames.delete(msg.guildID, msg.id)
      if (!edit) return
      return msg.delete()
    } else if (
      emoji.name === '❌' &&
      moderator.roles.includes(this.client.config.roles.mod_role)
    ) {
      const find = await this.client.nicknames.get(msg.guildID, msg.id)
      if (!find) return
      const edit = await this.client.nicknames.delete(msg.guildID, msg.id)
      if (!edit) return
      const member = await msg.member.guild.members.get(find.userID)
      if (!member) return
      const embed = new Embed()
        .setDescription(
          `Your nickname request \`${find.nickname}\` was rejected`
        )
        .setColor(this.client.config.embed.color)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client.createMessage(memberChannel.id, { embed: embed })
      const logembed = new Embed()
        .setTitle('**Nickname Request Declined**')
        .addField(
          'Member',
          `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``,
          true
        )
        .addField(
          'Moderator',
          `${moderator.user.mention} \`${moderator.user.username}#${moderator.user.discriminator}\``,
          true
        )
        .addField('Nickname', `\`${find.nickname}\``)
        .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .setTimestamp(new Date())
        .setColor(0xff7547)
        .setFooter(
          `ID: ${member.user.id} | ${this.client.config.embed.text}`,
          this.client.config.embed.icon
        )
      await msg.channel.createMessage({ embed: logembed })
      return msg.delete()
    }
  }
}

export default MessageReactionAddListener
