import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoutes from './modules/health/health.routes';
import instrumentRoutes from './modules/instruments/instrument.routes';
import tradeRoutes from './modules/trades/trade.routes';
import reconciliationRoutes from './modules/reconciliation/reconciliation.routes';
import riskRoutes from './modules/risk/risk.routes';
import complianceRoutes from './modules/compliance/compliance.routes';
import workbenchRoutes from './modules/workbench/workbench.routes';
import reportRoutes from './modules/reports/report.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CalypsoOps MX API is running',
    docs: '/api/health',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/workbench', workbenchRoutes);
app.use('/api/reports', reportRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;