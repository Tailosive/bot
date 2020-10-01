import { Event, Embed } from '@points.city/quartz'
import { ChannelInvite, Guild, Member } from 'eris'
import moment from 'moment'
import { TailosiveClient } from '../@types/tailosive'

class GuildMemberAddListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'guildMemberAdd'
    })
  }

  async run(guild: Guild, member: Member) {
    if (guild.id !== this.client.config.main_guild) return
    const cases = await this.client.cases.get(guild.id)
    if (cases && Array.isArray(cases)) {
      for (const caseObject of cases) {
        if (
          caseObject.type === 'mute' &&
          caseObject.userID === member.id &&
          caseObject.status === 'active'
        )
          await member.addRole(this.client.config.roles.mute_role)
      }
    }

    let inv: ChannelInvite
    const created = moment(member.user.createdAt).format('lll')
    try {
      await member.guild.getInvites().then(async (guildInvites) => {
        if (guildInvites) {
          const storedInvites = this.client.invites.get(guild.id)
          if (storedInvites) {
            this.client.invites.set(guild.id, guildInvites)
            const invite = await guildInvites.find(
              (i) =>
                storedInvites.find((ic: any) => ic.code === i.code).uses <
                i.uses
            )
            if (invite) inv = invite
          }
        }
      })
    } catch (e) {
      return undefined
    }
    const embed = new Embed()
      .setTitle('**Member Joined**')
      .addField(
        'Member',
        `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``,
        true
      )
      .addField('Account Created', created, true)
      .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .setTimestamp(new Date())
      .setColor(0x47ff47)
      .setFooter(
        `ID: ${member.id} | ${this.client.config.embed.text}`,
        this.client.config.embed.icon
      )
    if (inv) {
      embed.addField(
        'Invite',
        `\`${inv.code}\` by ${inv.inviter.mention} (\`${inv.inviter.username}#${inv.inviter.discriminator}\`)`
      )
    }
    return this.client.createMessage(
      this.client.config.channels.member_channel,
      { embed: embed }
    )
  }
}

module.exports = GuildMemberAddListener
