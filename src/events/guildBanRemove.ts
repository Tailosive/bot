import { Event, Embed } from '@points.city/quartz'
import { Guild, User } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class GuildBanRemoveListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'guildBanRemove'
    })
  }

  async run(guild: Guild, user: User) {
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
    const embed = new Embed()
      .setTitle('**Member Unbanned**')
      .addField(
        'Member',
        `${user.mention} \`${user.username}#${user.discriminator}\``,
        true
      )
      .setThumbnail(user.avatarURL || user.defaultAvatarURL)
      .setTimestamp(new Date())
      .setColor(0xff0000)
      .setFooter(
        `ID: ${user.id} | ${this.client.config.embed.text}`,
        this.client.config.embed.icon
      )
    if (moderator) {
      embed.addField('Moderator', moderator, true)
    }
    if (reason) {
      embed.addField('Reason', reason)
    }
    return this.client.createMessage(this.client.config.channels.log_channel, {
      embed: embed
    })
  }
}

export default GuildBanRemoveListener
