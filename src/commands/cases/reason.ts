import { TailosiveClient } from '../../@types/tailosive'
import { Command, CommandContext } from '@points.city/quartz'
import { Message } from 'eris'

class Reason extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'reason'
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
    await context.message.delete()
    const reason = context.arguments
      ? this.reason(context.arguments)
      : undefined
    if (!context.arguments[0] || isNaN(Number(context.arguments[0])))
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a case to edit.`
        }
      })
    else if (!reason)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Please give me a new reason.`
        }
      })
    else if (
      !(await this.client.cases.get(
        context.message.guildID,
        Number(context.arguments[0])
      ))
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Unable to find the case.`
        }
      })
    else {
      const submitCase = await this.client.cases.edit(
        context.message.guildID,
        Number(context.arguments[0]),
        reason
      )
      if (!submitCase)
        return context.message.channel.createMessage({
          embed: {
            description: `${context.message.author.mention}, I was unable to process the case... Please contact dev man!`
          }
        })
      return context.message.channel.createMessage({
        embed: {
          description: `Successfully Updated | Case #${submitCase} | **Tailosive Moderation**`
        }
      })
    }
  }
}

export default Reason
