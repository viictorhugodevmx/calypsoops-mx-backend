import { Request, Response } from 'express';
import { Position } from './position.model';
// import { ReconciliationRun } from './reconciliation-run.model';
import {
  IReconciliationBreak,
  ReconciliationRun,
  ReconciliationStatus,
  BreakReviewStatus,
} from './reconciliation-run.model';
import { seedReconciliationPositions } from './reconciliation.seed';

export const runReconciliationSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedReconciliationPositions();

    res.status(201).json({
      success: true,
      message: 'Reconciliation positions seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Error running reconciliation seed',
      error,
    });
  }
};

export const getPositions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { source } = req.query;

    const filters: Record<string, unknown> = {};

    if (source) {
      filters.source = source;
    }

    const positions = await Position.find(filters)
      .populate('instrument')
      .sort({ source: 1, isin: 1 });

    res.status(200).json({
      success: true,
      total: positions.length,
      items: positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching positions',
      error,
    });
  }
};

export const runReconciliation = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const positions = await Position.find().populate('instrument');

    if (!positions.length) {
      res.status(400).json({
        success: false,
        message: 'No positions found. Run reconciliation seed first.',
      });
      return;
    }

    const calypsoPositions = positions.filter(
      (position) => position.source === 'CALYPSO'
    );

    const indevalPositions = positions.filter(
      (position) => position.source === 'INDEVAL'
    );

    const breaks: IReconciliationBreak[] = calypsoPositions.map((calypsoPosition) => {
      const indevalPosition = indevalPositions.find(
        (item) => item.isin === calypsoPosition.isin
      );

      const calypsoNominal = calypsoPosition.nominalAmount;
      const indevalNominal = indevalPosition?.nominalAmount || 0;
      const nominalDifference = calypsoNominal - indevalNominal;

      const calypsoValuation = calypsoPosition.valuationAmount;
      const indevalValuation = indevalPosition?.valuationAmount || 0;
      const valuationDifference = calypsoValuation - indevalValuation;

      const status: ReconciliationStatus =
        nominalDifference === 0 && valuationDifference === 0
          ? 'MATCHED'
          : 'BREAK';

      const reviewStatus: BreakReviewStatus =
        status === 'BREAK' ? 'OPEN' : 'REVIEWED';

      return {
        instrument: calypsoPosition.instrument,
        isin: calypsoPosition.isin,
        calypsoNominal,
        indevalNominal,
        nominalDifference,
        calypsoValuation,
        indevalValuation,
        valuationDifference,
        status,
        reviewStatus,
        analystComment: '',
      };
    });

    const matchedItems = breaks.filter((item) => item.status === 'MATCHED').length;
    const breakItems = breaks.filter((item) => item.status === 'BREAK').length;

    const run = await ReconciliationRun.create({
      runDate: new Date(),
      positionDate: positions[0].positionDate,
      totalItems: breaks.length,
      matchedItems,
      breakItems,
      breaks,
    });

    const populatedRun = await ReconciliationRun.findById(run.id).populate(
      'breaks.instrument'
    );

    res.status(201).json({
      success: true,
      message: 'Reconciliation run executed successfully',
      item: populatedRun,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error running reconciliation',
      error,
    });
  }
};

export const getReconciliationRuns = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const runs = await ReconciliationRun.find()
      .sort({ runDate: -1 })
      .select('-breaks');

    res.status(200).json({
      success: true,
      total: runs.length,
      items: runs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reconciliation runs',
      error,
    });
  }
};

export const getReconciliationRunById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const run = await ReconciliationRun.findById(req.params.id).populate(
      'breaks.instrument'
    );

    if (!run) {
      res.status(404).json({
        success: false,
        message: 'Reconciliation run not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: run,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reconciliation run detail',
      error,
    });
  }
};

export const reviewReconciliationBreak = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { comment } = req.body;

    const run = await ReconciliationRun.findOne({
      'breaks._id': req.params.id,
    });

    if (!run) {
      res.status(404).json({
        success: false,
        message: 'Reconciliation break not found',
      });
      return;
    }

    const breakItem = run.breaks.find(
      (item) => item._id?.toString() === req.params.id
    );

    if (!breakItem) {
      res.status(404).json({
        success: false,
        message: 'Reconciliation break not found',
      });
      return;
    }

    breakItem.reviewStatus = 'REVIEWED';
    breakItem.analystComment = comment || 'Reviewed without comment';

    await run.save();

    const populatedRun = await ReconciliationRun.findById(run.id).populate(
      'breaks.instrument'
    );

    res.status(200).json({
      success: true,
      message: 'Reconciliation break reviewed successfully',
      item: populatedRun,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reviewing reconciliation break',
      error,
    });
  }
};