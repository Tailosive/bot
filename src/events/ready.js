const { Event } = require('quartz')

class Ready extends Event {
  constructor (client) {
    super(client, {
      name: 'ready'
    })
  }

  async run () {
    const guild = this.client.guilds.get(this.client.config.main_guild)
    if (guild) guild.getInvites().then(invites => this.client.invites.set(guild.id, invites)).catch(() => {})
    await this.client.functions.startMutes()
    await this.client.functions.startBans()
    return console.log('READY', `Bot: ${this.client.user.username}`)
  }
}

module.exports = Ready
