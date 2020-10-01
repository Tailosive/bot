import { Guild, Message } from 'eris'
import schedule from 'node-schedule'
import { TailosiveClient } from '../@types/tailosive'

const DISCORD_EPOCH = 1420070400000

class Functions {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    this.client = client
  }

  getTime(snowflake: string) {
    return this.sinceEpoch(snowflake) + DISCORD_EPOCH
  }

  sinceEpoch(snowflake: string) {
    return Math.floor(Number(snowflake) / 4194304)
  }

  isSnowflake(snowflake: string) {
    if (isNaN(Number(snowflake)) || !/[0-9]{15,25}/.test(snowflake)) {
      return
    }
    const timestamp = this.getTime(snowflake)
    if (timestamp < Date.now() + 60000) {
      return timestamp
    }
  }

  async fetchLastAudit(guild: Guild, type: number) {
    try {
      if (type) {
        const item = await guild.getAuditLogs(1, null, type)
        return item.entries[0]
      } else {
        const item = await guild.getAuditLogs(1, null, type)
        return item.entries[0]
      }
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async ban(duration: Date, guildID: string, caseID: number, userID: string) {
    schedule.scheduleJob(duration, async (time) => {
      const guild = await this.client.guilds.get(guildID)
      guild.unbanMember(userID, 'Automatic Unban')
      const user = await this.client.getRESTUser(userID)
      await this.client.cases.edit(
        guildID,
        caseID,
        'Automatic Unban',
        'inactive',
        true
      )
      return this.client.emit(
        'moderationLog',
        caseID,
        'Member Unbanned',
        { guild, user: user || null },
        this.client.user,
        new Date(),
        'Automatic Unban'
      )
    })
  }

  async startBans() {
    let cases = await this.client.cases.get(this.client.config.main_guild)
    if (!cases || !Array.isArray(cases) || cases.length <= 0) return
    cases = await cases.filter(
      (c) => c.type === 'ban' && c.status === 'active' && c.duration
    )
    if (!cases || cases.length <= 0) return
    for (const ban of cases) {
      if (ban && new Date(ban.duration).getTime() < Date.now()) {
        const guild = await this.client.guilds.get(
          this.client.config.main_guild
        )
        guild.unbanMember(ban.userID, 'Automatic Unban')
        const user = await this.client.getRESTUser(ban.userID)
        await this.client.cases.edit(
          this.client.config.main_guild,
          ban.caseID,
          'Automatic Unban',
          'inactive',
          true
        )
        await this.client.emit(
          'moderationLog',
          ban.caseID,
          'Member Unbanned',
          { guild, user: user || null },
          this.client.user,
          new Date(),
          'Automatic Unban'
        )
        return
      } else if (ban)
        this.mute(
          ban.duration,
          this.client.config.main_guild,
          ban.caseID,
          ban.userID
        )
      continue
    }
  }

  async mute(duration: Date, guildID: string, caseID: number, userID: string) {
    schedule.scheduleJob(duration, async (time) => {
      const guild = await this.client.guilds.get(guildID)
      const member = await guild.members.get(userID)
      if (!member) return
      if (member.roles.includes(this.client.config.roles.mute_role))
        await member.removeRole(this.client.config.roles.mute_role)
      await this.client.cases.edit(
        guildID,
        caseID,
        'Automatic Unmute',
        'inactive',
        true
      )
      return this.client.emit(
        'moderationLog',
        caseID,
        'Member Unmuted',
        member,
        this.client.user,
        new Date(),
        'Automatic Unmute'
      )
    })
  }

  async startMutes() {
    let cases = await this.client.cases.get(this.client.config.main_guild)
    if (!cases || !Array.isArray(cases) || cases.length <= 0) return
    cases = await cases.filter(
      (c) => c.type === 'mute' && c.status === 'active' && c.duration
    )
    if (!cases || cases.length <= 0) return
    for (const mute of cases) {
      if (mute && new Date(mute.duration).getTime() < Date.now()) {
        const guild = await this.client.guilds.get(
          this.client.config.main_guild
        )
        const member = await guild.members.get(mute.userID)
        if (!member) return
        if (member.roles.includes(this.client.config.roles.mute_role))
          member.removeRole(this.client.config.roles.mute_role)
        await this.client.cases.edit(
          this.client.config.main_guild,
          mute.caseID,
          'Automatic Unmute',
          'inactive',
          true
        )
        await this.client.emit(
          'moderationLog',
          mute.caseID,
          'Member Unmuted',
          member,
          this.client.user,
          new Date(),
          'Automatic Unmute'
        )
        return
      } else if (mute)
        this.mute(
          mute.duration,
          this.client.config.main_guild,
          mute.caseID,
          mute.userID
        )
      continue
    }
  }

  moderator(msg: Message) {
    const guild = this.client.guilds.get(msg.guildID)
    const member = guild.members.get(msg.author.id)
    if (member.permission.has('administrator')) return null
    else if (member.roles.includes(this.client.config.roles.mod_role))
      return null
    else return 'Moderator Role'
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }

  getUserFromMention(mention: string) {
    const matches = mention.match(/^<@!?(\d+)>$/)
    if (!matches) {
      const isID = this.isSnowflake(mention) || undefined
      if (isID) return this.client.users.get(mention)
      else return undefined
    }
    const id = matches[1]
    return this.client.users.get(id)
  }
}

export default Functions
