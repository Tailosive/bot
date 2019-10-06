'use strict'

const { Command } = require('quartz')
const moment = require('moment')

class Server extends Command {
  constructor (client) {
    super(client, {
      name: 'server'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  async run (msg, args) {
    const created = moment(msg.guild.createdAt).format('lll')
    const roles = msg.guild.roles.map(role => role.mention).join(', ').substr(0, 900)
    const whoisEmbed = this.client.embed()
      .title(`**${this.escapeRegex(msg.guild.name)}**`)
      .description('This is the official Tailosive discord!')
      .field('Created', created, true)
      .field('Members', msg.guild.memberCount, true)
      .field('Channels', msg.guild.channels.size, true)
      .color(this.client.config.embed.color)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    if (roles) whoisEmbed.field('Roles', roles)
    return msg.channel.createMessage({ embed: whoisEmbed })
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = Server
