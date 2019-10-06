'use strict'

const { Command } = require('quartz')

class Restart extends Command {
  constructor (client) {
    super(client, {
      name: 'restart'
    })
  }

  async run (msg) {
    if (msg.author.id !== '392347814413467655') return
    await msg.embed('Restarting...', { delete: false })
    process.exit(1)
  }
}

module.exports = Restart
