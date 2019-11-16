'use strict'

const { Event } = require('quartz')

class MessageReactionAddListener extends Event {
  constructor (client) {
    super(client, {
      name: 'messageReactionAdd'
    })
  }

  async run (msg, emoji, userID) {
    if (!msg.author) msg = await this.client.getMessage(msg.channel.id, msg.id)
    if (userID === this.client.user.id) return
    if (!msg || !msg.channel.guild) return
    if (msg.author.id !== this.client.user.id) return
    const moderator = msg.channel.guild.members.get(userID)
    if (!moderator) return
    if (emoji.name === '✅' && moderator.roles.includes(this.client.config.roles.mod_role)) {
      const find = await this.client.nicknames.get(msg.channel.guild.id, msg.id)
      if (!find) return
      const member = await msg.channel.guild.members.get(find.userID)
      if (!member) return
      await member.edit({ nick: find.nickname }, `Nickname Approved By: ${moderator.user.username}`)
      const logembed = this.client.embed()
        .title('**Nickname Request Approved**')
        .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, true)
        .field('Moderator', `${moderator.user.mention} \`${moderator.user.username}#${moderator.user.discriminator}\``, true)
        .field('Nickname', `\`${find.nickname}\``)
        .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .timestamp(new Date())
        .color(0x4341f4)
        .footer(`ID: ${member.user.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
      await msg.channel.createMessage({ embed: logembed })
      const edit = await this.client.nicknames.delete(msg.channel.guild.id, msg.id)
      if (!edit) return
      return msg.delete()
    } else if (emoji.name === '❌' && moderator.roles.includes(this.client.config.roles.mod_role)) {
      const find = await this.client.nicknames.get(msg.channel.guild.id, msg.id)
      if (!find) return
      const edit = await this.client.nicknames.delete(msg.channel.guild.id, msg.id)
      if (!edit) return
      const member = await msg.channel.guild.members.get(find.userID)
      if (!member) return
      const embed = this.client.embed()
        .description(`Your nickname request \`${find.nickname}\` was rejected`)
        .color(this.client.config.embed.color)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client.createMessage(memberChannel.id, { embed: embed })
      const logembed = this.client.embed()
        .title('**Nickname Request Declined**')
        .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, true)
        .field('Moderator', `${moderator.user.mention} \`${moderator.user.username}#${moderator.user.discriminator}\``, true)
        .field('Nickname', `\`${find.nickname}\``)
        .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .timestamp(new Date())
        .color(0xff7547)
        .footer(`ID: ${member.user.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
      await msg.channel.createMessage({ embed: logembed })
      return msg.delete()
    }
  }
}

module.exports = MessageReactionAddListener
