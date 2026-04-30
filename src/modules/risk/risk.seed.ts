import { Instrument } from '../instruments/instrument.model';
import { RiskLimit } from './risk-limit.model';

export const seedRiskLimits = async () => {
  const instruments = await Instrument.find();

  if (!instruments.length) {
    throw new Error('No instruments found. Run instruments seed first.');
  }

  const cetes = instruments.find((item) => item.type === 'CETES');
  const bonosM = instruments.find((item) => item.type === 'BONOS_M');

  if (!cetes || !bonosM) {
    throw new Error('Required instruments not found. Run instruments seed first.');
  }

  const limits = [
    {
      code: 'LIM-INST-CETES',
      name: 'Límite nominal para CETES',
      type: 'INSTRUMENT',
      instrument: cetes._id,
      maxNominalAmount: 1500000,
      warningThresholdPercent: 80,
      status: 'ACTIVE',
    },
    {
      code: 'LIM-INST-BONOS-M',
      name: 'Límite nominal para BONOS M',
      type: 'INSTRUMENT',
      instrument: bonosM._id,
      maxNominalAmount: 400000,
      warningThresholdPercent: 80,
      status: 'ACTIVE',
    },
    {
      code: 'LIM-TYPE-UDIBONOS',
      name: 'Límite nominal para UDIBONOS',
      type: 'INSTRUMENT_TYPE',
      instrumentType: 'UDIBONOS',
      maxNominalAmount: 900000,
      warningThresholdPercent: 85,
      status: 'ACTIVE',
    },
    {
      code: 'LIM-CP-BANCO-DEMO',
      name: 'Límite por contraparte Banco Demo MX',
      type: 'COUNTERPARTY',
      counterparty: 'Banco Demo MX',
      maxNominalAmount: 800000,
      warningThresholdPercent: 75,
      status: 'ACTIVE',
    },
    {
      code: 'LIM-DESK-REPO',
      name: 'Límite nominal para Repo Desk',
      type: 'DESK',
      desk: 'Repo Desk',
      maxNominalAmount: 1800000,
      warningThresholdPercent: 80,
      status: 'ACTIVE',
    },
  ];

  await RiskLimit.deleteMany({});
  await RiskLimit.insertMany(limits);

  return limits.length;
};