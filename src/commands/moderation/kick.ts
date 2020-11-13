import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Kick extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'kick',
      description: {
        content: 'Kicks a member',
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
    context.message.delete('Tailosive Moderation')
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
          description: `${context.message.author.mention}, Please give me a vaild member to mute. This could also mean the member isn't cached or couldn't be fetched from the Discord API.`
        }
      })
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a reason for the kick.`
        }
      })
    else if (member.id === context.message.member.id)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, You can't kick yourself.`
        }
      })
    else if (member.roles.includes(this.client.config.roles.mod_role))
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to kick a moderator.`
        }
      })
    else {
      const submitCase = await this.client.cases.create(
        context.message.guildID,
        'kick',
        member.id,
        context.message.author.id,
        reason || 'No reason was given',
        new Date(),
        'active'
      )
      if (!submitCase)
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, I was unable to process the kick... Please contact dev man!`
          }
        })
      const kickEmbed = new Embed()
        .setTitle('**Kicked**')
        .addField('Reason', reason || 'No reason was given')
        .setColor(0xe3c053)
        .setTimestamp(new Date())
        .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
      const memberChannel = await this.client.getDMChannel(member.id)
      await this.client
        .createMessage(memberChannel.id, { embed: kickEmbed })
        .catch(() => {
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I was unable to warn that member.`
            }
          })
        })
      if (reason !== 'DEV_TEST')
        await member.kick(
          `Moderator: ${context.message.author.username}#${
            context.message.author.discriminator
          } | Reason: ${reason || 'No reason was given'}`
        )
      await this.client.emit(
        'moderationLog',
        submitCase,
        'Member Kicked',
        member,
        context.message.author,
        new Date(),
        reason || 'No reason was given'
      )
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Kicked: \`${member.user.username}#${member.user.discriminator}\` | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Kick
