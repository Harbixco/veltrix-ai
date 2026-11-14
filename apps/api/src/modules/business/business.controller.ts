import { Response, NextFunction } from 'express';
import { prisma } from '@veltrix/database';
import { AuthenticatedRequest } from '../../middleware/auth';

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { organizationId: req.user!.organizationId }
    });

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const orgId = req.user!.organizationId;
    const { businessName, tagline, description, mission, vision, industry, location, websiteUrl, contactEmail, whatsappNumber } = req.body;

    const profile = await prisma.businessProfile.upsert({
      where: { organizationId: orgId },
      update: {
        businessName,
        tagline,
        description,
        mission,
        vision,
        industry,
        location,
        websiteUrl,
        contactEmail,
        whatsappNumber
      },
      create: {
        organizationId: orgId,
        businessName: businessName || 'My Business',
        tagline,
        description: description || '',
        mission: mission || '',
        vision: vision || '',
        industry: industry || 'Technology',
        location: location || 'Nigeria',
        websiteUrl,
        contactEmail,
        whatsappNumber
      }
    });

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function getBrand(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const brand = await prisma.brandGuidelines.findUnique({
      where: { organizationId: req.user!.organizationId }
    });

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBrand(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const orgId = req.user!.organizationId;
    const { colors, typography, brandVoice, logoUrl, rules } = req.body;

    const brand = await prisma.brandGuidelines.upsert({
      where: { organizationId: orgId },
      update: {
        colors,
        typography,
        brandVoice,
        logoUrl,
        rules
      },
      create: {
        organizationId: orgId,
        colors: colors || {
          primary: '#0F172A',
          secondary: '#2563EB',
          accent: '#38BDF8',
          neutral: '#64748B',
          dark: '#020617',
          light: '#F8FAFC'
        },
        typography: typography || {
          headingFont: 'Plus Jakarta Sans',
          bodyFont: 'Inter'
        },
        brandVoice: brandVoice || 'Professional, educational, and results-oriented',
        logoUrl,
        rules: rules || []
      }
    });

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
}

export async function getServices(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      where: { organizationId: req.user!.organizationId },
      orderBy: { orderIndex: 'asc' }
    });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    next(error);
  }
}

export async function createService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { name, slug, description, benefits, painPoints, targetAudience, basePrice, currency, defaultCta } = req.body;

    const service = await prisma.service.create({
      data: {
        organizationId: req.user!.organizationId,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        benefits: benefits || [],
        painPoints: painPoints || [],
        targetAudience: targetAudience || '',
        basePrice,
        currency: currency || 'NGN',
        defaultCta: defaultCta || 'Learn more.'
      }
    });

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
}
