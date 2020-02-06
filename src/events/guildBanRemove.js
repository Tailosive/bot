const { Event } = require('quartz')

class GuildBanRemoveListener extends Event {
  constructor (client) {
    super(client, {
      name: 'guildBanRemove'
    })
  }

  async run (guild, user) {
    if (guild.id !== this.client.config.main_guild) return
    let reason = 'No reason given'
    let moderator = 'Unknown'
    const audit = await this.client.functions.fetchLastAudit(guild, 23)
    if (!audit || audit.actionType !== 23) return
    const target = audit.target
    const member = audit.member
    if (audit.reason) reason = audit.reason
    if (member && member.id) moderator = `<@${member.id}>`
    if (member && member.id === this.client.user.id) return
    if (target.id !== user.id) return
    const embed = this.client.embed()
      .title('**Member Unbanned**')
      .field('Member', `${user.mention} \`${user.username}#${user.discriminator}\``, true)
      .thumbnail(user.avatarURL || user.defaultAvatarURL)
      .timestamp(new Date())
      .color(0xFF0000)
      .footer(`ID: ${user.id} | ${this.client.config.embed.text}`, this.client.config.embed.icon)
    if (moderator) {
      embed.field('Moderator', moderator, true)
    }
    if (reason) {
      embed.field('Reason', reason)
    }
    return this.client.createMessage(this.client.config.channels.log_channel, { embed: embed })
  }
}

module.exports = GuildBanRemoveListener
