import 'dotenv/config'

import { Client } from '@points.city/quartz'
import { Collection } from 'eris'
import mongoose from 'mongoose'
import path from 'path'
import Functions from './structures/Functions'
import {
  CasesDatabase,
  ModDatabase,
  NicknameDatabase
} from './structures/Database'
import config from './config.json'
import { TailosiveClient } from './@types/tailosive'
import Utils from './utils'

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
  .catch((error) => console.log(error))

mongoose.set('useFindAndModify', false)

const client: TailosiveClient = new Client(process.env.TOKEN, {
  owner: config.owner,
  eventHandler: {
    directory:
      process.env.NODE_ENV === 'production'
        ? path.resolve('./bin/events')
        : path.resolve('./src/events')
  },
  commandHandler: {
    directory:
      process.env.NODE_ENV === 'production'
        ? path.resolve('./bin/commands')
        : path.resolve('./src/commands'),
    prefix: config.prefix,
    color: config.embed.color,
    text: config.embed.text,
    logo: config.embed.icon
  },
  eris: {
    getAllUsers: false,
    compress: false,
    intents: [
      'guildMembers',
      'directMessages',
      'guildBans',
      'guildEmojis',
      'guildInvites',
      'guildMessageReactions',
      'guildMessages',
      'guilds',
      'guildIntegrations',
      'guildWebhooks'
    ],
    restMode: true,
    messageLimit: 5
  }
})

client.functions = new Functions(client)
client.config = config
client.invites = new Collection(undefined as any)
client.cases = new CasesDatabase()
client.nicknames = new NicknameDatabase()
client.mods = new ModDatabase()
client.utils = new Utils(client)
client.start()
