import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { seoService } from './seo.service';

export async function auditUrl(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'URL is required' }
      });
    }

    const result = await seoService.auditUrl(req.user!.organizationId, url);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getKeywords(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { siteUrl } = req.query;
    const keywords = await seoService.getKeywordInsights(
      req.user!.organizationId,
      siteUrl ? String(siteUrl) : undefined
    );

    res.json({
      success: true,
      data: keywords
    });
  } catch (error: any) {
    next(error);
  }
}

export async function generateOutline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Topic is required' }
      });
    }

    const outline = await seoService.generateArticleOutline(req.user!.organizationId, topic);
    res.json({
      success: true,
      data: outline
    });
  } catch (error: any) {
    next(error);
  }
}
