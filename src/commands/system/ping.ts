import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Ping extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'ping',
      aliases: ['pong'],
      description: {
        content: 'Gets the latency of the bot in milliseconds.'
      }
    })
  }

  async run(context: CommandContext) {
    const pingMessage = await context.message.channel.createMessage(
      `<@${context.message.author.id}>, Pong!`
    )
    const sentTime = pingMessage.editedTimestamp || pingMessage.timestamp
    const startTime =
      context.message.editedTimestamp || context.message.timestamp
    const embed = new Embed()
      .setDescription(`**Latency: \`${sentTime - startTime}ms\`**`)
      .setColor(this.client.config.embed.color)
    return pingMessage.edit({ embed: embed, content: '' })
  }
}

export default Ping
