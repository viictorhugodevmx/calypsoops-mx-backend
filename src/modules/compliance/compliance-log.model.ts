import mongoose, { Schema, Document, Types } from 'mongoose';

export type ComplianceRuleCode =
  | 'NO_SHORT_SELL'
  | 'COUNTERPARTY_LIMIT'
  | 'VALUE_DATE_VALIDATION'
  | 'COLLATERAL_SUFFICIENCY'
  | 'EQUIVALENT_RATING';

export type ComplianceResult = 'PASSED' | 'WARNING' | 'FAILED';

export type ComplianceSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IComplianceLog extends Document {
  trade: Types.ObjectId;
  ruleCode: ComplianceRuleCode;
  ruleName: string;
  result: ComplianceResult;
  severity: ComplianceSeverity;
  message: string;
  evaluatedAt: Date;
  evaluatedBy: string;
  metadata: Record<string, unknown>;
}

const complianceLogSchema = new Schema<IComplianceLog>(
  {
    trade: {
      type: Schema.Types.ObjectId,
      ref: 'Trade',
      required: true,
    },
    ruleCode: {
      type: String,
      enum: [
        'NO_SHORT_SELL',
        'COUNTERPARTY_LIMIT',
        'VALUE_DATE_VALIDATION',
        'COLLATERAL_SUFFICIENCY',
        'EQUIVALENT_RATING',
      ],
      required: true,
    },
    ruleName: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      type: String,
      enum: ['PASSED', 'WARNING', 'FAILED'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    evaluatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    evaluatedBy: {
      type: String,
      required: true,
      default: 'Compliance Engine',
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

export const ComplianceLog = mongoose.model<IComplianceLog>(
  'ComplianceLog',
  complianceLogSchema
);