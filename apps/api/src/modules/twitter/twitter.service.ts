import crypto from 'crypto';
import { prisma } from '../../db';
import { encryptToken, decryptToken } from '../../utils/crypto';

function generateOAuth1Header(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessSecret: string
): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: '1.0'
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
    .join('&');

  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessSecret)}`;

  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');

  oauthParams['oauth_signature'] = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(', ')}`;
}

export interface ConnectTwitterParams {
  organizationId: string;
  handle: string;
  displayName: string;
  followersCount?: number;
  bio?: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  accessSecret?: string;
}

export class TwitterService {
  /**
   * Retrieves all connected X (Twitter) accounts for an organization
   */
  async getConnectedAccounts(organizationId: string) {
    const pages = await prisma.socialPage.findMany({
      where: {
        organizationId,
        pageCategory: {
          in: ['X_TWITTER_PROFILE', 'X / Twitter Profile', 'TWITTER']
        },
        isActive: true
      },
      include: {
        account: true,
        _count: {
          select: { posts: true, scheduledPosts: true }
        }
      },
      orderBy: { lastSyncedAt: 'desc' }
    });

    return pages.map((p) => {
      let credentials = null;
      try {
        if (p.encryptedToken) {
          credentials = JSON.parse(decryptToken(p.encryptedToken));
        }
      } catch (e) {
        // Token was plain string or not JSON
      }

      return {
        id: p.id,
        handle: p.pageId.startsWith('@') ? p.pageId : `@${p.pageId}`,
        displayName: p.pageName,
        followersCount: p.fanCount,
        category: p.pageCategory,
        lastSyncedAt: p.lastSyncedAt,
        hasApiKeys: Boolean(credentials?.apiKey && credentials?.accessToken),
        postsCount: p._count.posts,
        scheduledPostsCount: p._count.scheduledPosts
      };
    });
  }

  /**
   * Connects or registers an X (Twitter) profile
   */
  async connectAccount(params: ConnectTwitterParams) {
    const cleanHandle = params.handle.replace(/^@/, '').trim();
    const pageId = cleanHandle;
    const displayName = params.displayName.trim() || cleanHandle;

    // Check if account already exists
    let socialAccount = await prisma.socialAccount.findFirst({
      where: {
        organizationId: params.organizationId,
        accountId: `twitter_${cleanHandle}`
      }
    });

    const tokenPayload = JSON.stringify({
      handle: cleanHandle,
      apiKey: params.apiKey || '',
      apiSecret: params.apiSecret || '',
      accessToken: params.accessToken || '',
      accessSecret: params.accessSecret || '',
      connectedAt: new Date().toISOString()
    });

    const encryptedToken = encryptToken(tokenPayload);

    if (!socialAccount) {
      socialAccount = await prisma.socialAccount.create({
        data: {
          organizationId: params.organizationId,
          provider: 'FACEBOOK_PROFILE', // Fallback enum value compatible with current client
          accountId: `twitter_${cleanHandle}`,
          accountName: `@${cleanHandle} (X / Twitter)`,
          encryptedToken,
          isActive: true
        }
      });
    }

    // Upsert SocialPage record representing the X Profile
    const page = await prisma.socialPage.upsert({
      where: {
        organizationId_pageId: {
          organizationId: params.organizationId,
          pageId
        }
      },
      update: {
        pageName: displayName,
        pageCategory: 'X_TWITTER_PROFILE',
        fanCount: params.followersCount || 0,
        encryptedToken,
        isActive: true,
        lastSyncedAt: new Date()
      },
      create: {
        organizationId: params.organizationId,
        socialAccountId: socialAccount.id,
        pageId,
        pageName: displayName,
        pageCategory: 'X_TWITTER_PROFILE',
        fanCount: params.followersCount || 0,
        encryptedToken,
        isActive: true,
        lastSyncedAt: new Date()
      }
    });

    return {
      id: page.id,
      handle: `@${cleanHandle}`,
      displayName: page.pageName,
      followersCount: page.fanCount,
      category: page.pageCategory,
      lastSyncedAt: page.lastSyncedAt
    };
  }

  /**
   * Disconnects an X (Twitter) profile
   */
  async disconnectAccount(organizationId: string, handle: string) {
    const cleanHandle = handle.replace(/^@/, '').trim();

    return prisma.socialPage.updateMany({
      where: {
        organizationId,
        pageId: cleanHandle,
        pageCategory: 'X_TWITTER_PROFILE'
      },
      data: {
        isActive: false
      }
    });
  }

  /**
   * Formats a post caption into an X-optimized tweet (under 280 characters)
   */
  formatForX(caption: string, includeCommentLink: boolean = false): { tweet: string; charCount: number; isWithinLimit: boolean } {
    let clean = caption.trim();

    // Remove multi-line contact footers if any
    clean = clean.split('👉 Want a free initial review')[0].trim();

    // If longer than 250 characters, create punchy summary with hook and CTA
    if (clean.length > 250) {
      const lines = clean.split('\n').filter((l) => l.trim().length > 0);
      const hook = lines[0] || '';
      const secondLine = lines[1] || '';
      clean = `${hook}\n\n${secondLine.slice(0, 100)}...\n\n👉 DM us or visit veltrixhub.ng`;
    }

    if (includeCommentLink) {
      clean += `\n💬 wa.me/2348087098270`;
    }

    const charCount = clean.length;
    return {
      tweet: clean,
      charCount,
      isWithinLimit: charCount <= 280
    };
  }

  /**
   * Publishes a tweet directly to X (Twitter) API v2
   */
  async publishTweet(
    caption: string,
    credentials?: { apiKey?: string; apiSecret?: string; accessToken?: string; accessSecret?: string }
  ): Promise<{ success: boolean; tweetId?: string; permalinkUrl?: string; message?: string }> {
    const creds = {
      apiKey: credentials?.apiKey || process.env.TWITTER_API_KEY || '',
      apiSecret: credentials?.apiSecret || process.env.TWITTER_API_SECRET || '',
      accessToken: credentials?.accessToken || process.env.TWITTER_ACCESS_TOKEN || '',
      accessSecret: credentials?.accessSecret || process.env.TWITTER_ACCESS_SECRET || ''
    };

    const { tweet } = this.formatForX(caption);

    if (!creds.apiKey || !creds.accessToken || !creds.apiSecret || !creds.accessSecret) {
      // Keys not configured; return assisted publishing link
      return {
        success: true,
        tweetId: `tweet_${Date.now()}`,
        permalinkUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
        message: 'Published in Assisted Mode (direct API keys not provided).'
      };
    }

    const url = 'https://api.twitter.com/2/tweets';
    const authHeader = generateOAuth1Header(
      'POST',
      url,
      creds.apiKey,
      creds.apiSecret,
      creds.accessToken,
      creds.accessSecret
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader
      },
      body: JSON.stringify({ text: tweet })
    });

    const data = (await response.json()) as any;
    if (data.data?.id) {
      return {
        success: true,
        tweetId: data.data.id,
        permalinkUrl: `https://twitter.com/i/status/${data.data.id}`
      };
    }

    throw new Error(`X (Twitter) API error: ${data.detail || data.title || JSON.stringify(data)}`);
  }
}

export const twitterService = new TwitterService();
