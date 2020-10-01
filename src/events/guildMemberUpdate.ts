import { Event, Embed } from '@points.city/quartz'
import { Guild, Member } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class GuildMemberUpdateListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'guildMemberUpdate'
    })
  }

  async run(guild: Guild, member: Member, oldMember: Member) {
    if (guild.id !== this.client.config.main_guild) return
    if ((oldMember?.nick || '') !== (member?.nick || '')) {
      const audit = await this.client.functions.fetchLastAudit(guild, 24)
      if (!audit || audit.actionType !== 24) return
      let reason = 'No reason given'
      let moderator = 'Unknown'
      const target = audit.targetID
      const exec = audit.user
      if (audit.reason) reason = audit.reason
      if (exec.id && exec.id !== member.id) moderator = `<@${exec.id}>`
      if (exec.id === this.client.user.id) return
      if (target !== member.id) return
      const oldNickname = oldMember.nick || oldMember.user.username
      const newNickname = member.nick || member.user.username
      if (!oldNickname || !oldNickname) return
      const embed = new Embed()
        .setTitle('**Nickname Changed**')
        .addField(
          'Member',
          `${member.user.mention} \`${member.user.username}#${member.user.discriminator}\``,
          false
        )
        .addField('Before', `\`${oldNickname}\``, true)
        .addField('After', `\`${newNickname}\``, true)
        .setTimestamp(new Date())
        .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
        .setColor(0xff00ff)
        .setFooter(
          `ID: ${member.id} | ${this.client.config.embed.text}`,
          this.client.config.embed.icon
        )
      if (moderator && moderator !== 'Unknown')
        embed.addField('Moderator', `${moderator}`)
      if (reason && reason !== 'No reason given')
        embed.addField('Reason', reason)
      return this.client.createMessage(
        this.client.config.channels.nickname_channel,
        { embed: embed }
      )
    } else if (
      (oldMember?.roles?.length || 0) !== (member?.roles?.length || 0)
    ) {
      if (oldMember.roles.length > member.roles.length) {
        const dif = await oldMember.roles.filter(
          (r) => !member.roles.includes(r)
        )[0]
        if (!dif) return
        if (this.client.config.roles.donator_roles.includes(dif)) {
          let removeRole = true
          await member.roles.forEach(async (role) => {
            if (this.client.config.roles.donator_roles.includes(role))
              removeRole = false
          })
          if (removeRole)
            await member.removeRole(this.client.config.roles.donator_role)
        }
      } else if (oldMember.roles.length < member.roles.length) {
        const dif = member.roles.filter((r) => !oldMember.roles.includes(r))[0]
        if (!dif) return
        if (this.client.config.roles.donator_roles.includes(dif)) {
          await member.addRole(this.client.config.roles.donator_role)
        }
      }
    }
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

export default GuildMemberUpdateListener
