import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'
import ms from 'ms'
import moment from 'moment'
import { Message } from 'eris'

class Mute extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'mute',
      description: {
        content: 'Mute a member',
        usage: '(user) [duration] [reason]'
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

  duration(string: string) {
    if (!string) return undefined
    const rawduration = ms(string)
    if (rawduration && rawduration >= 300000 && !isNaN(rawduration))
      return new Date(Date.now() + rawduration)
    else return undefined
  }

  async run(context: CommandContext) {
    await context.message.delete('Tailosive Moderation')
    if (context.message.channel.type !== 0) return
    if (!context.arguments[0])
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a member to mute.`
        }
      })
    const member =
      (await this.client.utils.resolveMember(
        context.message.channel.guild,
        context.arguments[0]
      )) || undefined
    const durationString = context.arguments[1]
    const duration = context.arguments[1]
      ? this.duration(context.arguments[1])
      : undefined
    if (!member)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a vaild member to mute. This could also mean the member isn't cached or couldn't be fetched from the Discord API.`
        }
      })
    if (duration) context.arguments.shift()
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a reason for the mute.`
        }
      })
    else if (
      member.id === context.message.member.id &&
      process.env.NODE_ENV === 'production'
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, You can't mute yourself.`
        }
      })
    else if (
      member.roles.length > 0 &&
      member.roles.includes(this.client.config.roles.mod_role)
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to mute a moderator.`
        }
      })
    else if (member.bot)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Can't mute bots... They aren't humans :(`
        }
      })
    else {
      const submitCase = await this.client.cases.create(
        context.message.guildID,
        'mute',
        member.id,
        context.message.author.id,
        reason || 'No reason was given',
        new Date(),
        'active',
        duration
      )
      if (!submitCase)
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, I was unable to process the mute... Please contact dev man!`
          }
        })
      if (
        member.roles.length > 0 &&
        member.roles.includes(this.client.config.roles.mute_role)
      )
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, This member is already muted.`
          }
        })
      else await member.addRole(this.client.config.roles.mute_role)
      let displayMute
      if (duration) {
        displayMute = moment.duration(ms(durationString)).asMinutes()
        if (displayMute > 60) {
          displayMute = moment.duration(ms(durationString)).asHours()
          displayMute = `${displayMute} hours`
        }
        if (displayMute < 1) {
          displayMute = moment.duration(ms(durationString)).asSeconds()
          displayMute = `${displayMute} sec`
        } else {
          displayMute = `${displayMute} min`
        }
      }
      await this.client.emit(
        'moderationLog',
        submitCase,
        'Member Muted',
        member,
        context.message.author,
        new Date(),
        reason || 'No reason was given',
        displayMute
      )
      if (duration)
        await this.client.functions.mute(
          duration,
          context.message.guildID,
          submitCase,
          member.id
        )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Muted: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Mute
