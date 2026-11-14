import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { campaignService } from './campaign.service';

export async function getCampaigns(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const campaigns = await campaignService.getCampaigns(req.user!.organizationId);

    res.json({
      success: true,
      data: campaigns
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { serviceId, name, objective, startDate, endDate, budget } = req.body;

    if (!name || !objective || !startDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Campaign name, objective, and start date are required' }
      });
    }

    const campaign = await campaignService.createCampaign(req.user!.organizationId, {
      serviceId,
      name,
      objective,
      startDate,
      endDate,
      budget
    });

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const campaignId = String(req.params.id);
    const campaign = await campaignService.updateCampaign(req.user!.organizationId, campaignId, req.body);

    res.json({
      success: true,
      data: campaign
    });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const campaignId = String(req.params.id);
    const result = await campaignService.deleteCampaign(req.user!.organizationId, campaignId);

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}
