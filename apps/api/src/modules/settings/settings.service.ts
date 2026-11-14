import { prisma } from '../../db';

export class SettingsService {
  /**
   * Retrieves workspace settings, members, and subscription status
   */
  async getSettings(organizationId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          }
        },
        businessProfile: true
      }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    return {
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        planType: org.planType,
        createdAt: org.createdAt
      },
      members: org.members.map((m) => ({
        id: m.id,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user
      })),
      apiConfig: {
        metaApiVersion: 'v19.0',
        tokenEncryption: 'AES-256-GCM',
        databaseEngine: 'MongoDB Atlas',
        webhookActive: true
      }
    };
  }
}

export const settingsService = new SettingsService();
