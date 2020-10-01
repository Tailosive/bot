import { Schema, model, Document, Model } from 'mongoose'

export interface CaseDocument extends Document {
  userID: string
  guildID: string
  caseID: number
  moderatorID: string
  reason?: string
  newReason?: string
  date?: Date
  status?: string
  type?: string
  duration?: Date
}

export type CaseModel = CaseDocument

const caseSchema: Schema = new Schema({
  guildID: { type: String, required: true },
  caseID: { type: Number, required: true },
  userID: { type: String, required: true },
  moderatorID: { type: String, required: true },
  reason: { type: String },
  newReason: { type: String },
  date: { type: Date },
  status: { type: String },
  type: { type: String },
  duration: { type: Date }
})

caseSchema.index({
  guildID: 1,
  caseID: 1
})

export const Case: Model<CaseModel> = model('cases', caseSchema)
