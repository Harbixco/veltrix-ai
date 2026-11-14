import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { settingsService } from './settings.service';

export async function getSettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.getSettings(req.user!.organizationId);

    res.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    next(error);
  }
}
