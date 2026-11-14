import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

export function tenantGuard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'TENANT_CONTEXT_MISSING',
        message: 'No active organization context found for this session'
      }
    });
  }

  // If a request parameter specifies an organizationId, enforce that it matches the user's active tenant
  if (req.params.organizationId && req.params.organizationId !== req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CROSS_TENANT_FORBIDDEN',
        message: 'Access to the requested organization is forbidden'
      }
    });
  }

  next();
}
