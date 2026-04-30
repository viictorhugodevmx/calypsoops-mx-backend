import mongoose, { Schema, Document, Types } from 'mongoose';

export type RiskLimitType =
  | 'INSTRUMENT'
  | 'INSTRUMENT_TYPE'
  | 'COUNTERPARTY'
  | 'DESK';

export type RiskLimitStatus = 'ACTIVE' | 'INACTIVE';

export interface IRiskLimit extends Document {
  code: string;
  name: string;
  type: RiskLimitType;
  instrument?: Types.ObjectId;
  instrumentType?: string;
  counterparty?: string;
  desk?: string;
  maxNominalAmount: number;
  warningThresholdPercent: number;
  status: RiskLimitStatus;
}

const riskLimitSchema = new Schema<IRiskLimit>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['INSTRUMENT', 'INSTRUMENT_TYPE', 'COUNTERPARTY', 'DESK'],
      required: true,
    },
    instrument: {
      type: Schema.Types.ObjectId,
      ref: 'Instrument',
      default: null,
    },
    instrumentType: {
      type: String,
      default: '',
    },
    counterparty: {
      type: String,
      default: '',
    },
    desk: {
      type: String,
      default: '',
    },
    maxNominalAmount: {
      type: Number,
      required: true,
    },
    warningThresholdPercent: {
      type: Number,
      required: true,
      default: 80,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

export const RiskLimit = mongoose.model<IRiskLimit>(
  'RiskLimit',
  riskLimitSchema
);