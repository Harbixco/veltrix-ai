import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { competitorService } from './competitor.service';

export async function getCompetitors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const competitors = await competitorService.getCompetitors(req.user!.organizationId);

    res.json({
      success: true,
      data: competitors
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createCompetitor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, websiteUrl, facebookPageUrl, strengths, weaknesses, differentiators } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Competitor name is required' }
      });
    }

    const competitor = await competitorService.createCompetitor(req.user!.organizationId, {
      name,
      websiteUrl,
      facebookPageUrl,
      strengths: Array.isArray(strengths) ? strengths : [],
      weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
      differentiators: Array.isArray(differentiators) ? differentiators : []
    });

    res.status(201).json({
      success: true,
      data: competitor
    });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteCompetitor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const competitorId = String(req.params.id);
    const result = await competitorService.deleteCompetitor(req.user!.organizationId, competitorId);

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}
