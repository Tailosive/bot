'use strict'

const { Command } = require('quartz')

class Revoke extends Command {
  constructor (client) {
    super(client, {
      name: 'revoke'
    })
  }

  run (msg, args) {
    if (msg.author.id !== '392347814413467655' && msg.author.id !== '346615886603354112' && msg.author.id !== '382114176329580548') return
    if (!args[0]) return msg.embed('That is not a vaild case. Please give me a vaild case number. | **Tailosive Database**')
    const returnNum = this.client.cases.delete(msg.guild.id, args[0])
    if (!returnNum) return msg.embed('Unable to preform delete | **Tailosive Database**')
    return msg.embed(`Case #${returnNum} deleted | **Tailosive Database**`)
  }
}

module.exports = Revoke
