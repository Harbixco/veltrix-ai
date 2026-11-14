import { prisma } from '@veltrix/database';

export interface CreateCompetitorDTO {
  name: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
}

export class CompetitorService {
  /**
   * Retrieves competitors for an organization, pre-populating market landscape benchmarks if empty
   */
  async getCompetitors(organizationId: string) {
    let competitors = await prisma.competitor.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' }
    });

    if (competitors.length === 0) {
      const benchmarkCompetitors = [
        {
          name: 'Legacy Regional Digital Agencies',
          websiteUrl: 'https://sample-legacy-agency.com',
          facebookPageUrl: 'https://facebook.com/sampleagency',
          strengths: ['Established brand recognition', 'Large enterprise client portfolio', 'Full-service creative teams'],
          weaknesses: ['Bloated project timelines (3-6 months)', 'High overhead pricing', 'Neglect post-launch conversion funnels'],
          differentiators: ['Veltrix delivers fast, agile sprints in 2-4 weeks with built-in WhatsApp lead capture funnels.']
        },
        {
          name: 'Freelance Marketplace Developers',
          websiteUrl: 'https://freelance-sample.com',
          facebookPageUrl: 'https://facebook.com/samplefreelancer',
          strengths: ['Low initial quote price', 'Direct developer access'],
          weaknesses: ['Zero brand strategy or trust architecture', 'High project abandonment rate', 'No SEO or CRM integration'],
          differentiators: ["Veltrix builds lasting digital infrastructure under our core motto: 'We don't just build websites. We build trust.'"]
        },
        {
          name: 'Cookie-Cutter No-Code Site Builders',
          websiteUrl: 'https://sample-nocode-builder.com',
          facebookPageUrl: 'https://facebook.com/samplenocode',
          strengths: ['Fast DIY template deployment', 'Low monthly subscription fee'],
          weaknesses: ['Generic non-differentiated visual designs', 'Poor SEO performance and slow Core Web Vitals', 'Zero personalized lead strategy'],
          differentiators: ['Custom high-performance Next.js architecture with dedicated vector designs and Meta Page campaign tracking.']
        }
      ];

      for (const comp of benchmarkCompetitors) {
        await prisma.competitor.create({
          data: {
            organizationId,
            ...comp
          }
        });
      }

      competitors = await prisma.competitor.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
      });
    }

    return competitors;
  }

  /**
   * Adds a competitor to the market intelligence database
   */
  async createCompetitor(organizationId: string, data: CreateCompetitorDTO) {
    return prisma.competitor.create({
      data: {
        organizationId,
        name: data.name,
        websiteUrl: data.websiteUrl,
        facebookPageUrl: data.facebookPageUrl,
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        differentiators: data.differentiators || []
      }
    });
  }

  /**
   * Deletes a competitor record
   */
  async deleteCompetitor(organizationId: string, competitorId: string) {
    const comp = await prisma.competitor.findFirst({
      where: { id: competitorId, organizationId }
    });

    if (!comp) {
      throw new Error('Competitor not found or access denied');
    }

    await prisma.competitor.delete({
      where: { id: competitorId }
    });

    return { success: true, message: 'Competitor removed successfully' };
  }
}

export const competitorService = new CompetitorService();
