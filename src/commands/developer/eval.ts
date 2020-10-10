import { Command, CommandContext } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

const clean = (text: string) => {
  if (typeof text === 'string')
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
  else return text
}

class Eval extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'eval',
      ownerOnly: true
    })
  }

  async run(context: CommandContext) {
    try {
      const code = context.arguments.join(' ')
      let evaled = await eval(code)
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
      context.message.channel.createMessage({
        embed: { description: `\`\`\`xl\n${clean(evaled)}\n\`\`\`` }
      })
    } catch (err) {
      context.message.channel.createMessage({
        embed: { description: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` }
      })
    }
  }
}

export default Eval
