import { Command, CommandContext } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Refresh extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'refresh',
      description: {
        content: 'Refresh the integrations'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    try {
      const intergrations = await this.client.getGuildIntegrations(
        context.message.guildID
      )
      intergrations.forEach(async (intergration) => await intergration.sync())
      return context.message.channel.createMessage({
        embed: { description: 'Refreshing intergration...' }
      })
    } catch (error) {
      return context.message.channel.createMessage({
        embed: { description: 'Unable to refresh integrations...' }
      })
    }
  }
}

export default Refresh
