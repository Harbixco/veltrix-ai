import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { leadService } from './lead.service';

export async function getLeads(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { stage, serviceId } = req.query;
    const leads = await leadService.getLeads(req.user!.organizationId, {
      stage: stage ? String(stage) : undefined,
      serviceId: serviceId ? String(serviceId) : undefined
    });

    res.json({
      success: true,
      data: leads
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createLead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { fullName, companyName, email, phone, serviceId, source, attributionRef, estimatedValue, notes } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Full name is required' }
      });
    }

    const lead = await leadService.createLead(req.user!.organizationId, {
      fullName,
      companyName,
      email,
      phone,
      serviceId,
      source,
      attributionRef,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : 0,
      notes
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error: any) {
    next(error);
  }
}

export async function updateStage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const leadId = String(req.params.id);
    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Stage is required' }
      });
    }

    const updated = await leadService.updateStage(req.user!.organizationId, leadId, stage);

    res.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    next(error);
  }
}

export async function addActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const leadId = String(req.params.id);
    const { activityType, description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Activity description is required' }
      });
    }

    const activity = await leadService.addActivity(
      req.user!.organizationId,
      leadId,
      activityType || 'NOTE',
      description
    );

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    next(error);
  }
}

export async function generateWhatsAppLink(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { serviceSlug, campaignCode, phoneNumber, customMessage } = req.body;

    const result = await leadService.generateWhatsAppLink(req.user!.organizationId, {
      serviceSlug: serviceSlug || 'website-development',
      campaignCode,
      phoneNumber,
      customMessage
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getOpportunities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const opps = await leadService.getOpportunities(req.user!.organizationId);

    res.json({
      success: true,
      data: opps
    });
  } catch (error: any) {
    next(error);
  }
}
