import mongoose, { Schema, Document } from 'mongoose';

export type ReportType =
  | 'BANXICO_REPORT'
  | 'EOD_POSITION'
  | 'INDEVAL_BREAKS'
  | 'RISK_BREACHES'
  | 'COMPLIANCE_LOGS';

export type ReportStatus = 'PENDING' | 'GENERATED' | 'FAILED';

export interface IReport extends Document {
  reportId: string;
  type: ReportType;
  name: string;
  status: ReportStatus;
  businessDate: Date;
  generatedAt?: Date;
  generatedBy: string;
  format: 'CSV' | 'XLSX' | 'PDF';
  recordsCount: number;
  fileName: string;
  message: string;
  metadata: Record<string, unknown>;
}

const reportSchema = new Schema<IReport>(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'BANXICO_REPORT',
        'EOD_POSITION',
        'INDEVAL_BREAKS',
        'RISK_BREACHES',
        'COMPLIANCE_LOGS',
      ],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'GENERATED', 'FAILED'],
      default: 'PENDING',
    },
    businessDate: {
      type: Date,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: null,
    },
    generatedBy: {
      type: String,
      required: true,
      default: 'Report Engine',
    },
    format: {
      type: String,
      enum: ['CSV', 'XLSX', 'PDF'],
      default: 'CSV',
    },
    recordsCount: {
      type: Number,
      default: 0,
    },
    fileName: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);