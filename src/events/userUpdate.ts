import { Event, Embed } from '@points.city/quartz'
import { User } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class UserUpdateListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'userUpdate'
    })
  }

  async run(
    user: User,
    oldUser: {
      username: string
      discriminator: string
      avatar?: string
    }
  ) {
    try {
      if ((user?.username || '') !== (oldUser?.username || '')) {
        const embed = new Embed()
          .setTitle('**Username Changed**')
          .addField(
            'Member',
            `${user.mention} \`${user?.username || ''}#${user.discriminator}\``,
            false
          )
          .addField('Before', `\`${oldUser?.username || ''}\``, true)
          .addField('After', `\`${user?.username || ''}\``, true)
          .setTimestamp(new Date())
          .setThumbnail(user.avatarURL || user.defaultAvatarURL)
          .setColor(0xff00ff)
          .setFooter(
            `ID: ${user.id} | ${this.client.config.embed.text}`,
            this.client.config.embed.icon
          )
        return this.client.createMessage(
          this.client.config.channels.nickname_channel,
          { embed: embed }
        )
      } else if ((user?.avatar || '') !== (oldUser?.avatar || '')) {
        const embed = new Embed()
          .setTitle('**Avatar Changed**')
          .addField(
            'Member',
            `${user?.mention} \`${user?.username}#${user?.discriminator}\``,
            false
          )
          .addField(
            'Old Avatar',
            `[View Old Avatar](${
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${oldUser.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${oldUser.discriminator}.png`
            })`,
            true
          )
          .addField(
            'New Avatar',
            `[View New Avatar](${user.avatarURL || user.defaultAvatarURL})`,
            true
          )
          .setTimestamp(new Date())
          .setImage(user.avatarURL || user.defaultAvatarURL)
          .setColor(0xff00ff)
          .setFooter(
            `ID: ${user.id} | ${this.client.config.embed.text}`,
            this.client.config.embed.icon
          )
        return this.client.createMessage(
          this.client.config.channels.nickname_channel,
          { embed: embed }
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default UserUpdateListener
