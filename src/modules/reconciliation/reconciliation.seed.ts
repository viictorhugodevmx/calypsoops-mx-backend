import { Instrument } from '../instruments/instrument.model';
import { Position } from './position.model';
import { ReconciliationRun } from './reconciliation-run.model';

export const seedReconciliationPositions = async () => {
  const instruments = await Instrument.find();

  if (!instruments.length) {
    throw new Error('No instruments found. Run instruments seed first.');
  }

  const cetes = instruments.find((item) => item.type === 'CETES');
  const bonosM = instruments.find((item) => item.type === 'BONOS_M');
  const udibono = instruments.find((item) => item.type === 'UDIBONOS');
  const bondesF = instruments.find((item) => item.type === 'BONDES_F');
  const bpa = instruments.find((item) => item.type === 'BPAS');

  if (!cetes || !bonosM || !udibono || !bondesF || !bpa) {
    throw new Error('Required instruments not found. Run instruments seed first.');
  }

  await Position.deleteMany({});
  await ReconciliationRun.deleteMany({});

  const positionDate = new Date('2026-04-30');

  const positions = [
    {
      source: 'CALYPSO',
      instrument: cetes._id,
      isin: cetes.isin,
      nominalAmount: 1000000,
      valuationAmount: 975000,
      positionDate,
    },
    {
      source: 'INDEVAL',
      instrument: cetes._id,
      isin: cetes.isin,
      nominalAmount: 1000000,
      valuationAmount: 975000,
      positionDate,
    },
    {
      source: 'CALYPSO',
      instrument: bonosM._id,
      isin: bonosM.isin,
      nominalAmount: 500000,
      valuationAmount: 492250,
      positionDate,
    },
    {
      source: 'INDEVAL',
      instrument: bonosM._id,
      isin: bonosM.isin,
      nominalAmount: 450000,
      valuationAmount: 443025,
      positionDate,
    },
    {
      source: 'CALYPSO',
      instrument: udibono._id,
      isin: udibono.isin,
      nominalAmount: 750000,
      valuationAmount: 759000,
      positionDate,
    },
    {
      source: 'INDEVAL',
      instrument: udibono._id,
      isin: udibono.isin,
      nominalAmount: 750000,
      valuationAmount: 759000,
      positionDate,
    },
    {
      source: 'CALYPSO',
      instrument: bondesF._id,
      isin: bondesF.isin,
      nominalAmount: 1200000,
      valuationAmount: 1200120,
      positionDate,
    },
    {
      source: 'INDEVAL',
      instrument: bondesF._id,
      isin: bondesF.isin,
      nominalAmount: 1200000,
      valuationAmount: 1200120,
      positionDate,
    },
    {
      source: 'CALYPSO',
      instrument: bpa._id,
      isin: bpa.isin,
      nominalAmount: 900000,
      valuationAmount: 898200,
      positionDate,
    },
    {
      source: 'INDEVAL',
      instrument: bpa._id,
      isin: bpa.isin,
      nominalAmount: 880000,
      valuationAmount: 878240,
      positionDate,
    },
  ];

  await Position.insertMany(positions);

  return positions.length;
};