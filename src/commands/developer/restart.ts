import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Restart extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'restart'
    })
  }

  async run(context: CommandContext) {
    if (context.message.author.id !== '392347814413467655') return
    await context.message.channel.createMessage({
      embed: { description: 'Restarting...' }
    })
    process.exit(1)
  }
}

export default Restart
