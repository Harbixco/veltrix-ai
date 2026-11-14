import { prisma } from '../../db';

export interface CreateWorkflowDTO {
  name: string;
  triggerType: string;
  conditions: string;
  actions: string;
}

export class AutomationService {
  /**
   * Retrieves all workflows configured for an organization, pre-populating starter recipes if empty
   */
  async getWorkflows(organizationId: string) {
    let workflows = await prisma.automationWorkflow.findMany({
      where: { organizationId },
      include: {
        executions: {
          take: 5,
          orderBy: { executedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (workflows.length === 0) {
      // Seed default automation recipes
      const defaultRecipes = [
        {
          name: 'Instant WhatsApp Lead Alert to Owner',
          triggerType: 'LEAD_CREATED',
          conditions: JSON.stringify({ source: 'WHATSAPP', minimumValue: 0 }),
          actions: JSON.stringify([
            { type: 'SEND_NOTIFICATION', channel: 'WHATSAPP', recipient: 'OWNER' },
            { type: 'DISPATCH_WEBHOOK', targetUrl: 'https://hooks.zapier.com/hooks/catch/sample' }
          ]),
          isActive: true
        },
        {
          name: 'Automated 48-Hour Proposal Follow-Up Sequence',
          triggerType: 'PROPOSAL_SENT',
          conditions: JSON.stringify({ delayHours: 48 }),
          actions: JSON.stringify([
            { type: 'CREATE_CRM_TASK', title: 'Check in on sent proposal via WhatsApp' }
          ]),
          isActive: true
        },
        {
          name: 'Closed Won Deal Celebration & Onboarding Trigger',
          triggerType: 'DEAL_WON',
          conditions: JSON.stringify({ status: 'WON' }),
          actions: JSON.stringify([
            { type: 'SEND_EMAIL_CONFIRMATION', template: 'CLIENT_WELCOME_PACK' },
            { type: 'DISPATCH_WEBHOOK', targetUrl: 'https://hooks.zapier.com/hooks/catch/onboarding' }
          ]),
          isActive: true
        }
      ];

      for (const recipe of defaultRecipes) {
        await prisma.automationWorkflow.create({
          data: {
            organizationId,
            ...recipe
          }
        });
      }

      workflows = await prisma.automationWorkflow.findMany({
        where: { organizationId },
        include: {
          executions: {
            take: 5,
            orderBy: { executedAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return workflows;
  }

  /**
   * Creates a new automated workflow
   */
  async createWorkflow(organizationId: string, data: CreateWorkflowDTO) {
    return prisma.automationWorkflow.create({
      data: {
        organizationId,
        name: data.name,
        triggerType: data.triggerType,
        conditions: data.conditions,
        actions: data.actions,
        isActive: true
      }
    });
  }

  /**
   * Simulates or triggers a workflow execution, dispatching webhooks and logging results
   */
  async triggerWorkflow(organizationId: string, workflowId: string, payload?: any) {
    const workflow = await prisma.automationWorkflow.findFirst({
      where: { id: workflowId, organizationId }
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const executionPayload = payload || {
      event: workflow.triggerType,
      timestamp: new Date().toISOString(),
      leadId: 'sample_lead_101',
      service: 'Website Development',
      amount: 150000
    };

    let actions: any[] = [];
    try {
      actions = JSON.parse(workflow.actions);
    } catch (e) {
      actions = [{ type: 'GENERIC_DISPATCH' }];
    }

    // Check for outbound webhooks
    for (const act of actions) {
      if (act.type === 'DISPATCH_WEBHOOK' && act.targetUrl && act.targetUrl.startsWith('http')) {
        try {
          await fetch(act.targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(executionPayload)
          });
        } catch (err) {
          console.warn('[Webhook Warning] Dispatch failed:', err);
        }
      }
    }

    // Record execution log in MongoDB Atlas
    const execution = await prisma.automationExecution.create({
      data: {
        workflowId: workflow.id,
        status: 'SUCCESS',
        payload: JSON.stringify(executionPayload)
      }
    });

    return execution;
  }
}

export const automationService = new AutomationService();
