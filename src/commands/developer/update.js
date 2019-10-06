'use strict'

const { Command } = require('quartz')

class Update extends Command {
  constructor (client) {
    super(client, {
      name: 'update'
    })
  }

  async run (msg) {
    if (msg.author.id !== '392347814413467655') return
    const donatorRole = await msg.guild.roles.get(this.client.config.donator_role)
    await donatorRole.members.forEach(async member => {
      let keepRole = null
      await this.client.config.roles.donator_roles.forEach(async role => {
        if (await member.roles.has(role.id)) {
          if (!keepRole) keepRole = false
          else keepRole = true
        }
      })
      if (!keepRole) {
        await member.roles.remove(this.client.config.roles.donator_role)
      }
    })
  }
}

module.exports = Update
