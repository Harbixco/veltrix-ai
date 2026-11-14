import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { designService } from './design.service';

export async function getTemplates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const templates = await designService.getTemplates(req.user!.organizationId);
    res.json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    next(error);
  }
}

export async function saveDesign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { templateKey, canvasState, previewUrl, format } = req.body;

    if (!templateKey || !canvasState) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'templateKey and canvasState are required' }
      });
    }

    const design = await designService.saveDesign(req.user!.organizationId, {
      templateKey,
      canvasState,
      previewUrl,
      format
    });

    res.status(201).json({
      success: true,
      data: design
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getSavedDesigns(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const designs = await designService.getSavedDesigns(req.user!.organizationId);
    res.json({
      success: true,
      data: designs
    });
  } catch (error: any) {
    next(error);
  }
}
