import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MORNING_DESIGNS = [
  '/designs/veltrix-design-1.jpg',
  '/designs/veltrix-design-2.jpg',
  '/designs/veltrix-design-3.jpg',
  '/designs/veltrix-design-4.jpg'
];

const EVENING_SERVICE_DESIGNS = [
  '/designs/veltrix-design-5.jpg', // Need a Professional Website Device Mockup
  '/designs/veltrix-design-6.jpg'  // Our Core Services & AI Workflows Matrix Flyer
];

async function updateEveningServiceDesigns() {
  console.log('=== Updating 30-Batch Scheduled Posts with Service Designs 5 & 6 ===');

  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) {
    throw new Error('Organization Veltrix Hub not found!');
  }

  const posts = await prisma.scheduledPost.findMany({
    where: { organizationId: org.id },
    orderBy: { scheduledFor: 'asc' }
  });

  console.log(`Found ${posts.length} scheduled posts.`);

  let morningCount = 0;
  let eveningCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postDate = new Date(post.scheduledFor);
    const hour = postDate.getUTCHours(); // WAT is UTC+1. 9:00 AM WAT is 8:00 UTC. 6:00 PM WAT is 17:00 UTC.
    
    let assignedDesign = '';
    const isEvening = hour >= 12;

    if (isEvening) {
      assignedDesign = EVENING_SERVICE_DESIGNS[eveningCount % EVENING_SERVICE_DESIGNS.length];
      eveningCount++;
    } else {
      assignedDesign = MORNING_DESIGNS[morningCount % MORNING_DESIGNS.length];
      morningCount++;
    }

    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        mediaUrls: [assignedDesign]
      }
    });

    console.log(`[Post ${i + 1}] Scheduled: ${postDate.toISOString()} | Slot: ${isEvening ? 'EVENING (Service Spotlight)' : 'MORNING (Educational Hook)'} -> Design: ${assignedDesign}`);
  }

  console.log(`✅ Successfully updated ${morningCount} morning posts and ${eveningCount} evening service posts!`);
}

updateEveningServiceDesigns()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
