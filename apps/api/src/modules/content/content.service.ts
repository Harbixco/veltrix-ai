import { prisma } from '../../db';

export interface GeneratedContentDTO {
  topic: string;
  headline: string;
  contentPillar: 'EDUCATION' | 'BUSINESS_GROWTH' | 'AUTHORITY' | 'INSPIRATION' | 'PROMOTION';
  serviceName: string;
  targetAudience: string;
  customerPainPoint: string;
  caption: string;
  suggestedCta: string;
  visualConcept: string;
  rationale: string;
}

export class ContentService {
  /**
   * Generates tailored, structured marketing content mapped to a specific service and pillar
   */
  async generateCopy(
    organizationId: string,
    params: {
      serviceSlug: string;
      contentPillar: 'EDUCATION' | 'BUSINESS_GROWTH' | 'AUTHORITY' | 'INSPIRATION' | 'PROMOTION';
      customPrompt?: string;
    }
  ): Promise<GeneratedContentDTO> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        businessProfile: true,
        brandGuidelines: true,
        services: true
      }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const service = org.services.find((s) => s.slug === params.serviceSlug) || org.services[0];
    const brandVoice = org.brandGuidelines?.brandVoice || 'Clear, educational, empathetic, and results-oriented';
    const tagline = org.businessProfile?.tagline || "We don't just build websites. We build trust.";

    // Assemble intelligent context-driven copy based on service pain points and pillar
    const painPoint = service.painPoints[0] || 'Losing potential customers due to low online visibility';
    const benefit = service.benefits[0] || 'Build authoritative trust and attract high-intent inquiries';

    let headline = '';
    let caption = '';
    let visualConcept = '';
    let rationale = '';

    if (params.contentPillar === 'EDUCATION') {
      headline = `3 Costly Mistakes Businesses Make When Choosing ${service.name}`;
      caption = `Most business owners wait until they lose a major deal before realizing their digital presentation isn't working.\n\nHere is what usually happens:\n❌ Relying exclusively on informal status updates that vanish after 24 hours.\n❌ Having an outdated online presence that doesn't build immediate buyer confidence.\n❌ Failing to give prospects an automated way to inquire or book.\n\nAt ${org.businessProfile?.businessName || 'Veltrix Hub'}, ${tagline.toLowerCase()}.\n\nWhen your business invests in proper ${service.name.toLowerCase()}, you unlock ${benefit.toLowerCase()}.\n\n👉 What is your biggest obstacle to upgrading your digital presence this quarter? Comment below or send a direct message.`;
      visualConcept = `A bold 3-slide educational layout using dark slate (#0F172A) background with crisp white typography and sky blue (#38BDF8) accents. Slide 1 highlights the curiosity hook with an alert icon.`;
      rationale = `Educates the target audience on ${painPoint.toLowerCase()} while positioning ${service.name} as the professional standard.`;
    } else if (params.contentPillar === 'AUTHORITY') {
      headline = `How We Transformed an Informal Operation into an Automated ${service.name} Machine`;
      caption = `Real growth is not measured by likes or casual status views—it is measured by real business inquiries and revenue.\n\nWe recently partnered with a growing enterprise struggling with:\n⚠️ ${painPoint}\n⚠️ Manual back-and-forth messaging that delayed order processing.\n\nOur Growth Blueprint:\n1️⃣ Modernized their digital structure to establish instant credibility.\n2️⃣ Integrated automated lead routing and inquiry capture.\n3️⃣ Implemented conversion-focused copy highlighting their core differentiators.\n\nThe Outcome:\n📈 140% increase in qualified inquiries within the first 30 days.\n\n${service.defaultCta}\n\n💬 Have questions about scaling your operations? Reach out to our team today.`;
      visualConcept = `A split-screen comparison graphic. Left side displays 'The Bottleneck' in muted gray tones; right side displays 'The Solution' in vibrant electric blue (#2563EB) with an upward metric badge.`;
      rationale = `Demonstrates verifiable execution and real-world outcomes, building deep buyer confidence without bragging.`;
    } else if (params.contentPillar === 'BUSINESS_GROWTH') {
      headline = `Why Customer Confidence Precedes Every High-Value Sale`;
      caption = `Before a client sends payment to your business, they ask themselves one silent question:\n\n"Can I trust this company to deliver?"\n\nIf your business only exists as a personal phone contact or a sporadic social profile, customer hesitation is natural.\n\nProfessional ${service.name.toLowerCase()} changes how the market perceives your value:\n✅ It legitimizes your business name.\n✅ It provides 24/7 proof of your capabilities.\n✅ It allows you to command premium prices instead of competing on discounts.\n\n${tagline}\n\n${service.defaultCta}`;
      visualConcept = `A minimalist corporate typography graphic featuring a bold quote on credibility and trust, branded with the Veltrix Hub official logo and primary color scheme.`;
      rationale = `Appeals to mature entrepreneurs who understand that visual presentation directly impacts their pricing power.`;
    } else {
      // PROMOTION / INSPIRATION
      headline = `Ready to Upgrade Your ${service.name}? Let's Build Something Meaningful`;
      caption = `Your business has outgrown informal marketing hacks.\n\nIf you are ready for a reliable digital visibility system that consistently attracts paying clients, Veltrix Hub is your growth partner.\n\nWhat is included in our ${service.name} package:\n✔️ End-to-end technical implementation.\n✔️ Search-optimized and mobile-responsive architecture.\n✔️ Direct integration with your customer communication channels.\n\n${service.defaultCta}\n\n📲 Direct WhatsApp consultation link available in our bio.`;
      visualConcept = `An announcement card featuring the service title in bold uppercase, a feature checklist with emerald checkmarks, and a prominent 'Book Consultation' badge.`;
      rationale = `Direct, consultative service offering designed for high-intent prospects ready to make a purchasing decision.`;
    }

    return {
      topic: `${service.name} — ${params.contentPillar}`,
      headline,
      contentPillar: params.contentPillar,
      serviceName: service.name,
      targetAudience: service.targetAudience,
      customerPainPoint: painPoint,
      caption,
      suggestedCta: service.defaultCta,
      visualConcept,
      rationale
    };
  }

  /**
   * Saves a generated or edited draft to the organization library
   */
  async saveDraft(
    organizationId: string,
    data: {
      title: string;
      caption: string;
      contentPillar: 'EDUCATION' | 'BUSINESS_GROWTH' | 'AUTHORITY' | 'INSPIRATION' | 'PROMOTION';
      suggestedCta: string;
      visualConcept: string;
    }
  ) {
    return prisma.contentDraft.create({
      data: {
        organizationId,
        title: data.title,
        caption: data.caption,
        contentPillar: data.contentPillar,
        suggestedCta: data.suggestedCta,
        visualConcept: data.visualConcept,
        status: 'DRAFT'
      }
    });
  }

  /**
   * Retrieves all saved content drafts with optional status filtering
   */
  async getDrafts(organizationId: string, status?: string) {
    return prisma.contentDraft.findMany({
      where: {
        organizationId,
        ...(status && status !== 'ALL' ? { status: status as any } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Updates a draft's content or approval status (e.g. APPROVED, IN_REVIEW)
   */
  async updateDraft(
    organizationId: string,
    draftId: string,
    data: { title?: string; caption?: string; status?: any; suggestedCta?: string }
  ) {
    return prisma.contentDraft.update({
      where: { id: draftId },
      data
    });
  }
}

export const contentService = new ContentService();
