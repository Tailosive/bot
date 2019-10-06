'use strict'

const { Command } = require('quartz')

class Delete extends Command {
  constructor (client) {
    super(client, {
      name: 'mods'
    })
  }

  run (msg, args) {
    // if (msg.author.id !== '392347814413467655') return
    // if (!args.action || !args.member) return msg.embed('Beep Boop...... Gimmie the args boi | **Tailosive Database**')
    // const table = new db.table('mods') // eslint-disable-line
    // if (args.action === 'add' && args.action !== 'null') table.set(`${args.member.id}`, true)
    // else if (args.action === 'remove' && args.action !== 'null') table.delete(`${args.member.id}`)
    // else if (args.action === 'list') {
    //   const data = table.all()
    //   let string = '**Moderators**\n'
    //   for (const mod in data) {
    //     const user = this.client.users.get(data[mod].ID)
    //     string += `${this.client.functions.escapeRegex(user.username)}\n`
    //   }
    //   return msg.embed(string, { delete: false })
    // }
    // return msg.embed('Done Boss :white_check_mark: | **Tailosive Database**')
  }
}

module.exports = Delete
