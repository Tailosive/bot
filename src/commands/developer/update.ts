import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Update extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'update',
      ownerOnly: true
    })
  }

  async run(context: CommandContext) {
    const members = await context.message.member.guild.members.filter(
      (member) => member.roles.includes(this.client.config.roles.donator_role)
    )
    await members.forEach(async (member) => {
      let keepRole = false
      Promise.all([
        this.client.config.roles.donator_roles.forEach(async (role) => {
          if (member.roles.includes(role)) {
            if (!keepRole) keepRole = false
            else keepRole = true
          }
        })
      ])
      if (!keepRole) {
        await member.removeRole(this.client.config.roles.donator_role)
      }
    })
  }
}

export default Update
