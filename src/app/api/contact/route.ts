import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongodb';
import { ContactMessageModel } from '@/lib/db/models/ContactMessage';
import { AnalyticsEventModel } from '@/lib/db/models/AnalyticsEvent';
import { checkRateLimit, getClientIp, hashIp } from '@/lib/server/rateLimiter';
import { sendContactNotificationToOwner, sendContactConfirmationToVisitor } from '@/lib/email/emailService';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name cannot exceed 120 characters'),
  email: z.string().trim().email('Invalid email address format').max(180, 'Email cannot exceed 180 characters'),
  subject: z.string().trim().max(200, 'Subject cannot exceed 200 characters').optional().default('New Portfolio Inquiry'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
  company: z.string().trim().max(120).optional().default(''),
  projectType: z.string().trim().max(80).optional().default(''),
  budget: z.string().trim().max(80).optional().default(''),
  // Anti-bot honeypot field (hidden from human visitors)
  website: z.string().optional().default(''),
  honeypot: z.string().optional().default(''),
  sourceUrl: z.string().optional().default('/contact'),
});

export async function POST(request: NextRequest) {
  try {
    const rawIp = getClientIp(request);
    const ipHash = hashIp(rawIp);

    // 1. Sliding Window Rate Limiting (5 contact requests per 15 minutes per IP)
    const rateLimit = checkRateLimit(`contact:${ipHash}`, 5, 900);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many submissions. Please wait ${rateLimit.resetInSeconds} seconds before trying again.`,
          resetInSeconds: rateLimit.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
          message: 'Validation failed. Please verify the input fields.',
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, company, projectType, budget, website, honeypot, sourceUrl } =
      parseResult.data;

    // 2. Anti-Bot Honeypot Trap
    // Automated spambots fill all form inputs, including invisible honeypot fields
    if ((website && website.trim().length > 0) || (honeypot && honeypot.trim().length > 0)) {
      console.warn(`[BOT BLOCKED] Contact honeypot triggered by IP hash: ${ipHash}`);
      // Return 200 OK so the bot thinks it succeeded, but drop the payload
      return NextResponse.json({
        success: true,
        message: 'Your message has been processed.',
      });
    }

    // 3. Database Persistence in MongoDB
    await connectToDatabase();

    const savedMessage = await ContactMessageModel.create({
      name,
      email,
      subject: subject || 'New Portfolio Inquiry',
      message,
      company,
      projectType,
      budget,
      status: 'unread',
      ipHash,
      sourceUrl,
    });

    // 4. Dispatch Email Notifications via Nodemailer (Non-blocking)
    const emailPayload = {
      name,
      email,
      subject: subject || 'New Portfolio Inquiry',
      message,
      company,
      projectType,
      budget,
      sourceUrl,
    };

    // Owner notification + visitor confirmation
    Promise.allSettled([
      sendContactNotificationToOwner(emailPayload),
      sendContactConfirmationToVisitor(emailPayload),
    ]).catch((err) => console.error('Background email dispatch warning:', err));

    // 5. Track Analytics Telemetry Event
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    AnalyticsEventModel.create({
      eventType: 'contact_submit',
      visitorId: ipHash,
      path: sourceUrl || '/contact',
      device,
      browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other',
      os: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Linux') ? 'Linux' : 'Other',
      metadata: {
        messageId: savedMessage._id.toString(),
        subject: subject || 'New Portfolio Inquiry',
      },
      timestamp: new Date(),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been securely recorded and dispatched. I will respond to you promptly.',
      messageId: savedMessage._id,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while processing your inquiry.',
      },
      { status: 500 }
    );
  }
}
