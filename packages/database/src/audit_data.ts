import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function auditData() {
  const org = await prisma.organization.findFirst({ where: { slug: 'veltrix-hub' } });
  if (!org) return;

  console.log('=== Current Database State for Veltrix Hub ===');
  const pages = await prisma.socialPage.findMany({ where: { organizationId: org.id } });
  console.log(`- SocialPages (${pages.length}):`, pages.map(p => ({ id: p.id, pageId: p.pageId, pageName: p.pageName })));

  const posts = await prisma.socialPost.findMany({ where: { organizationId: org.id } });
  console.log(`- SocialPosts (${posts.length}):`, posts.map(p => ({ id: p.id, externalPostId: p.externalPostId, caption: p.caption.slice(0, 40) })));

  const scheduled = await prisma.scheduledPost.findMany({ where: { organizationId: org.id } });
  console.log(`- ScheduledPosts (${scheduled.length}):`, scheduled.map(p => ({ id: p.id, status: p.status, for: p.scheduledFor, caption: p.caption.slice(0, 40) })));

  const leads = await prisma.lead.findMany({ where: { organizationId: org.id } });
  console.log(`- Leads (${leads.length}):`, leads.map(l => ({ id: l.id, name: l.fullName })));

  const seoReports = await prisma.sEOReport.findMany();
  console.log(`- SEOReports: ${seoReports.length}`);

  const workflows = await prisma.automationWorkflow.findMany();
  console.log(`- AutomationWorkflows: ${workflows.length}`);

  const campaigns = await prisma.contentCampaign.findMany();
  console.log(`- ContentCampaigns: ${campaigns.length}`);

  const competitors = await prisma.competitor.findMany();
  console.log(`- Competitors: ${competitors.length}`);

  const conversations = await prisma.aIConversation.findMany();
  console.log(`- AIConversations: ${conversations.length}`);
}

auditData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
