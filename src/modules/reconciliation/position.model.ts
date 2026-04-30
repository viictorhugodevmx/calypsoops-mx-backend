import mongoose, { Schema, Document, Types } from 'mongoose';

export type PositionSource = 'CALYPSO' | 'INDEVAL';

export interface IPosition extends Document {
  source: PositionSource;
  instrument: Types.ObjectId;
  isin: string;
  nominalAmount: number;
  valuationAmount: number;
  positionDate: Date;
}

const positionSchema = new Schema<IPosition>(
  {
    source: {
      type: String,
      enum: ['CALYPSO', 'INDEVAL'],
      required: true,
    },
    instrument: {
      type: Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true,
    },
    isin: {
      type: String,
      required: true,
      trim: true,
    },
    nominalAmount: {
      type: Number,
      required: true,
    },
    valuationAmount: {
      type: Number,
      required: true,
    },
    positionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Position = mongoose.model<IPosition>('Position', positionSchema);