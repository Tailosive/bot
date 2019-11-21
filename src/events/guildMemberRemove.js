'use strict'

const { Event } = require('quartz')

class GuildMemberRemoveListener extends Event {
  constructor (client) {
    super(client, {
      name: 'guildMemberRemove'
    })
  }

  async run (guild, member) {
    if (guild.id !== this.client.config.main_guild) return
    const ban = await this.client.getGuildBan(guild.id, member.id).catch(() => {
      return null
    })
    if (ban) return
    const embed = this.client.embed()
      .title('**Member Left**')
      .field('Member', `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``, true)
      .timestamp(new Date())
      .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .color(0xff7547)
      .footer(`ID: ${member.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
    return this.client.createMessage(this.client.config.channels.member_channel, { embed: embed })
  }
}

module.exports = GuildMemberRemoveListener
