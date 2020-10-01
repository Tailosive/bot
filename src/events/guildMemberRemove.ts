import { Event, Embed } from '@points.city/quartz'
import { Guild, Member } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class GuildMemberRemoveListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'guildMemberRemove'
    })
  }

  async run(guild: Guild, member: Member) {
    if (guild.id !== this.client.config.main_guild) return
    const ban = await this.client.getGuildBan(guild.id, member.id).catch(() => {
      return null
    })
    if (ban) return
    const embed = new Embed()
      .setTitle('**Member Left**')
      .addField(
        'Member',
        `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``,
        true
      )
      .setTimestamp(new Date())
      .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .setColor(0xff7547)
      .setFooter(
        `ID: ${member.id} | ${this.client.config.embed.text}`,
        this.client.config.embed.icon
      )
    return this.client.createMessage(
      this.client.config.channels.member_channel,
      { embed: embed }
    )
  }
}

export default GuildMemberRemoveListener
