import { Request, Response } from 'express';
import { ComplianceLog } from './compliance-log.model';
import { seedComplianceLogs } from './compliance.seed';

const complianceRules = [
  {
    code: 'NO_SHORT_SELL',
    name: 'Restricción de ventas en directo cortas',
    description:
      'Evita que se registre una venta si la posición disponible no cubre el nominal solicitado.',
    scope: 'Front Office / Compliance',
  },
  {
    code: 'COUNTERPARTY_LIMIT',
    name: 'Validación de límite por contraparte',
    description:
      'Verifica que la exposición acumulada contra una contraparte no exceda el límite permitido.',
    scope: 'Middle Office / Risk',
  },
  {
    code: 'VALUE_DATE_VALIDATION',
    name: 'Validación de fecha valor',
    description:
      'Valida que la fecha valor y liquidación sean consistentes con la operación.',
    scope: 'Back Office',
  },
  {
    code: 'COLLATERAL_SUFFICIENCY',
    name: 'Validación de colateral suficiente',
    description:
      'Verifica que una operación repo o reverse repo tenga colateral suficiente.',
    scope: 'Collateral / Back Office',
  },
  {
    code: 'EQUIVALENT_RATING',
    name: 'Validación de rating equivalente',
    description:
      'Homologa ratings externos a una escala interna de riesgo.',
    scope: 'Risk / Compliance',
  },
];

export const runComplianceSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedComplianceLogs();

    res.status(201).json({
      success: true,
      message: 'Compliance logs seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error running compliance seed',
      error,
    });
  }
};

export const getComplianceLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { result, severity, ruleCode, search } = req.query;

    const filters: Record<string, unknown> = {};

    if (result) {
      filters.result = result;
    }

    if (severity) {
      filters.severity = severity;
    }

    if (ruleCode) {
      filters.ruleCode = ruleCode;
    }

    if (search) {
      filters.$or = [
        { ruleName: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { evaluatedBy: { $regex: search, $options: 'i' } },
      ];
    }

    const logs = await ComplianceLog.find(filters)
      .populate({
        path: 'trade',
        populate: {
          path: 'instrument',
        },
      })
      .sort({ evaluatedAt: -1 });

    const summary = {
      total: logs.length,
      passed: logs.filter((item) => item.result === 'PASSED').length,
      warning: logs.filter((item) => item.result === 'WARNING').length,
      failed: logs.filter((item) => item.result === 'FAILED').length,
      critical: logs.filter((item) => item.severity === 'CRITICAL').length,
    };

    res.status(200).json({
      success: true,
      summary,
      items: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance logs',
      error,
    });
  }
};

export const getComplianceLogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const log = await ComplianceLog.findById(req.params.id).populate({
      path: 'trade',
      populate: {
        path: 'instrument',
      },
    });

    if (!log) {
      res.status(404).json({
        success: false,
        message: 'Compliance log not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance log detail',
      error,
    });
  }
};

export const getComplianceRules = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    total: complianceRules.length,
    items: complianceRules,
  });
};