import { Command, CommandContext } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Trust extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'trust',
      description: {
        content: 'Remove trusted role from user',
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

  async run(context: CommandContext) {
    await context.message.delete('Tailosive Moderation')
    if (context.message.channel.type !== 0) return
    if (!context.arguments[0])
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a member to unmute.`
        }
      })
    const member =
      (await this.client.utils.resolveMember(
        context.message.channel.guild,
        context.arguments[0]
      )) || undefined
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!member)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a vaild member to mute. This could also mean the member isn't cached or couldn't be fetched from the Discord API.`
        }
      })
    else if (member.id === context.message.member.id)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, You can't trust yourself.`
        }
      })
    else if (
      member.roles.length > 0 &&
      member.roles.includes(this.client.config.roles.mod_role)
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to trust a moderator.`
        }
      })
    else {
      if (
        member.roles.length > 0 &&
        member.roles.includes(this.client.config.roles.trusted_role)
      ) {
        await member.removeRole(this.client.config.roles.trusted_role)
        await this.client.emit(
          'moderationLog',
          null,
          'Member Untrusted',
          member,
          context.message.author,
          new Date(),
          reason || 'No reason was given'
        )
      } else {
        await member.addRole(this.client.config.roles.trusted_role)
        await this.client.emit(
          'moderationLog',
          null,
          'Member Trusted',
          member,
          context.message.author,
          new Date(),
          reason || 'No reason was given'
        )
      }
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Updated Trust: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Trust
