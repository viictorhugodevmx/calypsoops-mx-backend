import { Trade } from '../trades/trade.model';
import { ComplianceLog } from './compliance-log.model';

export const seedComplianceLogs = async () => {
  const trades = await Trade.find().populate('instrument');

  if (!trades.length) {
    throw new Error('No trades found. Run trades seed first.');
  }

  const buyTrade = trades.find((trade) => trade.type === 'BUY');
  const sellTrade = trades.find((trade) => trade.type === 'SELL');
  const repoTrade = trades.find((trade) => trade.type === 'REPO');
  const reverseRepoTrade = trades.find(
    (trade) => trade.type === 'REVERSE_REPO'
  );

  if (!buyTrade || !sellTrade || !repoTrade || !reverseRepoTrade) {
    throw new Error('Required trades not found. Run trades seed first.');
  }

  const logs = [
    {
      trade: buyTrade._id,
      ruleCode: 'VALUE_DATE_VALIDATION',
      ruleName: 'Validación de fecha valor',
      result: 'PASSED',
      severity: 'LOW',
      message: 'La fecha valor es válida para la operación.',
      evaluatedAt: new Date('2026-04-30T09:10:00.000Z'),
      evaluatedBy: 'Compliance Engine',
      metadata: {
        tradeId: buyTrade.tradeId,
        valueDate: buyTrade.valueDate,
        settlementDate: buyTrade.settlementDate,
      },
    },
    {
      trade: sellTrade._id,
      ruleCode: 'NO_SHORT_SELL',
      ruleName: 'Restricción de ventas en directo cortas',
      result: 'FAILED',
      severity: 'CRITICAL',
      message:
        'La venta fue marcada como posible venta corta por posición insuficiente.',
      evaluatedAt: new Date('2026-04-30T09:15:00.000Z'),
      evaluatedBy: 'Compliance Engine',
      metadata: {
        tradeId: sellTrade.tradeId,
        requestedNominal: sellTrade.nominalAmount,
        availablePosition: 450000,
        difference: 50000,
      },
    },
    {
      trade: repoTrade._id,
      ruleCode: 'COLLATERAL_SUFFICIENCY',
      ruleName: 'Validación de colateral suficiente',
      result: 'WARNING',
      severity: 'HIGH',
      message:
        'El colateral cubre la operación, pero se encuentra cerca del umbral mínimo.',
      evaluatedAt: new Date('2026-04-30T09:20:00.000Z'),
      evaluatedBy: 'Compliance Engine',
      metadata: {
        tradeId: repoTrade.tradeId,
        collateralValue: 1220000,
        requiredCollateral: 1200000,
        marginPercent: 1.67,
      },
    },
    {
      trade: reverseRepoTrade._id,
      ruleCode: 'COUNTERPARTY_LIMIT',
      ruleName: 'Validación de límite por contraparte',
      result: 'FAILED',
      severity: 'HIGH',
      message:
        'La contraparte excede el límite nominal permitido para la operación.',
      evaluatedAt: new Date('2026-04-30T09:25:00.000Z'),
      evaluatedBy: 'Compliance Engine',
      metadata: {
        tradeId: reverseRepoTrade.tradeId,
        counterparty: reverseRepoTrade.counterparty,
        currentExposure: 900000,
        maxAllowed: 800000,
      },
    },
    {
      trade: buyTrade._id,
      ruleCode: 'EQUIVALENT_RATING',
      ruleName: 'Validación de rating equivalente',
      result: 'PASSED',
      severity: 'MEDIUM',
      message: 'El rating equivalente fue homologado correctamente.',
      evaluatedAt: new Date('2026-04-30T09:30:00.000Z'),
      evaluatedBy: 'Compliance Engine',
      metadata: {
        tradeId: buyTrade.tradeId,
        externalRating: 'mxAAA',
        equivalentRating: 'AAA',
        agency: 'Demo Rating Agency',
      },
    },
  ];

  await ComplianceLog.deleteMany({});
  await ComplianceLog.insertMany(logs);

  return logs.length;
};