import mongoose, { Schema, Document } from 'mongoose';

export type InstrumentType =
  | 'CETES'
  | 'BONOS_M'
  | 'UDIBONOS'
  | 'BONDES_F'
  | 'BPAS';

export type InstrumentStatus = 'ACTIVE' | 'INACTIVE';

export interface IInstrument extends Document {
  clave: string;
  name: string;
  type: InstrumentType;
  isin: string;
  currency: string;
  issueDate: Date;
  maturityDate: Date;
  couponRate: number;
  nominalValue: number;
  status: InstrumentStatus;
}

const instrumentSchema = new Schema<IInstrument>(
  {
    clave: {
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
      enum: ['CETES', 'BONOS_M', 'UDIBONOS', 'BONDES_F', 'BPAS'],
      required: true,
    },
    isin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'MXN',
    },
    issueDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    couponRate: {
      type: Number,
      required: true,
      default: 0,
    },
    nominalValue: {
      type: Number,
      required: true,
      default: 100,
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

export const Instrument = mongoose.model<IInstrument>(
  'Instrument',
  instrumentSchema
);