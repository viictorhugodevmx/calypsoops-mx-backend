import { Report } from './report.model';

export const seedReports = async () => {
  const reports = [
    {
      reportId: 'RPT-2026-0001',
      type: 'BANXICO_REPORT',
      name: 'Informe Banxico Mercado de Dinero',
      status: 'GENERATED',
      businessDate: new Date('2026-04-30'),
      generatedAt: new Date('2026-04-30T18:30:00.000Z'),
      generatedBy: 'Report Engine',
      format: 'CSV',
      recordsCount: 25,
      fileName: 'banxico_market_report_20260430.csv',
      message: 'Informe Banxico generado correctamente.',
      metadata: {
        source: 'CalypsoOps MX',
        regulatoryTarget: 'Banxico',
      },
    },
    {
      reportId: 'RPT-2026-0002',
      type: 'EOD_POSITION',
      name: 'Reporte de Posición al Cierre de Día',
      status: 'GENERATED',
      businessDate: new Date('2026-04-30'),
      generatedAt: new Date('2026-04-30T18:45:00.000Z'),
      generatedBy: 'Front Office Reporting',
      format: 'XLSX',
      recordsCount: 5,
      fileName: 'eod_position_20260430.xlsx',
      message: 'Reporte de posición al cierre generado correctamente.',
      metadata: {
        desk: 'Money Market',
        includesValuation: true,
      },
    },
    {
      reportId: 'RPT-2026-0003',
      type: 'INDEVAL_BREAKS',
      name: 'Reporte de Breaks INDEVAL',
      status: 'GENERATED',
      businessDate: new Date('2026-04-30'),
      generatedAt: new Date('2026-04-30T19:00:00.000Z'),
      generatedBy: 'Back Office Reporting',
      format: 'CSV',
      recordsCount: 2,
      fileName: 'indeval_breaks_20260430.csv',
      message: 'Reporte de diferencias INDEVAL generado con breaks abiertos.',
      metadata: {
        openBreaks: 2,
        reviewedBreaks: 0,
      },
    },
    {
      reportId: 'RPT-2026-0004',
      type: 'RISK_BREACHES',
      name: 'Reporte de Límites Excedidos',
      status: 'PENDING',
      businessDate: new Date('2026-04-30'),
      generatedBy: 'Risk Reporting',
      format: 'PDF',
      recordsCount: 0,
      fileName: '',
      message: 'Reporte pendiente de generación.',
      metadata: {
        source: 'Risk Limits',
      },
    },
  ];

  await Report.deleteMany({});
  await Report.insertMany(reports);

  return reports.length;
};