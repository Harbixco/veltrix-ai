// Standard API Response Envelope
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// User & Auth Types
export interface AuthenticatedUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'MARKETER' | 'VIEWER';
}

// 5 Core Content Pillars
export type ContentPillar =
  | 'EDUCATION'
  | 'BUSINESS_GROWTH'
  | 'AUTHORITY'
  | 'INSPIRATION'
  | 'PROMOTION';

// Lead Stages
export type LeadStage =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

// Service Definition
export interface ServiceDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string[];
  painPoints: string[];
  targetAudience: string;
  basePrice?: number;
  currency: string;
  defaultCta: string;
  isActive: boolean;
  orderIndex: number;
}
