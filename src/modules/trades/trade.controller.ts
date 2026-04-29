import { Request, Response } from 'express';
import { Trade } from './trade.model';
import { seedTrades } from './trade.seed';

export const getTrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, type, counterparty, search } = req.query;

    const filters: Record<string, unknown> = {};

    if (status) {
      filters.status = status;
    }

    if (type) {
      filters.type = type;
    }

    if (counterparty) {
      filters.counterparty = { $regex: counterparty, $options: 'i' };
    }

    if (search) {
      filters.$or = [
        { tradeId: { $regex: search, $options: 'i' } },
        { counterparty: { $regex: search, $options: 'i' } },
        { trader: { $regex: search, $options: 'i' } },
        { desk: { $regex: search, $options: 'i' } },
      ];
    }

    const trades = await Trade.find(filters)
      .populate('instrument')
      .sort({ tradeDate: -1 });

    res.status(200).json({
      success: true,
      total: trades.length,
      items: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trades',
      error,
    });
  }
};

export const getTradeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trade = await Trade.findById(req.params.id).populate('instrument');

    if (!trade) {
      res.status(404).json({
        success: false,
        message: 'Trade not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trade detail',
      error,
    });
  }
};

export const updateTradeStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['CAPTURED', 'VALIDATED', 'SETTLED', 'REJECTED'];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid trade status',
        allowedStatuses,
      });
      return;
    }

    const trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('instrument');

    if (!trade) {
      res.status(404).json({
        success: false,
        message: 'Trade not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Trade status updated successfully',
      item: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trade status',
      error,
    });
  }
};

export const runTradesSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedTrades();

    res.status(201).json({
      success: true,
      message: 'Trades seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Error running trades seed',
      error,
    });
  }
};