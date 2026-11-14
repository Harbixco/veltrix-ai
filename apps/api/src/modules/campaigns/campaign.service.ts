import { prisma } from '../../db';

export interface CreateCampaignDTO {
  serviceId?: string;
  name: string;
  objective: string;
  startDate: string | Date;
  endDate?: string | Date;
  budget?: number;
}

export class CampaignService {
  /**
   * Retrieves all campaigns for the organization, seeding starter campaign if none exist
   */
  async getCampaigns(organizationId: string) {
    let campaigns = await prisma.contentCampaign.findMany({
      where: { organizationId },
      include: {
        service: true,
        leads: {
          select: {
            id: true,
            fullName: true,
            stage: true,
            estimatedValue: true
          }
        },
        drafts: {
          take: 5,
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (campaigns.length === 0) {
      const webDevService = await prisma.service.findFirst({
        where: { organizationId, slug: 'website-development' }
      });

      const starterCampaign = await prisma.contentCampaign.create({
        data: {
          organizationId,
          serviceId: webDevService?.id,
          name: 'Q4 High-Trust Digital Transformation',
          objective: 'Generate 15 qualified SME business inquiries for high-converting custom website rebuilds',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          budget: 150000,
          status: 'ACTIVE'
        }
      });

      campaigns = await prisma.contentCampaign.findMany({
        where: { organizationId },
        include: {
          service: true,
          leads: {
            select: {
              id: true,
              fullName: true,
              stage: true,
              estimatedValue: true
            }
          },
          drafts: {
            take: 5,
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return campaigns;
  }

  /**
   * Creates a new campaign
   */
  async createCampaign(organizationId: string, data: CreateCampaignDTO) {
    let serviceId = data.serviceId;
    if (serviceId) {
      const svc = await prisma.service.findFirst({
        where: {
          organizationId,
          OR: [{ id: serviceId }, { slug: serviceId }]
        }
      });
      if (svc) {
        serviceId = svc.id;
      }
    }

    return prisma.contentCampaign.create({
      data: {
        organizationId,
        serviceId: serviceId || null,
        name: data.name,
        objective: data.objective,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        budget: data.budget ? Number(data.budget) : 0,
        status: 'ACTIVE'
      },
      include: {
        service: true
      }
    });
  }

  /**
   * Updates an existing campaign
   */
  async updateCampaign(organizationId: string, campaignId: string, data: Partial<CreateCampaignDTO> & { status?: string }) {
    const campaign = await prisma.contentCampaign.findFirst({
      where: { id: campaignId, organizationId }
    });

    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }

    return prisma.contentCampaign.update({
      where: { id: campaignId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.objective && { objective: data.objective }),
        ...(data.serviceId !== undefined && { serviceId: data.serviceId }),
        ...(data.status && { status: data.status }),
        ...(data.budget !== undefined && { budget: Number(data.budget) }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null })
      },
      include: {
        service: true
      }
    });
  }

  /**
   * Deletes a campaign
   */
  async deleteCampaign(organizationId: string, campaignId: string) {
    const campaign = await prisma.contentCampaign.findFirst({
      where: { id: campaignId, organizationId }
    });

    if (!campaign) {
      throw new Error('Campaign not found or access denied');
    }

    await prisma.contentCampaign.delete({
      where: { id: campaignId }
    });

    return { success: true, message: 'Campaign deleted successfully' };
  }
}

export const campaignService = new CampaignService();
