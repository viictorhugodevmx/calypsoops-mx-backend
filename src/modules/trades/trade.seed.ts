import { Instrument } from '../instruments/instrument.model';
import { Trade } from './trade.model';

export const seedTrades = async () => {
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

  const trades = [
    {
      tradeId: 'TRD-2026-0001',
      instrument: cetes._id,
      type: 'BUY',
      counterparty: 'Banco Demo MX',
      nominalAmount: 1000000,
      price: 9.75,
      rate: 10.85,
      tradeDate: new Date('2026-04-01'),
      valueDate: new Date('2026-04-02'),
      settlementDate: new Date('2026-04-02'),
      trader: 'Front Office User 01',
      status: 'SETTLED',
      desk: 'Money Market',
      comments: 'Compra primaria simulada de CETES',
    },
    {
      tradeId: 'TRD-2026-0002',
      instrument: bonosM._id,
      type: 'SELL',
      counterparty: 'Casa de Bolsa Demo',
      nominalAmount: 500000,
      price: 98.45,
      rate: 9.65,
      tradeDate: new Date('2026-04-03'),
      valueDate: new Date('2026-04-04'),
      settlementDate: new Date('2026-04-04'),
      trader: 'Front Office User 02',
      status: 'VALIDATED',
      desk: 'Debt Desk',
      comments: 'Venta simulada de Bono M',
    },
    {
      tradeId: 'TRD-2026-0003',
      instrument: udibono._id,
      type: 'BUY',
      counterparty: 'Aseguradora Demo',
      nominalAmount: 750000,
      price: 101.2,
      rate: 4.75,
      tradeDate: new Date('2026-04-04'),
      valueDate: new Date('2026-04-05'),
      settlementDate: new Date('2026-04-05'),
      trader: 'Front Office User 03',
      status: 'CAPTURED',
      desk: 'Inflation Linked Desk',
      comments: 'Compra de UDIBONO pendiente de validación',
    },
    {
      tradeId: 'TRD-2026-0004',
      instrument: bondesF._id,
      type: 'REPO',
      counterparty: 'Banco Contraparte Repo',
      nominalAmount: 1200000,
      price: 100.01,
      rate: 10.15,
      tradeDate: new Date('2026-04-05'),
      valueDate: new Date('2026-04-06'),
      settlementDate: new Date('2026-04-06'),
      trader: 'Repo Trader 01',
      status: 'SETTLED',
      desk: 'Repo Desk',
      comments: 'Repo simulado con BONDES F',
    },
    {
      tradeId: 'TRD-2026-0005',
      instrument: bpa._id,
      type: 'REVERSE_REPO',
      counterparty: 'Banco Liquidez Demo',
      nominalAmount: 900000,
      price: 99.8,
      rate: 10.05,
      tradeDate: new Date('2026-04-06'),
      valueDate: new Date('2026-04-07'),
      settlementDate: new Date('2026-04-07'),
      trader: 'Repo Trader 02',
      status: 'REJECTED',
      desk: 'Repo Desk',
      comments: 'Reverse repo rechazado por validación simulada',
    },
  ];

  await Trade.deleteMany({});
  await Trade.insertMany(trades);

  return trades.length;
};