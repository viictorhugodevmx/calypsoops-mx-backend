import { Request, Response } from 'express';
import { Instrument } from './instrument.model';
import { seedInstruments } from './instrument.seed';

export const getInstruments = async (
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
        { clave: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { isin: { $regex: search, $options: 'i' } },
      ];
    }

    const instruments = await Instrument.find(filters).sort({
      type: 1,
      maturityDate: 1,
    });

    res.status(200).json({
      success: true,
      total: instruments.length,
      items: instruments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instruments',
      error,
    });
  }
};

export const getInstrumentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const instrument = await Instrument.findById(req.params.id);

    if (!instrument) {
      res.status(404).json({
        success: false,
        message: 'Instrument not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: instrument,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instrument detail',
      error,
    });
  }
};

export const runInstrumentsSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedInstruments();

    res.status(201).json({
      success: true,
      message: 'Instruments seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error running instruments seed',
      error,
    });
  }
};