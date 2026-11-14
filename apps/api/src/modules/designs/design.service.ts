import { prisma } from '@veltrix/database';

export interface DesignRecipeTemplate {
  key: string;
  name: string;
  description: string;
  category: 'EDUCATION' | 'AUTHORITY' | 'QUOTE' | 'PROMOTION';
  defaultData: {
    headline: string;
    subheadline: string;
    categoryTag: string;
    ctaText: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
  };
}

export const DESIGN_RECIPES: DesignRecipeTemplate[] = [
  {
    key: 'recipe_educational_slide',
    name: 'Educational Growth Slide',
    description: 'Clean, high-contrast slide layout for breaking down business lessons and carousel cards.',
    category: 'EDUCATION',
    defaultData: {
      headline: '3 Reasons Why Informal Selling Limits Your Business Growth',
      subheadline: 'WhatsApp status updates vanish after 24 hours. A dedicated website establishes permanent credibility and converts visitors into inquiries 24/7.',
      categoryTag: 'DIGITAL GROWTH BLUEPRINT',
      ctaText: 'Save this post • Follow for digital growth',
      primaryColor: '#0F172A',
      secondaryColor: '#2563EB',
      accentColor: '#38BDF8',
      textColor: '#FFFFFF'
    }
  },
  {
    key: 'recipe_authority_showcase',
    name: 'Authority Metric Showcase',
    description: 'Impactful case study layout showcasing verifiable performance metrics and client transformations.',
    category: 'AUTHORITY',
    defaultData: {
      headline: '+140% Qualified Inquiries',
      subheadline: 'How we helped a retail brand transition from manual DM messaging to an automated e-commerce store with integrated Paystack checkout.',
      categoryTag: 'CLIENT CASE STUDY',
      ctaText: 'Book a free growth audit today',
      primaryColor: '#0A0D14',
      secondaryColor: '#10B981',
      accentColor: '#38BDF8',
      textColor: '#FFFFFF'
    }
  },
  {
    key: 'recipe_brand_quote',
    name: 'Minimalist Brand Quote',
    description: 'Editorial-grade typography card emphasizing core business philosophy and executive perspective.',
    category: 'QUOTE',
    defaultData: {
      headline: '"We don\'t just build websites. We build trust."',
      subheadline: 'Before a customer makes a high-value purchase, they ask themselves one silent question: "Can I trust this company to deliver?"',
      categoryTag: 'VELTRIX PHILOSOPHY',
      ctaText: 'Veltrix Hub • Digital Growth Partner',
      primaryColor: '#020617',
      secondaryColor: '#334155',
      accentColor: '#38BDF8',
      textColor: '#F8FAFC'
    }
  },
  {
    key: 'recipe_service_announcement',
    name: 'Service Announcement Card',
    description: 'High-converting promotional layout highlighting package benefits, features, and direct CTA.',
    category: 'PROMOTION',
    defaultData: {
      headline: 'Official CAC Business Registration & Compliance',
      subheadline: 'Legitimize your business, open corporate bank accounts, and protect your brand name from imitation. Fully handled end-to-end.',
      categoryTag: 'CORPORATE REGISTRATION',
      ctaText: 'Reserve your spot • Direct WhatsApp link',
      primaryColor: '#0F172A',
      secondaryColor: '#2563EB',
      accentColor: '#F59E0B',
      textColor: '#FFFFFF'
    }
  }
];

export class DesignService {
  /**
   * Returns available structured design recipes with default brand tokens
   */
  async getTemplates(organizationId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { brandGuidelines: true }
    });

    const colors = org?.brandGuidelines?.colors || {
      primary: '#0F172A',
      secondary: '#2563EB',
      accent: '#38BDF8'
    };

    return DESIGN_RECIPES.map((recipe) => ({
      ...recipe,
      defaultData: {
        ...recipe.defaultData,
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent
      }
    }));
  }

  /**
   * Saves a customized design canvas state to MongoDB Atlas
   */
  async saveDesign(
    organizationId: string,
    data: {
      templateKey: string;
      canvasState: any;
      previewUrl?: string;
      format?: string;
    }
  ) {
    return prisma.generatedDesign.create({
      data: {
        organizationId,
        templateKey: data.templateKey,
        canvasState: JSON.stringify(data.canvasState),
        previewUrl: data.previewUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
        format: data.format || '1080x1080'
      }
    });
  }

  /**
   * Retrieves saved designs for an organization
   */
  async getSavedDesigns(organizationId: string) {
    return prisma.generatedDesign.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const designService = new DesignService();
