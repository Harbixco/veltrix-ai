import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedCompetitors() {
  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) return;

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
        organizationId: org.id,
        ...comp
      }
    });
  }

  const count = await prisma.competitor.count({ where: { organizationId: org.id } });
  console.log(`Seeded competitors in MongoDB Atlas: total ${count}`);
}

seedCompetitors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
