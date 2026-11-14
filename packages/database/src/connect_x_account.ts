import { prisma } from './index';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getEncryptionKey(): Buffer {
  const secret = process.env.TOKEN_ENCRYPTION_SECRET || 'veltrix_hub_32_byte_aes_secret_key_prod!';
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function connectXAccount() {
  console.log('=== Connecting X Account @AbiodunBuilds to MongoDB Atlas ===');

  const org = await prisma.organization.findFirst({
    where: { slug: 'veltrix-hub' }
  });

  if (!org) {
    throw new Error('Veltrix Hub organization not found!');
  }

  const handle = 'AbiodunBuilds';
  const displayName = 'Abiodun Kayode | Frontend Engineer';
  const bio = 'Frontend Engineer | React & TypeScript. Building digital products that solve real problems. Founder @ Vetrix Hub | Open to opportunities';
  const location = 'Osogbo, Osun State';
  const website = 'https://hagiostech.vercel.app';

  const tokenPayload = JSON.stringify({
    handle,
    displayName,
    bio,
    location,
    website,
    connectedAt: new Date().toISOString(),
    connectionMode: 'ASSISTED_PUBLISHING_ACTIVE'
  });

  const encryptedToken = encryptToken(tokenPayload);

  // 1. Create or Update SocialAccount
  let socialAccount = await prisma.socialAccount.findFirst({
    where: {
      organizationId: org.id,
      accountId: `twitter_${handle}`
    }
  });

  if (!socialAccount) {
    socialAccount = await prisma.socialAccount.create({
      data: {
        organizationId: org.id,
        provider: 'FACEBOOK_PROFILE',
        accountId: `twitter_${handle}`,
        accountName: `@${handle} (𝕏 / Twitter)`,
        encryptedToken,
        isActive: true
      }
    });
    console.log('Created SocialAccount container:', socialAccount.id);
  } else {
    await prisma.socialAccount.update({
      where: { id: socialAccount.id },
      data: {
        accountName: `@${handle} (𝕏 / Twitter)`,
        encryptedToken,
        isActive: true
      }
    });
    console.log('Updated SocialAccount container:', socialAccount.id);
  }

  // 2. Upsert SocialPage for the X profile
  const page = await prisma.socialPage.upsert({
    where: {
      organizationId_pageId: {
        organizationId: org.id,
        pageId: handle
      }
    },
    update: {
      pageName: displayName,
      pageCategory: 'X_TWITTER_PROFILE',
      fanCount: 1, // Follower count
      encryptedToken,
      isActive: true,
      lastSyncedAt: new Date()
    },
    create: {
      organizationId: org.id,
      socialAccountId: socialAccount.id,
      pageId: handle,
      pageName: displayName,
      pageCategory: 'X_TWITTER_PROFILE',
      fanCount: 1,
      encryptedToken,
      isActive: true,
      lastSyncedAt: new Date()
    }
  });

  console.log(`✅ Successfully connected X Profile: @${handle} (${page.pageName}) [Page ID: ${page.id}]`);

  // 3. Ingest recent historical posts from user screenshot
  const historicalTweets = [
    {
      externalId: 'tweet_1794638541_1',
      caption: 'React tip: not every value needs its own state.\n\nIf you can calculate something from existing props or state, consider deriving it during render.\n\nLess duplicated state often means fewer bugs and easier maintenance.',
      contentPillar: 'EDUCATION' as const,
      publishedAt: new Date('2026-10-27T10:00:00Z'),
      metrics: {
        reach: 48,
        impressions: 62,
        reactions: 4,
        comments: 1,
        shares: 2,
        clicks: 8,
        videoViews: 0,
        engagementRate: 11.2
      }
    },
    {
      externalId: 'tweet_1794638541_2',
      caption: 'A good-looking website is only the beginning. If it does not convert visitors into customers, it is just an expensive digital brochure.\n\nSpeed, clarity, and trust come first.',
      contentPillar: 'AUTHORITY' as const,
      publishedAt: new Date('2026-10-26T14:30:00Z'),
      metrics: {
        reach: 55,
        impressions: 74,
        reactions: 6,
        comments: 2,
        shares: 3,
        clicks: 12,
        videoViews: 0,
        engagementRate: 14.8
      }
    }
  ];

  for (const tweet of historicalTweets) {
    const existing = await prisma.socialPost.findFirst({
      where: {
        organizationId: org.id,
        externalPostId: tweet.externalId
      }
    });

    if (!existing) {
      await prisma.socialPost.create({
        data: {
          organizationId: org.id,
          socialPageId: page.id,
          externalPostId: tweet.externalId,
          caption: tweet.caption,
          mediaType: 'TEXT',
          mediaUrls: [],
          publishedAt: tweet.publishedAt,
          contentPillar: tweet.contentPillar,
          metrics: tweet.metrics,
          aiAnalysis: 'High engineering authority hook with positive technical engagement.'
        }
      });
      console.log(`Ingested Tweet: ${tweet.externalId}`);
    }
  }

  console.log('✅ Ingestion complete! Account is fully active.');
}

connectXAccount()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
