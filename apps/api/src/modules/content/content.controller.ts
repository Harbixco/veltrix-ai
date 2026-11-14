import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { contentService } from './content.service';

export async function generateCopy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { serviceSlug, contentPillar, customPrompt } = req.body;

    if (!serviceSlug || !contentPillar) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'serviceSlug and contentPillar are required' }
      });
    }

    const generated = await contentService.generateCopy(req.user!.organizationId, {
      serviceSlug,
      contentPillar,
      customPrompt
    });

    res.json({
      success: true,
      data: generated
    });
  } catch (error: any) {
    next(error);
  }
}

export async function saveDraft(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { title, caption, contentPillar, suggestedCta, visualConcept } = req.body;

    if (!title || !caption) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'title and caption are required' }
      });
    }

    const draft = await contentService.saveDraft(req.user!.organizationId, {
      title,
      caption,
      contentPillar: contentPillar || 'EDUCATION',
      suggestedCta: suggestedCta || '',
      visualConcept: visualConcept || ''
    });

    res.status(201).json({
      success: true,
      data: draft
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getDrafts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const drafts = await contentService.getDrafts(req.user!.organizationId, status ? String(status) : undefined);

    res.json({
      success: true,
      data: drafts
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateDraft(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const draftId = String(req.params.id);
    const { title, caption, status, suggestedCta } = req.body;

    const draft = await contentService.updateDraft(req.user!.organizationId, draftId, {
      title,
      caption,
      status,
      suggestedCta
    });

    res.json({
      success: true,
      data: draft
    });
  } catch (error: any) {
    next(error);
  }
}
