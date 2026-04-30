import { Request, Response } from 'express';
import {
  WorkbenchTask,
  WorkbenchTaskStatus,
} from './workbench-task.model';
import { seedWorkbenchTasks } from './workbench.seed';

export const runWorkbenchSeed = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const inserted = await seedWorkbenchTasks();

    res.status(201).json({
      success: true,
      message: 'Workbench seed executed successfully',
      inserted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Error running workbench seed',
      error,
    });
  }
};

export const getWorkbenchTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, priority, type, assignedTo, search } = req.query;

    const filters: Record<string, unknown> = {};

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (type) {
      filters.type = type;
    }

    if (assignedTo) {
      filters.assignedTo = { $regex: assignedTo, $options: 'i' };
    }

    if (search) {
      filters.$or = [
        { code: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sourceReference: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await WorkbenchTask.find(filters).sort({
      priority: 1,
      dueDate: 1,
    });

    const summary = {
      total: tasks.length,
      open: tasks.filter((item) => item.status === 'OPEN').length,
      inProgress: tasks.filter((item) => item.status === 'IN_PROGRESS').length,
      resolved: tasks.filter((item) => item.status === 'RESOLVED').length,
      cancelled: tasks.filter((item) => item.status === 'CANCELLED').length,
      critical: tasks.filter((item) => item.priority === 'CRITICAL').length,
    };

    res.status(200).json({
      success: true,
      summary,
      items: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workbench tasks',
      error,
    });
  }
};

export const getWorkbenchTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await WorkbenchTask.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Workbench task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      item: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workbench task detail',
      error,
    });
  }
};

export const updateWorkbenchTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    const allowedStatuses: WorkbenchTaskStatus[] = [
      'OPEN',
      'IN_PROGRESS',
      'RESOLVED',
      'CANCELLED',
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid workbench task status',
        allowedStatuses,
      });
      return;
    }

    const task = await WorkbenchTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Workbench task not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Workbench task status updated successfully',
      item: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating workbench task status',
      error,
    });
  }
};

export const addWorkbenchTaskComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { author, message } = req.body;

    if (!author || !message) {
      res.status(400).json({
        success: false,
        message: 'Author and message are required',
      });
      return;
    }

    const task = await WorkbenchTask.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Workbench task not found',
      });
      return;
    }

    task.comments.push({
      author,
      message,
      createdAt: new Date(),
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      item: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding workbench task comment',
      error,
    });
  }
};