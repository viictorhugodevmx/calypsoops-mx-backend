import mongoose, { Schema, Document } from 'mongoose';

export type WorkbenchTaskType =
  | 'RECONCILIATION_BREAK'
  | 'RISK_BREACH'
  | 'COMPLIANCE_FAILED'
  | 'REPORT_PENDING'
  | 'BACK_OFFICE_REVIEW';

export type WorkbenchTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkbenchTaskStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED';

export interface IWorkbenchComment {
  _id?: mongoose.Types.ObjectId;
  author: string;
  message: string;
  createdAt: Date;
}

export interface IWorkbenchTask extends Document {
  code: string;
  title: string;
  description: string;
  type: WorkbenchTaskType;
  priority: WorkbenchTaskPriority;
  status: WorkbenchTaskStatus;
  assignedTo: string;
  sourceModule: string;
  sourceReference: string;
  dueDate: Date;
  comments: IWorkbenchComment[];
}

const workbenchCommentSchema = new Schema<IWorkbenchComment>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: true }
);

const workbenchTaskSchema = new Schema<IWorkbenchTask>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'RECONCILIATION_BREAK',
        'RISK_BREACH',
        'COMPLIANCE_FAILED',
        'REPORT_PENDING',
        'BACK_OFFICE_REVIEW',
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'OPEN',
    },
    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },
    sourceModule: {
      type: String,
      required: true,
      trim: true,
    },
    sourceReference: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    comments: [workbenchCommentSchema],
  },
  {
    timestamps: true,
  }
);

export const WorkbenchTask = mongoose.model<IWorkbenchTask>(
  'WorkbenchTask',
  workbenchTaskSchema
);