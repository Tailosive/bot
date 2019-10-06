const { Command } = require('quartz')
const { version } = require('../../../package')

class Bot extends Command {
  constructor (client) {
    super(client, {
      name: 'bot',
      aliases: ['botinfo']
    })
  }

  async run (msg) {
    const developer = this.client.users.get(this.client.config.owner)
    const embed = this.client.embed()
      .title(`**${this.client.user.username}**`)
      .field('Developer', `\`${developer.username}\``, true)
      .field('Frameworks', '↳ Quartz (private)\n↳ [Eris](https://abal.moe/Eris/)', true)
      .color(await msg.color())
      .footer(`${await msg.text()} • Version ${version}`, await msg.logo())
    return msg.channel.createMessage({ embed: embed })
  }
}

module.exports = Bot
