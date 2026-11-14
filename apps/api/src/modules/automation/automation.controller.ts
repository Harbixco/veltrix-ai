import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { automationService } from './automation.service';

export async function getWorkflows(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const workflows = await automationService.getWorkflows(req.user!.organizationId);
    res.json({
      success: true,
      data: workflows
    });
  } catch (error: any) {
    next(error);
  }
}

export async function createWorkflow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, triggerType, conditions, actions } = req.body;

    if (!name || !triggerType) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and triggerType are required' }
      });
    }

    const workflow = await automationService.createWorkflow(req.user!.organizationId, {
      name,
      triggerType,
      conditions: conditions || '{}',
      actions: actions || '[]'
    });

    res.status(201).json({
      success: true,
      data: workflow
    });
  } catch (error: any) {
    next(error);
  }
}

export async function testTrigger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const workflowId = String(req.params.id);
    const { payload } = req.body;

    const execution = await automationService.triggerWorkflow(
      req.user!.organizationId,
      workflowId,
      payload
    );

    res.json({
      success: true,
      data: execution
    });
  } catch (error: any) {
    next(error);
  }
}
