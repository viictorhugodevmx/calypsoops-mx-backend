import mongoose, { Schema, Document, Types } from 'mongoose';

export type TradeType = 'BUY' | 'SELL' | 'REPO' | 'REVERSE_REPO';

export type TradeStatus =
  | 'CAPTURED'
  | 'VALIDATED'
  | 'SETTLED'
  | 'REJECTED';

export interface ITrade extends Document {
  tradeId: string;
  instrument: Types.ObjectId;
  type: TradeType;
  counterparty: string;
  nominalAmount: number;
  price: number;
  rate: number;
  tradeDate: Date;
  valueDate: Date;
  settlementDate: Date;
  trader: string;
  status: TradeStatus;
  desk: string;
  comments?: string;
}

const tradeSchema = new Schema<ITrade>(
  {
    tradeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    instrument: {
      type: Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true,
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL', 'REPO', 'REVERSE_REPO'],
      required: true,
    },
    counterparty: {
      type: String,
      required: true,
      trim: true,
    },
    nominalAmount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    tradeDate: {
      type: Date,
      required: true,
    },
    valueDate: {
      type: Date,
      required: true,
    },
    settlementDate: {
      type: Date,
      required: true,
    },
    trader: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['CAPTURED', 'VALIDATED', 'SETTLED', 'REJECTED'],
      default: 'CAPTURED',
    },
    desk: {
      type: String,
      required: true,
      default: 'Money Market',
    },
    comments: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Trade = mongoose.model<ITrade>('Trade', tradeSchema);