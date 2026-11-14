import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import businessRoutes from './modules/business/business.routes';
import metaRoutes from './modules/meta/meta.routes';
import twitterRoutes from './modules/twitter/twitter.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import contentRoutes from './modules/content/content.routes';
import designRoutes from './modules/designs/design.routes';
import leadRoutes from './modules/leads/lead.routes';
import seoRoutes from './modules/seo/seo.routes';
import automationRoutes from './modules/automation/automation.routes';
import calendarRoutes from './modules/calendar/calendar.routes';
import assistantRoutes from './modules/assistant/assistant.routes';
import campaignRoutes from './modules/campaigns/campaign.routes';
import reportRoutes from './modules/reports/report.routes';
import competitorRoutes from './modules/competitors/competitor.routes';
import settingsRoutes from './modules/settings/settings.routes';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === config.clientUrl
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Versioned API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/meta', metaRoutes);
app.use('/api/v1/twitter', twitterRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/designs', designRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/seo', seoRoutes);
app.use('/api/v1/automation', automationRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/ai', assistantRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/competitors', competitorRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Global Error Handler
app.use(errorHandler);

import { calendarService } from './modules/calendar/calendar.service';

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`🚀 Veltrix AI Hub API Server listening on port ${config.port} [${config.env}]`);
  });

  // Automated background cron: checks every 60 seconds for due posts
  setInterval(async () => {
    try {
      const res = await calendarService.publishDuePosts();
      if (res.publishedCount > 0) {
        console.log(`[Auto-Cron] Automatically published ${res.publishedCount} due post(s) to Facebook.`);
      }
    } catch (e: any) {
      console.warn('[Auto-Cron Error]', e.message);
    }
  }, 60 * 1000);
}

export default app;
