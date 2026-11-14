import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { reportService } from './report.service';

export async function getExecutiveReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const report = await reportService.getExecutiveReport(req.user!.organizationId);

    res.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    next(error);
  }
}
