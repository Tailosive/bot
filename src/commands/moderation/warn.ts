import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'
import { Message } from 'eris'

class Warn extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'warn',
      aliases: ['w'],
      description: {
        content:
          'Warns members in DMs, adds case to profile, then logs in public and mod logs',
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
    if (!member)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a vaild member to unmute. This could also mean the member isn't cached or couldn't be fetched from the Discord API.`
        }
      })
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a reason for the warning.`
        }
      })
    else if (
      member.id === context.message.member.id &&
      process.env.NODE_ENV === 'production'
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, You can't warn yourself.`
        }
      })
    else if (member.roles.includes(this.client.config.roles.mod_role))
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to warn a moderator.`
        }
      })
    else if (member.bot)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Can't warn bots... They aren't humans :`
        }
      })
    else {
      const submitCase = await this.client.cases.create(
        context.message.guildID,
        'warn',
        member.id,
        context.message.author.id,
        reason || 'No reason was given',
        new Date(),
        'active'
      )
      if (!submitCase)
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, I was unable to process to warn... Please contact dev man!`
          }
        })
      const warnEmbed = new Embed()
        .setTitle('**Warning**')
        .addField('Reason', reason || 'No reason was given')
        .setColor(0xe3c053)
        .setTimestamp(new Date())
        .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client
        .createMessage(memberChannel.id, { embed: warnEmbed })
        .catch(() => {
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I was unable to warn that member.`
            }
          })
        })
      await this.client.emit(
        'moderationLog',
        submitCase,
        'Member Warned',
        member,
        context.message.author,
        new Date(),
        reason || 'No reason was given'
      )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Warned: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Warn
