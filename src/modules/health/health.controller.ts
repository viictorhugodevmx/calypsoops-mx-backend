import { Request, Response } from 'express';
import { env } from '../../config/env';
import { getDatabaseStatus } from '../../config/database';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    service: 'CalypsoOps MX Backend',
    context: 'Mercado de Dinero / Mercado de Deuda gubernamental mexicana',
    version: '1.0.0',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
    modulesPlanned: [
      'Instruments',
      'Trades',
      'Reconciliation INDEVAL',
      'Risk Limits',
      'Compliance Logs',
      'Workbench',
      'Reports',
    ],
  });
};