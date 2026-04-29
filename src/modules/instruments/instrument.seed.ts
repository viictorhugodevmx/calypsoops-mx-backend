import { Instrument } from './instrument.model';

export const seedInstruments = async () => {
  const instruments = [
    {
      clave: 'CETES-28-2026',
      name: 'CETES 28 días 2026',
      type: 'CETES',
      isin: 'MX0MGO000001',
      currency: 'MXN',
      issueDate: new Date('2026-01-01'),
      maturityDate: new Date('2026-01-29'),
      couponRate: 0,
      nominalValue: 10,
      status: 'ACTIVE',
    },
    {
      clave: 'BONOS-M-2031',
      name: 'Bono M 2031',
      type: 'BONOS_M',
      isin: 'MX0MGO000002',
      currency: 'MXN',
      issueDate: new Date('2021-06-01'),
      maturityDate: new Date('2031-06-01'),
      couponRate: 7.75,
      nominalValue: 100,
      status: 'ACTIVE',
    },
    {
      clave: 'UDIBONO-2035',
      name: 'UDIBONO 2035',
      type: 'UDIBONOS',
      isin: 'MX0MGO000003',
      currency: 'UDI',
      issueDate: new Date('2025-01-01'),
      maturityDate: new Date('2035-01-01'),
      couponRate: 4.5,
      nominalValue: 100,
      status: 'ACTIVE',
    },
    {
      clave: 'BONDES-F-2029',
      name: 'BONDES F 2029',
      type: 'BONDES_F',
      isin: 'MX0MGO000004',
      currency: 'MXN',
      issueDate: new Date('2024-03-01'),
      maturityDate: new Date('2029-03-01'),
      couponRate: 8.25,
      nominalValue: 100,
      status: 'ACTIVE',
    },
    {
      clave: 'BPA-2028',
      name: 'BPA 2028',
      type: 'BPAS',
      isin: 'MX0MGO000005',
      currency: 'MXN',
      issueDate: new Date('2023-09-01'),
      maturityDate: new Date('2028-09-01'),
      couponRate: 6.9,
      nominalValue: 100,
      status: 'ACTIVE',
    },
  ];

  await Instrument.deleteMany({});
  await Instrument.insertMany(instruments);

  return instruments.length;
};