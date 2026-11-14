import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { analyticsService } from './analytics.service';

export async function getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const overview = await analyticsService.getOverview(req.user!.organizationId);
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
}

export async function getRankedPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { pillar, sortBy } = req.query;
    const posts = await analyticsService.getRankedPosts(req.user!.organizationId, {
      pillar: pillar ? String(pillar) : undefined,
      sortBy: sortBy ? String(sortBy) : undefined
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
}

export async function getDiagnosis(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const postId = String(req.params.postId);
    const diagnosis = await analyticsService.diagnosePost(req.user!.organizationId, postId);

    res.json({
      success: true,
      data: diagnosis
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: error.message }
    });
  }
}

export async function getComparison(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const comparison = await analyticsService.getAccountComparison(req.user!.organizationId);
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    next(error);
  }
}
