'use strict'

const { Command } = require('quartz')
const moment = require('moment')

class Warn extends Command {
  constructor (client) {
    super(client, {
      name: 'whois'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  async run (msg, args) {
    const member = args[0] && this.client.functions.getUserFromMention(args[0]) ? msg.guild.members.get(this.client.functions.getUserFromMention(args[0]).id) : msg.member
    const joinDiscord = moment(member.user.createdAt).format('lll')
    const joinServer = moment(member.joinedAt).format('lll')
    const r = member.roles.map(role => `<@&${role}>`).join(', ').substr(0, 900)
    const bot = member.user.bot
    const whoisEmbed = this.client.embed()
      .thumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .title(`**${this.escapeRegex(member.user.username)}#${member.user.discriminator}** ${bot ? '<:bot:557352165686116364>' : ''}`, member.user.avatarURL || member.user.defaultAvatarURL)
      .field('Nickname', `${this.escapeRegex(member.nick ? member.nick : member.user.username)}`, true)
      .field('Status', member.status, true)
      .field('Joined', joinServer, true)
      .field('Registered', joinDiscord, true)
      .color(this.client.config.embed.color)
      .footer(this.client.config.embed.text, this.client.config.embed.icon)
    const cases = await this.client.cases.get(msg.guild.id, null, member.id)
    if (!member.roles.includes(this.client.config.roles.mod_role) && !member.user.bot) {
      whoisEmbed.field('Warnings', cases.filter(c => c.type === 'warn') ? cases.filter(c => c.type === 'warn').length : 'No warnings', true)
      whoisEmbed.field('Total Cases', cases.length || 'No cases', true)
    }
    let description = member.user.mention
    if (r) whoisEmbed.field('Roles', r)
    if (member.user.id === '392347814413467655') description = 'Dead Deer. Hahahahahahahahahaha' // Adam
    if (member.user.id === '231534805102231552') description = '#1 Tailosive Food Fan' // Michael
    if (member.user.id === '346615886603354112') description = 'I don\'t know or care' // eslint-disable-line
    if (member.user.id === '198638530371518475') description = 'Long time listener, first time caller' // Sam
    whoisEmbed.description(description)
    if (member.user.game) whoisEmbed.field('Game', member.user.game)
    return msg.channel.createMessage({ embed: whoisEmbed })
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = Warn
