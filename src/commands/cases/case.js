'use strict'

const { Command } = require('quartz')

class Case extends Command {
  constructor (client) {
    super(client, {
      name: 'case'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  async run (msg, args) {
    if (!args[0]) return msg.embed('That is not a vaild case. Please give me a vaild case number. | **Tailosive Database**')
    const caseObj = await this.client.cases.get(msg.guild.id, args[0])
    if (!caseObj) return msg.embed('Unable to find case | **Tailosive Database**')
    const embed = this.client.embed()
      .title(`Case #${caseObj.caseID} | **Details**`)
      .description(`\`\`\`json\n${JSON.stringify(caseObj, null, '\t')}\`\`\``)
      .color(this.client.config.embed.color)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    return msg.channel.createMessage({ embed: embed })
  }
}

module.exports = Case
