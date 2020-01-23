'use strict'

const { Command } = require('quartz')

class Refresh extends Command {
  constructor (client) {
    super(client, {
      name: 'refresh'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator()
  }

  async run (msg, args) {
    const intergrations = await this.client.getGuildIntegrations(msg.guild.id)
    for await (const integration of intergrations) {
      await integration.sync().catch(console.error)
    }
    return msg.embed('Refreshing intergration...')
  }
}

module.exports = Refresh
