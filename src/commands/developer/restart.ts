import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Restart extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'restart',
      ownerOnly: true
    })
  }

  async run(context: CommandContext) {
    await context.message.channel.createMessage({
      embed: { description: 'Restarting...' }
    })
    process.exit(1)
  }
}

export default Restart
