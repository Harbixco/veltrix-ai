import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { calendarService } from './calendar.service';
import { prisma } from '../../db';
import { encryptToken } from '../../utils/crypto';

export async function getCalendarPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    const posts = await calendarService.getCalendarPosts(
      req.user!.organizationId,
      startDate ? String(startDate) : undefined,
      endDate ? String(endDate) : undefined
    );

    res.json({
      success: true,
      data: posts
    });
  } catch (error: any) {
    next(error);
  }
}

export async function schedulePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { socialPageId, caption, mediaUrls, scheduledFor } = req.body;

    if (!caption || !scheduledFor) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Caption and scheduled publication date/time are required' }
      });
    }

    const scheduled = await calendarService.schedulePost(req.user!.organizationId, {
      socialPageId,
      caption,
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : mediaUrls ? [mediaUrls] : [],
      scheduledFor
    });

    res.status(201).json({
      success: true,
      data: scheduled
    });
  } catch (error: any) {
    next(error);
  }
}

export async function cancelScheduledPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const postId = String(req.params.id);
    const result = await calendarService.cancelScheduledPost(req.user!.organizationId, postId);

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export async function publishNow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const postId = String(req.params.id);
    const { mediaUrls, caption, firstComment } = req.body || {};
    const result = await calendarService.publishNow(
      req.user!.organizationId,
      postId,
      { mediaUrls, caption, firstComment }
    );

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export async function updatePostMedia(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const postId = String(req.params.id);
    const { mediaUrls } = req.body;
    const result = await calendarService.updatePostMedia(
      req.user!.organizationId,
      postId,
      mediaUrls
    );

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export async function batchApplyFacebookFlyer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { flyerUrl, dateStr, postIds } = req.body;
    const result = await calendarService.batchApplyFacebookFlyer(
      req.user!.organizationId,
      { flyerUrl, dateStr, postIds }
    );

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export async function cronPublishDue(req: any, res: Response, next: NextFunction) {
  try {
    const result = await calendarService.publishDuePosts();
    res.json(result);
  } catch (error: any) {
    next(error);
  }
}

export async function quickUpdateToken(req: any, res: Response) {
  try {
    const { rawToken, pageId } = req.body || {};
    const trimmed = (rawToken || '').trim();
    if (!trimmed) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token cannot be empty' }
      });
    }

    // Verify token with Meta Graph API
    const metaCheck = (await fetch(`https://graph.facebook.com/v19.0/me?access_token=${trimmed}`).then((r) =>
      r.json()
    )) as any;

    if (metaCheck.error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'META_TOKEN_INVALID',
          message: metaCheck.error.message || 'Token is rejected by Meta Graph API'
        }
      });
    }

    // Update in MongoDB for all relevant Facebook pages
    const targetPageId = pageId || '112352500475248';
    const encryptedToken = encryptToken(trimmed);

    await prisma.socialPage.updateMany({
      where: {
        OR: [{ pageId: targetPageId }, { pageId: '153585724815630' }]
      },
      data: { encryptedToken, isActive: true }
    });

    await prisma.socialAccount.updateMany({
      where: {
        OR: [{ accountId: targetPageId }, { accountId: '153585724815630' }]
      },
      data: { encryptedToken, isActive: true }
    });

    // Auto-trigger publishing of due posts immediately
    const publishResult = await calendarService.publishDuePosts();

    return res.json({
      success: true,
      message: `Meta Page Access Token validated and saved! Page/User: ${metaCheck.name || 'Facebook Page'}`,
      metaUser: metaCheck,
      publishResult
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { message: err.message || 'Server failed to update token' }
    });
  }
}

export async function republishNov17Morning(req: any, res: Response) {
  try {
    const post = await prisma.scheduledPost.findUnique({
      where: { id: '6afa22b8c6917815c0abede9' },
      include: { page: true }
    });
    if (!post || !post.page) {
      return res.status(404).json({ success: false, error: 'Post or page not found' });
    }

    const { decryptToken } = await import('../../utils/crypto');
    const decryptedToken = decryptToken(post.page.encryptedToken);
    const publicPhotoUrl = 'https://veltrixhubai.vercel.app/designs/morning/red-card-nov17.jpg';

    // 1. Post photo to Facebook
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${post.page.pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: publicPhotoUrl,
        caption: post.caption,
        access_token: decryptedToken
      })
    });
    const fbData = (await fbRes.json()) as any;

    if (fbData.error) {
      return res.status(400).json({ success: false, error: fbData.error });
    }

    // 2. Post WhatsApp first comment
    if (fbData.id && decryptedToken) {
      try {
        const commentEndpoint = `https://graph.facebook.com/v19.0/${fbData.id}/comments?access_token=${encodeURIComponent(decryptedToken)}`;
        await fetch(commentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            message: "Want to test our AI assistant live or discuss a high-converting website? Send Veltrix Hub a message on WhatsApp:\nhttps://wa.me/2348087098270"
          }).toString()
        });
      } catch (e) {}
    }

    // 3. Delete previous text-only post (112352500475248_1810847814377208)
    try {
      await fetch(`https://graph.facebook.com/v19.0/112352500475248_1810847814377208?access_token=${encodeURIComponent(decryptedToken)}`, {
        method: 'DELETE'
      });
    } catch (e) {}

    // 4. Update ScheduledPost and SocialPost in MongoDB
    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        mediaUrls: ['/designs/morning/red-card-nov17.jpg'],
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    await prisma.socialPost.updateMany({
      where: { externalPostId: '112352500475248_1810847814377208' },
      data: {
        externalPostId: fbData.id,
        mediaType: 'IMAGE',
        mediaUrls: ['/designs/morning/red-card-nov17.jpg'],
        permalinkUrl: `https://facebook.com/${fbData.id}`
      }
    });

    return res.json({
      success: true,
      message: 'Nov 17 Morning post replaced with red card flyer on Facebook successfully!',
      photoId: fbData.id,
      permalinkUrl: `https://facebook.com/${fbData.id}`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
