import { connectDatabase } from '../config/database';
import { seedInstruments } from '../modules/instruments/instrument.seed';
import { seedTrades } from '../modules/trades/trade.seed';
import { seedReconciliationPositions } from '../modules/reconciliation/reconciliation.seed';
import { seedRiskLimits } from '../modules/risk/risk.seed';
import { seedComplianceLogs } from '../modules/compliance/compliance.seed';
import { seedWorkbenchTasks } from '../modules/workbench/workbench.seed';
import { seedReports } from '../modules/reports/report.seed';
import mongoose from 'mongoose';

const runSeed = async (): Promise<void> => {
  try {
    console.log('Starting CalypsoOps MX global seed...');

    await connectDatabase();

    const instruments = await seedInstruments();
    console.log(`Instruments seeded: ${instruments}`);

    const trades = await seedTrades();
    console.log(`Trades seeded: ${trades}`);

    const positions = await seedReconciliationPositions();
    console.log(`Reconciliation positions seeded: ${positions}`);

    const riskLimits = await seedRiskLimits();
    console.log(`Risk limits seeded: ${riskLimits}`);

    const complianceLogs = await seedComplianceLogs();
    console.log(`Compliance logs seeded: ${complianceLogs}`);

    const workbenchTasks = await seedWorkbenchTasks();
    console.log(`Workbench tasks seeded: ${workbenchTasks}`);

    const reports = await seedReports();
    console.log(`Reports seeded: ${reports}`);

    console.log('CalypsoOps MX global seed completed successfully.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('CalypsoOps MX global seed failed:', error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeed();