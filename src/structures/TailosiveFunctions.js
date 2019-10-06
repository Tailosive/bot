'use strict'

const schedule = require('node-schedule')
const { isSnowflake } = require('quartz')

class TailosiveFunctions {
  constructor (client) {
    this.client = client
  }

  async fetchLastAudit (guild, type) {
    if (type) {
      const item = await guild.getAuditLogs({ limit: 1, actionType: type }).catch(() => {
        return false
      })
      return item.entries.first()
    } else {
      const item = await guild.getAuditLogs({ limit: 1 }).catch(() => {
        return false
      })
      return item.entries.first()
    }
  }

  async mute (duration, guildID, caseID, userID) {
    schedule.scheduleJob(duration, async (time) => {
      const guild = await this.client.guilds.get(guildID)
      const member = await guild.members.get(userID)
      if (!member) return
      if (member.roles.includes(this.client.config.roles.mute_role)) await member.removeRole(this.client.config.roles.mute_role)
      await this.client.cases.edit(guildID, caseID, 'Automatic Unmute', 'inactive', true)
      return this.client.emit('moderationLog', caseID, 'Member Unmuted', member, this.client.user, new Date(), 'Automatic Unmute')
    })
  }

  async startMutes () {
    let cases = await this.client.cases.get(this.client.config.main_guild)
    if (!cases || cases.length <= 0) return
    cases = await cases.filter(c => c.type === 'mute' && c.status === 'active' && c.duration)
    if (!cases || cases.length <= 0) return
    for (const mute of cases) {
      if (mute && new Date(mute.duration).getTime() < Date.now()) {
        const guild = await this.client.guilds.get(this.client.config.main_guild)
        const member = await guild.members.get(mute.userID)
        if (!member) return
        if (member.roles.includes(this.client.config.roles.mute_role)) member.roles.removeRole(this.client.config.roles.mute_role)
        await this.client.cases.edit(this.client.config.main_guild, mute.caseID, 'Automatic Unmute', 'inactive', true)
        await this.client.emit('moderationLog', mute.caseID, 'Member Unmuted', member, this.client.user, new Date(), 'Automatic Unmute')
        return
      } else if (mute) this.mute(mute.duration, this.client.config.main_guild, mute.caseID, mute.userID)
      continue
    }
  }

  moderator (msg) {
    const guild = this.client.guilds.get(msg.guild.id)
    const member = guild.members.get(msg.author.id)
    if (member.permission.has('administrator')) return null
    else if (member.roles.some(r => r.id === this.client.config.roles.mod_role)) return null
    else return 'Moderator Role'
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }

  getUserFromMention (mention) {
    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) {
      const isID = isSnowflake(mention) || undefined
      if (isID) return this.client.users.get(mention)
      else return undefined
    }
    const id = matches[1]
    return this.client.users.get(id)
  }
}

module.exports = TailosiveFunctions
