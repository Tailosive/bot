'use strict'

const { Command } = require('quartz')
// const db = require('quick.db')

class Delete extends Command {
  constructor (client) {
    super(client, {
      name: 'delete'
    })
  }

  async run (msg, args) {
    // if (msg.author.id !== '392347814413467655') return
    // if (!args.db || !args.string) return msg.embed('Beep Boop...... Gimmie the args boi | **Tailosive Database**')
    // const table = new db.table(args.db) // eslint-disable-line
    // await table.delete(args.string)
    // return msg.embed('Done Boss :white_check_mark: | **Tailosive Database**')
  }
}

module.exports = Delete
