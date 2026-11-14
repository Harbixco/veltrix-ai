import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { aiAssistantService } from './assistant.service';

export async function getConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const conversations = await aiAssistantService.getConversations(
      req.user!.organizationId,
      req.user!.userId
    );

    res.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const conversationId = String(req.params.id);
    const messages = await aiAssistantService.getMessages(req.user!.organizationId, conversationId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error: any) {
    next(error);
  }
}

export async function sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { conversationId, message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Message content is required' }
      });
    }

    const reply = await aiAssistantService.sendMessage(
      req.user!.organizationId,
      req.user!.userId,
      { conversationId, message }
    );

    res.json({
      success: true,
      data: reply
    });
  } catch (error: any) {
    next(error);
  }
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const conversationId = String(req.params.id);
    const result = await aiAssistantService.deleteConversation(req.user!.organizationId, conversationId);

    res.json(result);
  } catch (error: any) {
    next(error);
  }
}
