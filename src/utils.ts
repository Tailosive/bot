import { Client } from '@points.city/quartz'
import Eris from 'eris'

class Utils {
  #client: Client

  constructor(client: Client) {
    this.#client = client
  }

  static isUserID(id: string) {
    if (
      !id.match(/^[1-9]\d+$/) ||
      parseInt(id, 10) <
        0b000000000000000000000000000000000000000000_00001_00001_000000000001 ||
      BigInt(id) >
        BigInt(
          '0b1111111111111111111111111111111111111111111111111111111111111111'
        )
    )
      return false
    return true
  }

  resolveUserID(value: string): string {
    if (!value) return undefined
    const mention = value.match(/^<@!?(\d+)>$/)
    if (mention) return mention[1]
    const tag = value.match(/^@?([^#]+)#(\d{4})$/)
    if (tag) {
      const user = this.#client.users.find(
        ({ username, discriminator }) =>
          username === tag[1] && discriminator === tag[2]
      )
      if (user) return user.id
    }
    if (Utils.isUserID(value)) return value
    return undefined
  }

  resolveUser(value: string): Eris.User {
    const id = this.resolveUserID(value)
    if (id) return undefined
    return this.#client.users.get(id) || undefined
  }

  async resolveMember(guild: Eris.Guild, value: string): Promise<Eris.Member> {
    try {
      const id = this.resolveUserID(value)
      if (!id) return undefined
      if (guild.members.has(id)) return guild.members.get(id)
      const member = await this.#client.getRESTGuildMember(guild.id, id)
      return member
    } catch (error) {
      return undefined
    }
  }
}

export default Utils
