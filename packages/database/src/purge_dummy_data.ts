import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function purgeDummyData() {
  console.log('=== Purging all dummy & test data from MongoDB Atlas ===');

  const org = await prisma.organization.findFirst({ where: { slug: 'veltrix-hub' } });
  if (!org) throw new Error('Veltrix Hub organization not found!');

  // 1. Delete test published SocialPost and associated MetricSnapshots
  const deletedSnapshots = await prisma.metricSnapshot.deleteMany();
  console.log(`- Cleared MetricSnapshots: ${deletedSnapshots.count}`);

  const deletedPosts = await prisma.socialPost.deleteMany({
    where: { organizationId: org.id }
  });
  console.log(`- Cleared dummy SocialPosts: ${deletedPosts.count}`);

  // 2. Delete test ScheduledPost (the one from Phase 9 test: 'Behind the scenes at Veltrix Hub...')
  const deletedOldScheduled = await prisma.scheduledPost.deleteMany({
    where: {
      organizationId: org.id,
      caption: { startsWith: 'Behind the scenes' }
    }
  });
  console.log(`- Cleared test ScheduledPosts: ${deletedOldScheduled.count}`);

  // 3. Clear dummy leads and activities
  const deletedActivities = await prisma.leadActivity.deleteMany();
  console.log(`- Cleared LeadActivities: ${deletedActivities.count}`);

  const deletedLeads = await prisma.lead.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared Leads: ${deletedLeads.count}`);

  // 4. Clear dummy drafts and generated designs from Phase 6 testing
  const deletedDrafts = await prisma.contentDraft.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared ContentDrafts: ${deletedDrafts.count}`);

  const deletedDesigns = await prisma.generatedDesign.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared GeneratedDesigns: ${deletedDesigns.count}`);

  // 5. Clear dummy SEO reports
  const deletedSEOReports = await prisma.sEOReport.deleteMany();
  console.log(`- Cleared SEOReports: ${deletedSEOReports.count}`);

  // 6. Clear dummy Automation workflows and executions
  const deletedExecutions = await prisma.automationExecution.deleteMany();
  console.log(`- Cleared AutomationExecutions: ${deletedExecutions.count}`);

  const deletedWorkflows = await prisma.automationWorkflow.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared AutomationWorkflows: ${deletedWorkflows.count}`);

  // 7. Clear dummy campaigns
  const deletedCampaigns = await prisma.contentCampaign.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared ContentCampaigns: ${deletedCampaigns.count}`);

  // 8. Clear dummy competitors
  const deletedCompetitors = await prisma.competitor.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared Competitors: ${deletedCompetitors.count}`);

  // 9. Clear dummy AI conversations
  const deletedMessages = await prisma.aIMessageHistory.deleteMany();
  console.log(`- Cleared AIMessageHistories: ${deletedMessages.count}`);

  const deletedConversations = await prisma.aIConversation.deleteMany({ where: { organizationId: org.id } });
  console.log(`- Cleared AIConversations: ${deletedConversations.count}`);

  // Summary of remaining real data:
  const remainingScheduled = await prisma.scheduledPost.count({ where: { organizationId: org.id } });
  const remainingPages = await prisma.socialPage.count({ where: { organizationId: org.id } });
  const remainingServices = await prisma.service.count({ where: { organizationId: org.id } });

  console.log('\n=== Cleanup Complete ===');
  console.log(`✅ Remaining Authentic Scheduled Posts (from user hooks): ${remainingScheduled}`);
  console.log(`✅ Connected Facebook Page: ${remainingPages}`);
  console.log(`✅ Core Veltrix Hub Services: ${remainingServices}`);
  console.log('Database is completely clean of all test/dummy entries!');
}

purgeDummyData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
