import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Stats extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'stats',
      description: {
        content: 'Display bot statistics'
      }
    })
  }

  formatMilliseconds(ms: number) {
    let x = Math.floor(ms / 1000)
    let seconds: number | string = x % 60

    x = Math.floor(x / 60)
    let minutes: number | string = x % 60

    x = Math.floor(x / 60)
    let hours: number | string = x % 24

    let days: number | string = Math.floor(x / 24)

    seconds = `${'0'.repeat(2 - seconds.toString().length)}${seconds}`
    minutes = `${'0'.repeat(2 - minutes.toString().length)}${minutes}`
    hours = `${'0'.repeat(2 - hours.toString().length)}${hours}`
    days = `${'0'.repeat(Math.max(0, 2 - days.toString().length))}${days}`

    return `${days === '00' ? '' : `${days}:`}${hours}:${minutes}:${seconds}`
  }

  async run(context: CommandContext) {
    const embed = new Embed()
      .setTitle('**Stats**')
      .addField('Uptime', this.formatMilliseconds(this.client.uptime), true)
      .addField(
        'Memory',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true
      )
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    return context.message.channel.createMessage({ embed: embed })
  }
}

export default Stats
