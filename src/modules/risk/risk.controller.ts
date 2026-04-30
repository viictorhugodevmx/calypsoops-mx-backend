import { Request, Response } from 'express';
import { Trade } from '../trades/trade.model';
import { RiskLimit } from './risk-limit.model';
import { seedRiskLimits } from './risk.seed';

type ExposureStatus = 'OK' | 'WARNING' | 'BREACHED';

interface ExposureItem {
  limitId: string;
  code: string;
  name: string;
  type: string;
  currentExposure: number;
  maxNominalAmount: number;
  usagePercent: number;
  status: ExposureStatus;
}

const getExposureStatus = (
  currentExposure: number,
  maxNominalAmount: number,
  warningThresholdPercent: number
): ExposureStatus => {
  const usagePercent = (currentExposure / maxNominalAmount) * 100;

  if (usagePercent > 100) {
    return 'BREACHED';
  }

  if (usagePercent >= warningThresholdPercent) {
    return 'WARNING';
  }

  return 'OK';
};

const roundTwo = (value: number): number => Number(value.toFixed(2));

export const runRiskSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedRiskLimits();

    res.status(201).json({
      success: true,
      message: 'Risk limits seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Error running risk seed',
      error,
    });
  }
};

export const getRiskLimits = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const limits = await RiskLimit.find()
      .populate('instrument')
      .sort({ type: 1, code: 1 });

    res.status(200).json({
      success: true,
      total: limits.length,
      items: limits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching risk limits',
      error,
    });
  }
};

export const getRiskExposure = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const limits = await RiskLimit.find({ status: 'ACTIVE' }).populate(
      'instrument'
    );

    const trades = await Trade.find().populate('instrument');

    const items: ExposureItem[] = limits.map((limit) => {
      let currentExposure = 0;

      if (limit.type === 'INSTRUMENT' && limit.instrument) {
        currentExposure = trades
          .filter(
            (trade) =>
              trade.instrument &&
              trade.instrument._id.toString() === limit.instrument?.toString()
          )
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'INSTRUMENT_TYPE' && limit.instrumentType) {
        currentExposure = trades
          .filter((trade) => {
            const instrument = trade.instrument as any;
            return instrument?.type === limit.instrumentType;
          })
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'COUNTERPARTY' && limit.counterparty) {
        currentExposure = trades
          .filter((trade) => trade.counterparty === limit.counterparty)
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'DESK' && limit.desk) {
        currentExposure = trades
          .filter((trade) => trade.desk === limit.desk)
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      const usagePercent = roundTwo(
        (currentExposure / limit.maxNominalAmount) * 100
      );

      return {
        limitId: limit.id,
        code: limit.code,
        name: limit.name,
        type: limit.type,
        currentExposure,
        maxNominalAmount: limit.maxNominalAmount,
        usagePercent,
        status: getExposureStatus(
          currentExposure,
          limit.maxNominalAmount,
          limit.warningThresholdPercent
        ),
      };
    });

    const summary = {
      totalLimits: items.length,
      ok: items.filter((item) => item.status === 'OK').length,
      warning: items.filter((item) => item.status === 'WARNING').length,
      breached: items.filter((item) => item.status === 'BREACHED').length,
    };

    res.status(200).json({
      success: true,
      summary,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating risk exposure',
      error,
    });
  }
};

export const getRiskBreaches = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const limits = await RiskLimit.find({ status: 'ACTIVE' }).populate(
      'instrument'
    );

    const trades = await Trade.find().populate('instrument');

    const items: ExposureItem[] = limits.map((limit) => {
      let currentExposure = 0;

      if (limit.type === 'INSTRUMENT' && limit.instrument) {
        currentExposure = trades
          .filter(
            (trade) =>
              trade.instrument &&
              trade.instrument._id.toString() === limit.instrument?.toString()
          )
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'INSTRUMENT_TYPE' && limit.instrumentType) {
        currentExposure = trades
          .filter((trade) => {
            const instrument = trade.instrument as any;
            return instrument?.type === limit.instrumentType;
          })
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'COUNTERPARTY' && limit.counterparty) {
        currentExposure = trades
          .filter((trade) => trade.counterparty === limit.counterparty)
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      if (limit.type === 'DESK' && limit.desk) {
        currentExposure = trades
          .filter((trade) => trade.desk === limit.desk)
          .reduce((sum, trade) => sum + trade.nominalAmount, 0);
      }

      const usagePercent = roundTwo(
        (currentExposure / limit.maxNominalAmount) * 100
      );

      return {
        limitId: limit.id,
        code: limit.code,
        name: limit.name,
        type: limit.type,
        currentExposure,
        maxNominalAmount: limit.maxNominalAmount,
        usagePercent,
        status: getExposureStatus(
          currentExposure,
          limit.maxNominalAmount,
          limit.warningThresholdPercent
        ),
      };
    });

    const breaches = items.filter((item) => item.status === 'BREACHED');

    res.status(200).json({
      success: true,
      total: breaches.length,
      items: breaches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching risk breaches',
      error,
    });
  }
};