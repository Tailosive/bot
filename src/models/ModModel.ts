import { Schema, model, Document, Model } from 'mongoose'

export interface ModDocument extends Document {
  guildID: string
  moderatorID: string
}

export type ModModel = ModDocument

const modSchema: Schema = new Schema({
  guildID: { type: String, required: true },
  moderatorID: { type: String, required: true }
})

modSchema.index({
  guildID: 1,
  moderatorID: 1
})

export const Mod: Model<ModModel> = model('mods', modSchema)
