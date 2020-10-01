import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'
import { Message } from 'eris'
import ms from 'ms'
import moment from 'moment'

class Ban extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'ban',
      description: {
        content: 'Bans a member',
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
    const member =
      context.arguments[0] &&
      this.client.functions.getUserFromMention(context.arguments[0])
        ? context.message.member.guild.members.get(
            this.client.functions.getUserFromMention(context.arguments[0]).id
          )
        : undefined
    if (!member)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a member to ban.`
        }
      })
    const durationString = context.arguments[1]
    const duration = context.arguments[1]
      ? this.duration(context.arguments[1])
      : undefined
    if (duration) context.arguments.shift()
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a reason for the ban.`
        }
      })
    else if (member.id === context.message.member.id)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author}, You can't ban yourself.`
        }
      })
    else if (member.roles.includes(this.client.config.roles.mod_role))
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to ban a moderator.`
        }
      })
    else {
      const submitCase = await this.client.cases.create(
        context.message.guildID,
        'ban',
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
            description: `${context.message.author.mention}, I was unable to process the ban... Please contact dev man!`
          }
        })
      if (reason !== 'DEV_TEST')
        await member.ban(
          0,
          `Moderator: ${context.message.author.username}#${
            context.message.author.discriminator
          } | Reason: ${reason || 'No reason was given'}`
        )
      let displayBan
      if (duration) {
        displayBan = moment.duration(ms(durationString)).asMinutes()
        if (displayBan > 60) {
          displayBan = moment.duration(ms(durationString)).asHours()
          displayBan = `${displayBan} hours`
        }
        if (displayBan < 1) {
          displayBan = moment.duration(ms(durationString)).asSeconds()
          displayBan = `${displayBan} sec`
        } else displayBan = `${displayBan} min`
      }
      await this.client.emit(
        'moderationLog',
        submitCase,
        'Member Banned',
        member,
        context.message.author,
        new Date(),
        reason || 'No reason was given',
        displayBan
      )
      if (duration)
        await this.client.functions.ban(
          duration,
          context.message.guildID,
          submitCase,
          member.id
        )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Banned: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Ban
