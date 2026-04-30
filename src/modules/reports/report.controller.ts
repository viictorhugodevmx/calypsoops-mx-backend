import { Request, Response } from 'express';
import { Report, ReportType } from './report.model';
import { seedReports } from './report.seed';

const allowedReportTypes: ReportType[] = [
  'BANXICO_REPORT',
  'EOD_POSITION',
  'INDEVAL_BREAKS',
  'RISK_BREACHES',
  'COMPLIANCE_LOGS',
];

const getReportName = (type: ReportType): string => {
  const names: Record<ReportType, string> = {
    BANXICO_REPORT: 'Informe Banxico Mercado de Dinero',
    EOD_POSITION: 'Reporte de Posición al Cierre de Día',
    INDEVAL_BREAKS: 'Reporte de Breaks INDEVAL',
    RISK_BREACHES: 'Reporte de Límites Excedidos',
    COMPLIANCE_LOGS: 'Reporte de Logs de Cumplimiento',
  };

  return names[type];
};

const getDefaultFormat = (type: ReportType): 'CSV' | 'XLSX' | 'PDF' => {
  if (type === 'EOD_POSITION') {
    return 'XLSX';
  }

  if (type === 'RISK_BREACHES') {
    return 'PDF';
  }

  return 'CSV';
};

export const runReportsSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedReports();

    res.status(201).json({
      success: true,
      message: 'Reports seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Error running reports seed',
      error,
    });
  }
};

export const generateReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, businessDate, generatedBy } = req.body;

    if (!type || !allowedReportTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: 'Invalid report type',
        allowedReportTypes,
      });
      return;
    }

    const date = businessDate ? new Date(businessDate) : new Date();
    const cleanDate = date.toISOString().slice(0, 10).replaceAll('-', '');
    const reportId = `RPT-${Date.now()}`;
    const format = getDefaultFormat(type);

    const report = await Report.create({
      reportId,
      type,
      name: getReportName(type),
      status: 'GENERATED',
      businessDate: date,
      generatedAt: new Date(),
      generatedBy: generatedBy || 'Report Engine',
      format,
      recordsCount: Math.floor(Math.random() * 50) + 1,
      fileName: `${type.toLowerCase()}_${cleanDate}.${format.toLowerCase()}`,
      message: 'Report generated successfully',
      metadata: {
        simulated: true,
        source: 'CalypsoOps MX',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      item: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error,
    });
  }
};

export const getReportHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, status, search } = req.query;

    const filters: Record<string, unknown> = {};

    if (type) {
      filters.type = type;
    }

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.$or = [
        { reportId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await Report.find(filters).sort({ createdAt: -1 });

    const summary = {
      total: reports.length,
      generated: reports.filter((item) => item.status === 'GENERATED').length,
      pending: reports.filter((item) => item.status === 'PENDING').length,
      failed: reports.filter((item) => item.status === 'FAILED').length,
    };

    res.status(200).json({
      success: true,
      summary,
      items: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report history',
      error,
    });
  }
};

export const getReportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: 'Report not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report detail',
      error,
    });
  }
};