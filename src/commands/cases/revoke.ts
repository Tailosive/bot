import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Revoke extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'revoke',
      ownerOnly: true,
      description: {
        content: 'Revoke a case',
        usage: '[case]'
      }
    })
  }

  async run(context: CommandContext) {
    if (context.message.channel.type !== 0) return
    if (!context.arguments[0] || isNaN(Number(context.arguments[0])))
      return context.message.channel.createMessage({
        embed: {
          description:
            'That is not a valid case. Please give me a valid case number. | **Tailosive Database**'
        }
      })
    await this.client.cases.delete(
      context.message.guildID,
      Number(context.arguments[0])
    )
    return context.message.channel.createMessage({
      embed: {
        description: `Case #${context.arguments[0]} deleted | **Tailosive Database**`
      }
    })
  }
}

export default Revoke
