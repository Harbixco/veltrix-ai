import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DESIGN_IMAGES = [
  '/designs/veltrix-design-1.jpg',
  '/designs/veltrix-design-2.jpg',
  '/designs/veltrix-design-3.jpg',
  '/designs/veltrix-design-4.jpg'
];

async function updateScheduledPostsWithRealDesigns() {
  console.log('=== Updating Scheduled Posts in MongoDB Atlas with Authentic Veltrix Designs ===');

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

  console.log(`Found ${posts.length} scheduled posts in MongoDB Atlas.`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const designImage = DESIGN_IMAGES[i % DESIGN_IMAGES.length];

    // Ensure caption has exact contact details
    let caption = post.caption;
    if (!caption.includes('+2348087098270')) {
      caption = caption + `\n\n📲 WhatsApp: +2348087098270\n🌐 Website: Veltrixhub.ng\n👉 Follow: @officialveltrixhub`;
    }

    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        mediaUrls: [designImage],
        caption
      }
    });

    console.log(`[Post ${i + 1}] Updated with Design: ${designImage}`);
  }

  console.log('✅ All scheduled posts successfully updated with authentic Veltrix Hub design assets!');
}

updateScheduledPostsWithRealDesigns()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
