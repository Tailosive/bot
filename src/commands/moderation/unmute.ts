import { Command, CommandContext } from '@points.city/quartz'
import { Member, Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Unmute extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'unmute',
      description: {
        content: 'Unmute a muted member',
        usage: '(user) [reason]'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  reason(args: string[]) {
    args.shift()
    return args.join(' ')
  }

  async cases(msg: Message, member: Member) {
    let cases = await this.client.cases.get(msg.guildID)
    if (!cases || !Array.isArray(cases) || cases.length <= 0) return undefined
    cases = cases.filter(
      (c) =>
        c.type === 'mute' && c.status === 'active' && c.userID === member.id
    )
    if (!cases || cases.length <= 0) return undefined
    cases.sort((a, b) => b.caseID - a.caseID)
    return cases[0]
  }

  async run(context: CommandContext) {
    await context.message.delete('Tailosive Moderation')
    const member =
      context.arguments[0] &&
      this.client.functions.getUserFromMention(context.arguments[0])
        ? context.message.member.guild.members.get(
            this.client.functions.getUserFromMention(context.arguments[0]).id
          )
        : undefined
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!member)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a member to unmute.`
        }
      })
    if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a reason for the unmute.`
        }
      })
    const getCase = await this.cases(context.message, member)
    if (!getCase) {
      if (!member.roles.includes(this.client.config.roles.mute_role))
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, This member is not muted.`
          }
        })
      else await member.addRole(this.client.config.roles.mute_role)
      await this.client.emit(
        'moderationLog',
        null,
        'Member Unmuted',
        member,
        context.message.author,
        new Date(),
        reason || 'No reason was given'
      )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Unmuted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    } else if (getCase.type !== 'mute' || getCase.status === 'inactive')
      return context.message.channel.createMessage({
        embed: {
          description:
            'An error happened while getting case details! Make sure the case is vaild, it is a mute and is active.'
        }
      })
    else {
      const caseMember = await context.message.member.guild.members.get(
        getCase.userID
      )
      if (!caseMember)
        return context.message.channel.createMessage({
          embed: {
            description:
              'An error happened while getting member details! Make sure the case is vaild, it is a mute and is active.'
          }
        })
      if (!caseMember.roles.includes(this.client.config.roles.mute_role))
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, This member is not muted.`
          }
        })
      else await caseMember.removeRole(this.client.config.roles.mute_role)
      await this.client.cases.edit(
        context.message.member.guild.id,
        getCase.caseID,
        reason || 'No reason given',
        'inactive',
        true
      )
      await this.client.emit(
        'moderationLog',
        getCase.caseID,
        'Member Unmuted',
        caseMember,
        context.message.author,
        new Date(),
        reason || 'No reason was given'
      )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Unmuted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Unmute
