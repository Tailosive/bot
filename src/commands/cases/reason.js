'use strict'
const { Command } = require('quartz')

class Reason extends Command {
  constructor (client) {
    super(client, {
      name: 'reason'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  reason (args) {
    args.shift()
    return args.join(' ')
  }

  async run (msg, args) {
    msg.delete()
    const reason = args ? this.reason(args) : undefined
    if (!args[0]) return msg.embed(`${msg.author.mention}, Please give me a case to edit.`)
    else if (!reason) return msg.embed(`${msg.author.mention}, Please give me a new reason.`)
    else if (!await this.client.cases.get(msg.guild.id, args[0])) return msg.embed(`${msg.author.mention}, Unable to find the case.`)
    else {
      const submitCase = await this.client.cases.edit(msg.guild.id, args[0], reason)
      if (!submitCase) return msg.embed(`${msg.author.mention}, I was unable to process the kick... Please contact dev man!`)
      return msg.embed(`Successfully Updated | Case #${submitCase} | **Tailosive Moderation**`, 0xE3C053)
    }
  }
}

module.exports = Reason
