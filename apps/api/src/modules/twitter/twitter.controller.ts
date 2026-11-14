import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { twitterService } from './twitter.service';

export async function getAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const accounts = await twitterService.getConnectedAccounts(req.user!.organizationId);
    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    next(error);
  }
}

export async function connectAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { handle, displayName, followersCount, bio, apiKey, apiSecret, accessToken, accessSecret } = req.body;

    if (!handle) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'X (Twitter) handle is required.' }
      });
    }

    const account = await twitterService.connectAccount({
      organizationId: req.user!.organizationId,
      handle,
      displayName: displayName || handle,
      followersCount: followersCount ? parseInt(followersCount, 10) : 0,
      bio,
      apiKey,
      apiSecret,
      accessToken,
      accessSecret
    });

    res.status(201).json({
      success: true,
      data: account
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'CONNECT_ERROR', message: error.message }
    });
  }
}

export async function disconnectAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const handle = String(req.params.handle);

    await twitterService.disconnectAccount(req.user!.organizationId, handle);

    res.json({
      success: true,
      data: { message: `X Account ${handle} disconnected successfully` }
    });
  } catch (error) {
    next(error);
  }
}

export async function formatTweet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { caption, includeCommentLink } = req.body;

    if (!caption) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Caption is required' }
      });
    }

    const result = twitterService.formatForX(caption, Boolean(includeCommentLink));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}
