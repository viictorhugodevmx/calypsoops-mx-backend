import { Request, Response } from 'express';

import { Instrument } from '../instruments/instrument.model';
import { Trade } from '../trades/trade.model';
import { ReconciliationRun } from '../reconciliation/reconciliation-run.model';
import { RiskLimit } from '../risk/risk-limit.model';
import { ComplianceLog } from '../compliance/compliance-log.model';
import { WorkbenchTask } from '../workbench/workbench-task.model';
import { Report } from '../reports/report.model';

export const getDashboardSummary = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalInstruments,
      activeInstruments,
      totalTrades,
      capturedTrades,
      validatedTrades,
      settledTrades,
      rejectedTrades,
      latestReconciliationRun,
      totalRiskLimits,
      activeRiskLimits,
      failedComplianceLogs,
      criticalComplianceLogs,
      openWorkbenchTasks,
      criticalWorkbenchTasks,
      generatedReports,
      pendingReports,
    ] = await Promise.all([
      Instrument.countDocuments(),
      Instrument.countDocuments({ status: 'ACTIVE' }),

      Trade.countDocuments(),
      Trade.countDocuments({ status: 'CAPTURED' }),
      Trade.countDocuments({ status: 'VALIDATED' }),
      Trade.countDocuments({ status: 'SETTLED' }),
      Trade.countDocuments({ status: 'REJECTED' }),

      ReconciliationRun.findOne().sort({ runDate: -1 }),

      RiskLimit.countDocuments(),
      RiskLimit.countDocuments({ status: 'ACTIVE' }),

      ComplianceLog.countDocuments({ result: 'FAILED' }),
      ComplianceLog.countDocuments({ severity: 'CRITICAL' }),

      WorkbenchTask.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
      WorkbenchTask.countDocuments({ priority: 'CRITICAL' }),

      Report.countDocuments({ status: 'GENERATED' }),
      Report.countDocuments({ status: 'PENDING' }),
    ]);

    const latestReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const latestComplianceLogs = await ComplianceLog.find()
      .populate({
        path: 'trade',
        populate: {
          path: 'instrument',
        },
      })
      .sort({ evaluatedAt: -1 })
      .limit(5);

    const latestWorkbenchTasks = await WorkbenchTask.find()
      .sort({ dueDate: 1 })
      .limit(5);

    const summary = {
      instruments: {
        total: totalInstruments,
        active: activeInstruments,
      },
      trades: {
        total: totalTrades,
        captured: capturedTrades,
        validated: validatedTrades,
        settled: settledTrades,
        rejected: rejectedTrades,
      },
      reconciliation: {
        latestRunId: latestReconciliationRun?.id || null,
        totalItems: latestReconciliationRun?.totalItems || 0,
        matchedItems: latestReconciliationRun?.matchedItems || 0,
        breakItems: latestReconciliationRun?.breakItems || 0,
        runDate: latestReconciliationRun?.runDate || null,
      },
      risk: {
        totalLimits: totalRiskLimits,
        activeLimits: activeRiskLimits,
      },
      compliance: {
        failedLogs: failedComplianceLogs,
        criticalLogs: criticalComplianceLogs,
      },
      workbench: {
        activeTasks: openWorkbenchTasks,
        criticalTasks: criticalWorkbenchTasks,
      },
      reports: {
        generated: generatedReports,
        pending: pendingReports,
      },
    };

    res.status(200).json({
      success: true,
      summary,
      latest: {
        reports: latestReports,
        complianceLogs: latestComplianceLogs,
        workbenchTasks: latestWorkbenchTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error,
    });
  }
};