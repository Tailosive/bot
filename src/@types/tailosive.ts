import { Client } from '@points.city/quartz'
import {
  CasesDatabase,
  ModDatabase,
  NicknameDatabase
} from '../structures/Database'
import Functions from '../structures/Functions'

export interface Config {
  prefix: string
  owner: string
  main_guild: string
  roles: {
    entry_role: string
    mod_role: string
    mute_role: string
    trusted_role: string
    donator_role: string
    donator_roles: string[]
  }
  channels: {
    public_channel: string
    log_channel: string
    message_channel: string
    member_channel: string
    nickname_channel: string
    bot_channel: string
    notification_channel: string
    entry_channel: string
    entry_log_channel: string
  }
  embed: {
    icon: string
    text: string
    color: string
  }
  url: string
  callbackURL: string
}

export interface TailosiveClient extends Client {
  functions?: Functions
  invites?: any
  config?: Config
  cases?: CasesDatabase
  nicknames?: NicknameDatabase
  mods?: ModDatabase
}
