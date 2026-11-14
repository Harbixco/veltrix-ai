import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { calendarService } from './calendar.service';

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
    const { mediaUrls, caption } = req.body || {};
    const result = await calendarService.publishNow(
      req.user!.organizationId,
      postId,
      { mediaUrls, caption }
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
