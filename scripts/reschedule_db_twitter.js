require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function reschedule() {
  const socialPageId = '6af8033978f3c833e6f4bf5c';
  const organizationId = '6af6da8935b48c1e048e7a5a';

  // 1. Delete all old scheduled Twitter posts prior to Nov 26, 2026
  const deleted = await prisma.scheduledPost.deleteMany({
    where: {
      socialPageId,
      status: 'SCHEDULED',
      scheduledFor: {
        lt: new Date('2026-11-26T00:00:00.000Z')
      }
    }
  });
  console.log(`Deleted ${deleted.count} stale scheduled Twitter posts before Nov 26.`);

  // 2. Load concise posts (all 56)
  const concisePosts = JSON.parse(fs.readFileSync('content/concise_posts.json', 'utf8'));
  console.log(`Loaded ${concisePosts.length} concise posts.`);

  // 3. Upsert all 56 posts starting tomorrow, Thursday Nov 26, 2026
  const startDate = new Date('2026-11-26T00:00:00.000Z');
  let createdCount = 0;
  let updatedCount = 0;

  for (let idx = 0; idx < concisePosts.length; idx++) {
    const post = concisePosts[idx];
    const dayOffset = post.day - 1; // 0 for Day 1 (Nov 26)
    const isMorning = post.time.includes('09:00');
    
    // Set exact UTC hour: 08:00Z for 09:00 AM WAT, 18:00Z for 07:00 PM WAT
    const postDate = new Date(startDate.getTime() + dayOffset * 86400000);
    postDate.setUTCHours(isMorning ? 8 : 18, 0, 0, 0);

    const startRange = new Date(postDate.getTime() - 2 * 3600000);
    const endRange = new Date(postDate.getTime() + 2 * 3600000);

    const existing = await prisma.scheduledPost.findFirst({
      where: {
        socialPageId,
        scheduledFor: {
          gte: startRange,
          lte: endRange
        }
      }
    });

    if (existing) {
      await prisma.scheduledPost.update({
        where: { id: existing.id },
        data: {
          caption: post.text.trim(),
          mediaUrls: [],
          status: 'SCHEDULED',
          scheduledFor: postDate,
          errorMessage: null,
          publishedAt: null
        }
      });
      updatedCount++;
    } else {
      await prisma.scheduledPost.create({
        data: {
          organizationId,
          socialPageId,
          caption: post.text.trim(),
          mediaUrls: [],
          status: 'SCHEDULED',
          scheduledFor: postDate
        }
      });
      createdCount++;
    }
  }

  console.log(`Rescheduled 56 Twitter posts! Updated: ${updatedCount}, Created: ${createdCount}`);

  // 4. Verify count in DB
  const total = await prisma.scheduledPost.count({
    where: {
      socialPageId,
      status: 'SCHEDULED',
      scheduledFor: { gte: new Date('2026-11-26T00:00:00.000Z') }
    }
  });
  console.log(`Total active scheduled Twitter posts from Nov 26 onwards: ${total}`);

  await prisma.$disconnect();
}

reschedule().catch(err => {
  console.error('Error during reschedule:', err);
  process.exit(1);
});
