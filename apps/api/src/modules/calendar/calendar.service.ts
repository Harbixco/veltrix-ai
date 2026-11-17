import { prisma } from '../../db';
import { decryptToken } from '../../utils/crypto';
import { twitterService } from '../twitter/twitter.service';

export interface SchedulePostDTO {
  socialPageId?: string;
  caption: string;
  mediaUrls?: string[];
  scheduledFor: string | Date;
}

export class CalendarService {
  /**
   * Retrieves scheduled posts and recent published posts for the organization
   */
  async getCalendarPosts(organizationId: string, startDate?: string, endDate?: string) {
    // 1. Fetch scheduled posts
    let scheduled = await prisma.scheduledPost.findMany({
      where: {
        organizationId,
        ...(startDate && endDate
          ? {
              scheduledFor: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            }
          : {})
      },
      include: {
        page: {
          select: {
            pageName: true,
            pageId: true
          }
        }
      },
      orderBy: { scheduledFor: 'asc' }
    });

    // 2. Fetch published historical posts
    const published = await prisma.socialPost.findMany({
      where: {
        organizationId,
        ...(startDate && endDate
          ? {
              publishedAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
              }
            }
          : {})
      },
      include: {
        page: {
          select: {
            pageName: true,
            pageId: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 20
    });

    return {
      scheduledPosts: scheduled.map((p) => {
        const isTwitter =
          p.page?.pageId === 'AbiodunBuilds' ||
          p.caption.includes('AbiodunBuilds') ||
          p.caption.includes('#ReactJS') ||
          p.caption.includes('Abiodun Builds');
        return {
          id: p.id,
          socialPageId: p.socialPageId,
          caption: p.caption,
          mediaUrls: p.mediaUrls || [],
          scheduledFor: p.scheduledFor.toISOString(),
          status: p.status,
          channel: isTwitter ? ('TWITTER' as const) : ('FACEBOOK' as const),
          page: p.page
            ? {
                pageName: p.page.pageName,
                pageId: p.page.pageId
              }
            : {
                pageName: isTwitter ? 'Abiodun Builds (@AbiodunBuilds)' : 'Veltrix Hub',
                pageId: isTwitter ? 'AbiodunBuilds' : '153585724815630'
              }
        };
      }),
      publishedPosts: published.map((p) => {
        const isTwitter =
          p.page?.pageId === 'AbiodunBuilds' ||
          p.caption.includes('AbiodunBuilds') ||
          p.caption.includes('#ReactJS');
        return {
          id: p.id,
          socialPageId: p.socialPageId,
          pageName: p.page?.pageName || (isTwitter ? 'Abiodun Builds (@AbiodunBuilds)' : 'Veltrix Hub'),
          caption: p.caption,
          mediaUrls: p.mediaUrls || [],
          contentPillar: p.contentPillar,
          publishedAt: p.publishedAt.toISOString(),
          channel: isTwitter ? ('TWITTER' as const) : ('FACEBOOK' as const),
          permalinkUrl: p.permalinkUrl,
          metrics: p.metrics
        };
      })
    };
  }

  /**
   * Schedules a new post for future publication
   */
  async schedulePost(organizationId: string, data: SchedulePostDTO) {
    let pageId = data.socialPageId;

    if (!pageId) {
      const activePage = await prisma.socialPage.findFirst({
        where: { organizationId, isActive: true }
      });
      if (!activePage) {
        throw new Error('No active Facebook Page found. Please connect a Page first in Facebook Accounts.');
      }
      pageId = activePage.id;
    }

    return prisma.scheduledPost.create({
      data: {
        organizationId,
        socialPageId: pageId,
        caption: data.caption,
        mediaUrls: data.mediaUrls || [],
        scheduledFor: new Date(data.scheduledFor),
        status: 'SCHEDULED'
      },
      include: {
        page: {
          select: {
            pageName: true,
            pageId: true
          }
        }
      }
    });
  }

  /**
   * Cancels a scheduled post
   */
  async cancelScheduledPost(organizationId: string, postId: string) {
    const post = await prisma.scheduledPost.findFirst({
      where: { id: postId, organizationId }
    });

    if (!post) {
      throw new Error('Scheduled post not found or access denied');
    }

    await prisma.scheduledPost.delete({
      where: { id: postId }
    });

    return { success: true, message: 'Scheduled post cancelled successfully' };
  }

  /**
   * Publishes an approved post immediately to the connected Meta Facebook Page
   */
  async publishNow(
    organizationId: string,
    postId: string,
    override?: { mediaUrls?: string[]; caption?: string; firstComment?: string }
  ) {
    let post = null;

    if (/^[0-9a-fA-F]{24}$/.test(postId)) {
      post = await prisma.scheduledPost.findFirst({
        where: { id: postId },
        include: { page: true }
      });
    }

    if (!post && override?.caption) {
      // Fallback matching by caption
      post = await prisma.scheduledPost.findFirst({
        where: { caption: override.caption },
        include: { page: true }
      });
    }

    if (!post) {
      // Synthetic ID fallback (e.g. sched_nov15_fb1 or sched_nov14_fb)
      const dayMatch = postId.match(/nov(\d+)/i);
      const isFb = !postId.toLowerCase().includes('x') && !postId.toLowerCase().includes('tw');
      const isMorning = postId.includes('1') || postId.includes('am') || postId.includes('morning');
      if (dayMatch) {
        const day = parseInt(dayMatch[1], 10);
        const start = new Date(Date.UTC(2026, 10, day, 0, 0, 0));
        const end = new Date(Date.UTC(2026, 10, day, 23, 59, 59));
        const posts = await prisma.scheduledPost.findMany({
          where: {
            scheduledFor: { gte: start, lte: end }
          },
          include: { page: true },
          orderBy: { scheduledFor: isMorning ? 'asc' : 'desc' }
        });
        post = posts.find((p) =>
          isFb
            ? !p.caption.includes('#ReactJS') && !p.caption.includes('AbiodunBuilds')
            : p.caption.includes('#ReactJS') || p.caption.includes('AbiodunBuilds')
        ) || posts[0] || null;
      }
    }

    if (!post) {
      // Fallback: create on the fly under Veltrixhq page
      const defaultPage = await prisma.socialPage.findFirst({
        where: { pageId: '112352500475248' }
      });
      if (defaultPage) {
        post = await prisma.scheduledPost.create({
          data: {
            organizationId,
            socialPageId: defaultPage.pageId,
            caption: override?.caption || 'New Veltrix Hub Post',
            mediaUrls: override?.mediaUrls || [],
            scheduledFor: new Date(),
            status: 'SCHEDULED'
          },
          include: { page: true }
        });
      } else {
        throw new Error('Scheduled post not found or access denied');
      }
    }

    // Determine effective media and caption (prioritize client-uploaded flyer)
    let effectiveMediaUrls =
      override?.mediaUrls && override.mediaUrls.length > 0
        ? override.mediaUrls
        : (post.mediaUrls || []);

    const effectiveCaption =
      override?.caption !== undefined
        ? override.caption
        : post.caption;

    // Persist mediaUrls to MongoDB if provided
    if (override?.mediaUrls && override.mediaUrls.length > 0) {
      await prisma.scheduledPost
        .update({
          where: { id: post.id },
          data: { mediaUrls: override.mediaUrls }
        })
        .catch((e) => console.warn('Could not update post mediaUrls in DB:', e.message));
    }

    let publishedExternalId = `post_${Date.now()}`;
    let permalinkUrl = `https://facebook.com/${post.page?.pageId || 'Veltrixhq'}/posts/${publishedExternalId}`;
    let isLivePublished = false;

    const isTwitter =
      post.socialPageId === 'AbiodunBuilds' ||
      post.page?.pageId === 'AbiodunBuilds' ||
      post.caption?.includes('#ReactJS') ||
      post.caption?.includes('AbiodunBuilds');

    // Auto-heal safeguard for Facebook posts: Never allow a Facebook morning post to publish as text-only
    if (!isTwitter && effectiveMediaUrls.length === 0) {
      const dateObj = new Date(post.scheduledFor);
      const hour = dateObj.getUTCHours();
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthStr = monthNames[dateObj.getUTCMonth()];
      const dayStr = String(dateObj.getUTCDate()).padStart(2, '0');
      const dateKey = `${monthStr}${dayStr}`;

      if (hour === 8) {
        // Morning post: automatically attach the red background visual card
        const morningCardUrl = `/designs/morning/red-card-${dateKey}.jpg`;
        effectiveMediaUrls = [morningCardUrl];
        console.info(`[Auto-Heal] Auto-attached morning red card ${morningCardUrl} for post ${post.id}`);
        await prisma.scheduledPost
          .update({
            where: { id: post.id },
            data: { mediaUrls: [morningCardUrl] }
          })
          .catch(() => {});
      }
    }

    if (isTwitter) {
      let twitterCreds = undefined;
      try {
        if (post.page?.encryptedToken) {
          const parsed = JSON.parse(decryptToken(post.page.encryptedToken));
          if (parsed.apiKey && parsed.accessToken) {
            twitterCreds = parsed;
          }
        }
      } catch (e) {}

      const twitterRes = await twitterService.publishTweet(effectiveCaption, twitterCreds);
      publishedExternalId = twitterRes.tweetId || `tweet_${Date.now()}`;
      permalinkUrl = twitterRes.permalinkUrl || 'https://twitter.com/AbiodunBuilds';
      isLivePublished = twitterRes.success;
    } else {
      // Direct Meta Graph API publishing (Metricool workflow)
      if (!post.page.encryptedToken) {
        throw new Error(
          'No access token found for this Facebook page. Please update your Page Access Token in Social Accounts to enable direct publishing.'
        );
      }

      const decryptedToken = decryptToken(post.page.encryptedToken);

      if (
        !decryptedToken ||
        decryptedToken.startsWith('simulated_') ||
        decryptedToken.startsWith('test_') ||
        decryptedToken.startsWith('mock_')
      ) {
        throw new Error(
          'Direct publishing to Facebook requires a live Meta Page Access Token (EAAG...). Currently, this page has a placeholder token. Please update your token in Social Accounts to post directly like Metricool.'
        );
      }

      try {
      // Treat as media if user uploaded a flyer (Base64) or if a curated flyer / morning red card is attached
      const rawMedia = effectiveMediaUrls.length > 0 ? effectiveMediaUrls[0] : '';
      const isAutoTemplate = rawMedia.includes('/designs/flyers/') || rawMedia.includes('veltrix-design');
      const hasMedia = Boolean(rawMedia) && !isAutoTemplate;

      if (hasMedia) {
        const media = effectiveMediaUrls[0];
        if (media.startsWith('data:image/')) {
          // Base64 flyer multipart upload via FormData
          const [header, base64Data] = media.split(';base64,');
          const mimeType = header ? header.replace('data:', '') : 'image/jpeg';
          const buffer = Buffer.from(base64Data, 'base64');
          const blob = new Blob([buffer], { type: mimeType });

          const formData = new FormData();
          formData.append('source', blob, 'flyer.jpg');
          if (effectiveCaption) {
            formData.append('caption', effectiveCaption);
          }
          formData.append('access_token', decryptedToken);

          const response = await fetch(`https://graph.facebook.com/v19.0/${post.page.pageId}/photos`, {
            method: 'POST',
            body: formData
          });

          const result = (await response.json()) as any;
          if (result.error) {
            throw new Error(`Meta Graph API Error: ${result.error.message || 'Failed to upload photo'} (Code: ${result.error.code || 'unknown'})`);
          }

          if (result.id) {
            publishedExternalId = result.id;
            permalinkUrl = `https://facebook.com/${publishedExternalId}`;
            isLivePublished = true;
          }
        } else {
          // Public image URL or relative path on Vercel frontend
          const publicPhotoUrl = media.startsWith('http')
            ? media
            : `https://veltrixhubai.vercel.app${media.startsWith('/') ? '' : '/'}${media}`;

          console.info(`[Meta Direct Publish] Publishing photo from public URL: ${publicPhotoUrl}`);
          const response = await fetch(`https://graph.facebook.com/v19.0/${post.page.pageId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: publicPhotoUrl,
              caption: effectiveCaption,
              access_token: decryptedToken
            })
          });

          const result = (await response.json()) as any;
          if (result.error) {
            throw new Error(`Meta Graph API Error: ${result.error.message || 'Failed to publish photo'} (Code: ${result.error.code || 'unknown'})`);
          }

          if (result.id) {
            publishedExternalId = result.id;
            permalinkUrl = `https://facebook.com/${publishedExternalId}`;
            isLivePublished = true;
          }
        }
      } else {
        // Text-only post via /feed
        const response = await fetch(`https://graph.facebook.com/v19.0/${post.page.pageId}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: effectiveCaption,
            access_token: decryptedToken
          })
        });

        const result = (await response.json()) as any;
        if (result.error) {
          throw new Error(`Meta Graph API Error: ${result.error.message || 'Failed to publish post'} (Code: ${result.error.code || 'unknown'})`);
        }

        if (result.id) {
          publishedExternalId = result.id;
          permalinkUrl = `https://facebook.com/${publishedExternalId}`;
          isLivePublished = true;
        }
      }

      // Automatically post first comment directly to Facebook (Metricool style)
      if (publishedExternalId && decryptedToken) {
        try {
          const firstCommentMessage =
            override?.firstComment ||
            (post as any)?.firstComment ||
            "Want to test our AI assistant live or discuss a high-converting website? Send Veltrix Hub a message on WhatsApp:\nhttps://wa.me/2348087098270";

          // Try standard Meta Graph API comment endpoint with access_token in URL query and form-encoded body
          const commentEndpoint = `https://graph.facebook.com/v19.0/${publishedExternalId}/comments?access_token=${encodeURIComponent(decryptedToken)}`;
          const commentRes = await fetch(commentEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ message: firstCommentMessage }).toString()
          });

          const commentResult = (await commentRes.json()) as any;
          if (commentResult.error) {
            console.warn('[Meta First Comment Error]', commentResult.error.message || commentResult.error);
            // Also try with simple post ID if publishedExternalId has pageId_postId format
            if (publishedExternalId.includes('_')) {
              const simpleId = publishedExternalId.split('_')[1];
              const retryRes = await fetch(
                `https://graph.facebook.com/v19.0/${simpleId}/comments?access_token=${encodeURIComponent(decryptedToken)}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: new URLSearchParams({ message: firstCommentMessage }).toString()
                }
              );
              const retryResult = (await retryRes.json()) as any;
              if (retryResult.id) {
                console.info(`[Meta Direct Publish] First comment posted with simple ID ${simpleId}:`, retryResult.id);
              } else {
                console.warn('[Meta First Comment Retry Warning]', retryResult.error?.message || retryResult.error);
              }
            }
          } else if (commentResult.id) {
            console.info(`[Meta Direct Publish] First comment automatically posted to ${publishedExternalId}:`, commentResult.id);
          }
        } catch (commentErr) {
          console.warn('[Meta First Comment Warning] Could not post first comment:', commentErr);
        }
      }
      } catch (apiErr: any) {
        console.error('[Meta Direct Publish Error]', apiErr);
        throw apiErr;
      }
    }

    // 1. Update ScheduledPost status
    const updatedScheduled = await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        mediaUrls: effectiveMediaUrls
      }
    });

    // 2. Ingest into SocialPost as a verified published post (clean real metrics)
    const initialMetrics = {
      reach: 0,
      impressions: 0,
      reactions: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      videoViews: 0,
      engagementRate: 0
    };

    const publishedPost = await prisma.socialPost.upsert({
      where: {
        socialPageId_externalPostId: {
          socialPageId: post.socialPageId,
          externalPostId: publishedExternalId
        }
      },
      update: {
        caption: effectiveCaption,
        mediaType: effectiveMediaUrls.length > 0 ? 'IMAGE' : 'STATUS',
        mediaUrls: effectiveMediaUrls,
        permalinkUrl,
        publishedAt: new Date()
      },
      create: {
        organizationId,
        socialPageId: post.socialPageId,
        externalPostId: publishedExternalId,
        caption: effectiveCaption,
        mediaType: effectiveMediaUrls.length > 0 ? 'IMAGE' : 'STATUS',
        mediaUrls: effectiveMediaUrls,
        permalinkUrl,
        publishedAt: new Date(),
        contentPillar: 'BUSINESS_GROWTH',
        metrics: initialMetrics
      }
    });

    // 3. Create initial metric snapshot if none exists
    const existingSnapshot = await prisma.metricSnapshot.findFirst({
      where: { socialPostId: publishedPost.id }
    });
    if (!existingSnapshot) {
      await prisma.metricSnapshot.create({
        data: {
          socialPostId: publishedPost.id,
          metrics: initialMetrics
        }
      });
    }

    return {
      success: true,
      livePublished: isLivePublished,
      scheduledPost: updatedScheduled,
      publishedPost,
      permalinkUrl
    };
  }

  /**
   * Updates flyer media for a specific scheduled post
   */
  async updatePostMedia(organizationId: string, postId: string, mediaUrls: string[]) {
    let post = null;

    if (/^[0-9a-fA-F]{24}$/.test(postId)) {
      post = await prisma.scheduledPost.findFirst({
        where: { id: postId }
      });
    }

    if (!post) {
      // Fallback for synthetic IDs (e.g. sched_nov15_fb1 or sched_nov14_fb)
      const dayMatch = postId.match(/nov(\d+)/i);
      const isFb = !postId.toLowerCase().includes('x') && !postId.toLowerCase().includes('tw');
      const isMorning = postId.includes('1') || postId.includes('am') || postId.includes('morning');
      if (dayMatch) {
        const day = parseInt(dayMatch[1], 10);
        const start = new Date(Date.UTC(2026, 10, day, 0, 0, 0));
        const end = new Date(Date.UTC(2026, 10, day, 23, 59, 59));
        const posts = await prisma.scheduledPost.findMany({
          where: {
            scheduledFor: { gte: start, lte: end }
          },
          include: { page: true },
          orderBy: { scheduledFor: isMorning ? 'asc' : 'desc' }
        });
        post = posts.find((p) =>
          isFb
            ? !p.caption.includes('#ReactJS') && !p.caption.includes('AbiodunBuilds')
            : p.caption.includes('#ReactJS') || p.caption.includes('AbiodunBuilds')
        ) || posts[0] || null;
      }
    }

    if (!post) {
      throw new Error('Scheduled post not found');
    }

    const updated = await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : mediaUrls ? [mediaUrls] : []
      },
      include: {
        page: {
          select: {
            pageName: true,
            pageId: true
          }
        }
      }
    });

    return {
      success: true,
      data: updated
    };
  }

  /**
   * Applies a single flyer across all Facebook posts for a given date or all 3 Facebook accounts
   */
  async batchApplyFacebookFlyer(
    organizationId: string,
    data: { flyerUrl: string; dateStr?: string; postIds?: string[] }
  ) {
    const { flyerUrl, dateStr, postIds } = data;

    let targetPostIds: string[] = [];

    if (postIds && postIds.length > 0) {
      targetPostIds = postIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
      const syntheticIds = postIds.filter((id) => !/^[0-9a-fA-F]{24}$/.test(id));
      for (const synId of syntheticIds) {
        const dayMatch = synId.match(/nov(\d+)/i);
        if (dayMatch) {
          const day = parseInt(dayMatch[1], 10);
          const start = new Date(Date.UTC(2026, 10, day, 0, 0, 0));
          const end = new Date(Date.UTC(2026, 10, day, 23, 59, 59));
          const match = await prisma.scheduledPost.findFirst({
            where: {
              scheduledFor: { gte: start, lte: end },
              NOT: {
                caption: { contains: 'AbiodunBuilds' }
              }
            },
            select: { id: true }
          });
          if (match && !targetPostIds.includes(match.id)) {
            targetPostIds.push(match.id);
          }
        }
      }
    } else if (dateStr) {
      const startOfDay = new Date(dateStr);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);

      const posts = await prisma.scheduledPost.findMany({
        where: {
          scheduledFor: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        select: { id: true, caption: true }
      });

      // Filter out twitter posts
      targetPostIds = posts
        .filter((p) => !p.caption.includes('#ReactJS') && !p.caption.includes('AbiodunBuilds'))
        .map((p) => p.id);
    }

    if (targetPostIds.length > 0) {
      await prisma.scheduledPost.updateMany({
        where: {
          id: { in: targetPostIds }
        },
        data: {
          mediaUrls: flyerUrl ? [flyerUrl] : []
        }
      });
    }

    return {
      success: true,
      updatedCount: targetPostIds.length,
      flyerUrl
    };
  }

  /**
   * Automated cron publisher: finds all due scheduled posts and publishes them directly to Facebook
   */
  async publishDuePosts() {
    const now = new Date();
    const duePosts = await prisma.scheduledPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: { lte: now }
      },
      include: { page: true }
    });

    const results: Array<{ id: string; status: string; permalinkUrl?: string; error?: string }> = [];
    for (const post of duePosts) {
      try {
        const res = await this.publishNow(post.organizationId, post.id);
        results.push({ id: post.id, status: 'PUBLISHED', permalinkUrl: res.permalinkUrl });
      } catch (err: any) {
        console.error(`[Cron Publish Error] Post ${post.id}:`, err.message);
        results.push({ id: post.id, status: 'FAILED', error: err.message });
      }
    }

    return {
      success: true,
      timestamp: now.toISOString(),
      checkedCount: duePosts.length,
      publishedCount: results.filter((r) => r.status === 'PUBLISHED').length,
      results
    };
  }
}

export const calendarService = new CalendarService();
