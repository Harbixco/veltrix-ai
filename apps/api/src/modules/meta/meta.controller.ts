import { Response, NextFunction } from 'express';
import { prisma } from '../../db';
import { AuthenticatedRequest } from '../../middleware/auth';
import { metaService } from './meta.service';

export async function getPages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pages = await metaService.getConnectedPages(req.user!.organizationId);
    res.json({
      success: true,
      data: pages
    });
  } catch (error) {
    next(error);
  }
}

export async function getOAuthUrl(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const url = metaService.getOAuthUrl(req.user!.organizationId);
    res.json({
      success: true,
      data: {
        url,
        isConfigured: Boolean(process.env.META_APP_ID)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function connectPage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { pageId, pageName, pageCategory, fanCount, rawToken } = req.body;

    if (!pageId || !pageName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Page ID and Page Name are required' }
      });
    }

    const page = await metaService.connectPage({
      organizationId: req.user!.organizationId,
      pageId,
      pageName,
      pageCategory,
      fanCount: fanCount ? parseInt(fanCount, 10) : 0,
      rawToken: rawToken || `token_${Date.now()}`
    });

    res.status(201).json({
      success: true,
      data: page
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'CONNECT_ERROR', message: error.message }
    });
  }
}

export async function syncPage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pageId = String(req.params.pageId);

    const result = await metaService.syncPagePosts(req.user!.organizationId, pageId);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'SYNC_ERROR', message: error.message }
    });
  }
}

export async function updatePageToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pageId = String(req.params.pageId);
    const { rawToken } = req.body;

    if (!rawToken) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Page Access Token is required' }
      });
    }

    const page = await metaService.updatePageToken(req.user!.organizationId, pageId, rawToken);

    res.json({
      success: true,
      data: {
        message: 'Page Access Token updated successfully. Direct publishing is now authorized.',
        pageId: page.pageId,
        pageName: page.pageName
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: 'TOKEN_UPDATE_ERROR', message: error.message }
    });
  }
}

export async function disconnectPage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const pageId = String(req.params.pageId);

    await metaService.disconnectPage(req.user!.organizationId, pageId);

    res.json({
      success: true,
      data: { message: `Facebook Page ${pageId} disconnected successfully` }
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecentPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { pageId, limit } = req.query;

    const posts = await prisma.socialPost.findMany({
      where: {
        organizationId: req.user!.organizationId,
        ...(pageId ? { page: { pageId: String(pageId) } } : {})
      },
      include: {
        page: {
          select: { pageName: true, pageId: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit ? parseInt(String(limit), 10) : 20
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
}
