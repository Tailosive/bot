import { Schema, model, Document, Model } from 'mongoose'

export interface NicknameDocument extends Document {
  userID: string
  guildID: string
  msgID: string
  nickname: string
}

export type NicknameModel = NicknameDocument

const nicknameSchema: Schema = new Schema({
  guildID: { type: String, required: true },
  msgID: { type: String, required: true },
  userID: { type: String, required: true },
  nickname: { type: String }
})

nicknameSchema.index({
  guildID: 1,
  msgID: 1
})

export const Nickname: Model<NicknameModel> = model('nicknames', nicknameSchema)
