const { Event } = require('quartz')

class Ready extends Event {
  constructor (client) {
    super(client, {
      name: 'ready'
    })
  }

  async run () {
    const guild = this.client.guilds.get(this.client.config.main_guild)
    if (guild) {
      const invites = await guild.getInvites()
      this.client.invites[guild.id] = invites
    }
    await this.client.functions.startMutes()
    return console.log('READY', `Bot: ${this.client.user.username}`)
  }
}

module.exports = Ready
