const { Command } = require('quartz')

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: 'stats'
    })
  }

  formatMilliseconds (ms) {
    let x = Math.floor(ms / 1000)
    let seconds = x % 60

    x = Math.floor(x / 60)
    let minutes = x % 60

    x = Math.floor(x / 60)
    let hours = x % 24

    let days = Math.floor(x / 24)

    seconds = `${'0'.repeat(2 - seconds.toString().length)}${seconds}`
    minutes = `${'0'.repeat(2 - minutes.toString().length)}${minutes}`
    hours = `${'0'.repeat(2 - hours.toString().length)}${hours}`
    days = `${'0'.repeat(Math.max(0, 2 - days.toString().length))}${days}`

    return `${days === '00' ? '' : `${days}:`}${hours}:${minutes}:${seconds}`
  }

  async run (msg) {
    const embed = this.client.embed()
      .title('**Stats**')
      .field('Uptime', this.formatMilliseconds(this.client.uptime), true)
      .field('Memory', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .color(await msg.color())
      .footer(await msg.text(), await msg.logo())
    return msg.channel.createMessage({ embed: embed })
  }
}

module.exports = Stats
