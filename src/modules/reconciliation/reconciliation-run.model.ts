import mongoose, { Schema, Document, Types } from 'mongoose';

export type ReconciliationStatus = 'MATCHED' | 'BREAK';
export type BreakReviewStatus = 'OPEN' | 'REVIEWED';

export interface IReconciliationBreak {
  _id?: Types.ObjectId;
  instrument: Types.ObjectId;
  isin: string;
  calypsoNominal: number;
  indevalNominal: number;
  nominalDifference: number;
  calypsoValuation: number;
  indevalValuation: number;
  valuationDifference: number;
  status: ReconciliationStatus;
  reviewStatus: BreakReviewStatus;
  analystComment?: string;
}

export interface IReconciliationRun extends Document {
  runDate: Date;
  positionDate: Date;
  totalItems: number;
  matchedItems: number;
  breakItems: number;
  breaks: IReconciliationBreak[];
}

const reconciliationBreakSchema = new Schema<IReconciliationBreak>(
  {
    instrument: {
      type: Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true,
    },
    isin: {
      type: String,
      required: true,
    },
    calypsoNominal: {
      type: Number,
      required: true,
    },
    indevalNominal: {
      type: Number,
      required: true,
    },
    nominalDifference: {
      type: Number,
      required: true,
    },
    calypsoValuation: {
      type: Number,
      required: true,
    },
    indevalValuation: {
      type: Number,
      required: true,
    },
    valuationDifference: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['MATCHED', 'BREAK'],
      required: true,
    },
    reviewStatus: {
      type: String,
      enum: ['OPEN', 'REVIEWED'],
      default: 'OPEN',
    },
    analystComment: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const reconciliationRunSchema = new Schema<IReconciliationRun>(
  {
    runDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    positionDate: {
      type: Date,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    matchedItems: {
      type: Number,
      required: true,
    },
    breakItems: {
      type: Number,
      required: true,
    },
    breaks: [reconciliationBreakSchema],
  },
  {
    timestamps: true,
  }
);

export const ReconciliationRun = mongoose.model<IReconciliationRun>(
  'ReconciliationRun',
  reconciliationRunSchema
);