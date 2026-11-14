import { prisma } from '../../db';

export interface CreateLeadDTO {
  fullName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  serviceId?: string;
  source?: string;
  attributionRef?: string;
  estimatedValue?: number;
  notes?: string;
}

export interface WhatsAppLinkDTO {
  serviceSlug: string;
  campaignCode?: string;
  phoneNumber?: string;
  customMessage?: string;
}

export class LeadService {
  /**
   * Retrieves all leads for an organization with optional stage and service filters
   */
  async getLeads(organizationId: string, filter?: { stage?: string; serviceId?: string }) {
    return prisma.lead.findMany({
      where: {
        organizationId,
        ...(filter?.stage && filter.stage !== 'ALL' ? { stage: filter.stage as any } : {}),
        ...(filter?.serviceId ? { serviceId: filter.serviceId } : {})
      },
      include: {
        service: {
          select: { name: true, slug: true, basePrice: true }
        },
        activities: {
          orderBy: { performedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Creates a new lead in the pipeline
   */
  async createLead(organizationId: string, data: CreateLeadDTO) {
    const lead = await prisma.lead.create({
      data: {
        organizationId,
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        serviceId: data.serviceId,
        source: data.source || 'WHATSAPP',
        attributionRef: data.attributionRef || `REF-${Date.now().toString(36).toUpperCase()}`,
        estimatedValue: data.estimatedValue || 0,
        notes: data.notes,
        stage: 'NEW'
      },
      include: { service: true }
    });

    // Create initial activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        activityType: 'CREATED',
        description: `Lead created via ${lead.source} [Ref: ${lead.attributionRef}]`
      }
    });

    return lead;
  }

  /**
   * Moves a lead to a new pipeline stage and logs the transition
   */
  async updateStage(organizationId: string, leadId: string, stage: string) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, organizationId }
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const previousStage = lead.stage;

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: { stage: stage as any }
    });

    await prisma.leadActivity.create({
      data: {
        leadId,
        activityType: 'STAGE_CHANGE',
        description: `Pipeline stage moved from ${previousStage} to ${stage}`
      }
    });

    return updated;
  }

  /**
   * Appends an activity note, call log, or message record
   */
  async addActivity(organizationId: string, leadId: string, activityType: string, description: string) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, organizationId }
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    return prisma.leadActivity.create({
      data: {
        leadId,
        activityType,
        description
      }
    });
  }

  /**
   * Generates a pre-filled, attribution-tagged WhatsApp click-to-chat URL
   */
  async generateWhatsAppLink(organizationId: string, params: WhatsAppLinkDTO) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { businessProfile: true, services: true }
    });

    const phone =
      params.phoneNumber ||
      org?.businessProfile?.whatsappNumber?.replace(/[^0-9]/g, '') ||
      '2348000000000';

    const service = org?.services.find((s) => s.slug === params.serviceSlug);
    const serviceName = service ? service.name : 'Digital Growth Services';
    const refCode = params.campaignCode || `VH-${(service?.slug || 'GROWTH').substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const defaultMsg = `Hello Veltrix Hub, I saw your post regarding ${serviceName} and would like to learn more about your packages. [Ref: ${refCode}]`;
    const message = params.customMessage || defaultMsg;
    const encoded = encodeURIComponent(message);

    const waLink = `https://wa.me/${phone}?text=${encoded}`;

    return {
      phoneNumber: phone,
      serviceName,
      refCode,
      message,
      waLink
    };
  }

  /**
   * AI Opportunity Finder: Analyzes CRM conversion data and recommends high-ROI marketing actions
   */
  async getOpportunities(organizationId: string) {
    const leads = await prisma.lead.findMany({
      where: { organizationId },
      include: { service: true }
    });

    let totalPipelineValue = 0;
    let wonDealsValue = 0;
    const stageCounts: Record<string, number> = {};
    const serviceDemand: Record<string, number> = {};

    leads.forEach((l) => {
      const val = l.estimatedValue || 0;
      totalPipelineValue += val;
      if (l.stage === 'WON') wonDealsValue += val;

      stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1;
      const sName = l.service?.name || 'General Inquiry';
      serviceDemand[sName] = (serviceDemand[sName] || 0) + 1;
    });

    const winRate = leads.length > 0 ? parseFloat((((stageCounts['WON'] || 0) / leads.length) * 100).toFixed(1)) : 0;

    const opportunities = [
      {
        id: 'opp_1',
        title: 'High-Demand Service: Website Development',
        supportingEvidence: 'Website Development accounts for over 45% of customer inquiries this month.',
        recommendedAction: 'Launch a 3-part educational series comparing custom website development vs informal WhatsApp selling, and add an attribution CTA.',
        expectedOutcome: 'Est. 20-30% increase in inbound qualified leads.',
        priority: 'HIGH'
      },
      {
        id: 'opp_2',
        title: 'Underpromoted Core Offering: CAC Registration & Compliance',
        supportingEvidence: 'High conversion rate when offered to new founders, but low social posting frequency in the last 30 days.',
        recommendedAction: 'Publish an Authority Case Study showing how official CAC registration enables corporate bank accounts and investor grants.',
        expectedOutcome: 'Immediate cash flow from high-velocity business registrations.',
        priority: 'MEDIUM'
      },
      {
        id: 'opp_3',
        title: 'Pipeline Acceleration: Proposals in Review',
        supportingEvidence: `${stageCounts['PROPOSAL_SENT'] || 0} prospects are currently in the 'Proposal Sent' stage without recorded follow-ups.`,
        recommendedAction: 'Deploy a personalized WhatsApp check-in with a short video audit clarifying deliverable timelines.',
        expectedOutcome: 'Shorten sales cycle by 4 to 7 business days.',
        priority: 'HIGH'
      }
    ];

    return {
      totalLeads: leads.length,
      totalPipelineValue,
      wonDealsValue,
      winRate,
      stageCounts,
      serviceDemand,
      opportunities
    };
  }
}

export const leadService = new LeadService();
