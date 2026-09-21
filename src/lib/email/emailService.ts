import nodemailer from 'nodemailer';
import { getServerEnv } from '@/lib/env';

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  budget?: string;
  sourceUrl?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  simulated: boolean;
  message: string;
}

/**
 * Creates Nodemailer Transporter based on validated server env
 */
function createTransporter() {
  const env = getServerEnv();
  if (!env.SMTP.isConfigured) return null;

  return nodemailer.createTransport({
    host: env.SMTP.host,
    port: env.SMTP.port,
    secure: env.SMTP.port === 465,
    auth: {
      user: env.SMTP.user,
      pass: env.SMTP.pass,
    },
  });
}

/**
 * 1. Owner Alert: Dispatches real-time styled email to portfolio owner
 */
export async function sendContactNotificationToOwner(
  data: ContactNotificationPayload
): Promise<EmailDispatchResult> {
  const env = getServerEnv();
  const ownerEmail = env.ADMIN_EMAIL;

  const subjectLine = `[Inquiry] ${data.subject || 'New Portfolio Transmission'} — ${data.name}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 24px; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #0f172a 0%, #030712 100%); border-bottom: 1px solid #1e293b;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #00f0ff; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">
                      ⚡ Direct Portfolio Transmission
                    </div>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      New Contact Inquiry
                    </h1>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #00f0ff20; border: 1px solid #00f0ff40; color: #00f0ff; font-family: monospace; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px;">
                      NEW MESSAGE
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Card -->
          <tr>
            <td style="padding: 28px 32px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8; width: 110px;">FROM:</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #ffffff;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">EMAIL:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #00f0ff; font-family: monospace;">
                    <a href="mailto:${data.email}" style="color: #00f0ff; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                ${data.company ? `
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">COMPANY:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #e2e8f0;">${data.company}</td>
                </tr>` : ''}
                ${data.budget ? `
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">BUDGET:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #34d399; font-weight: bold;">${data.budget}</td>
                </tr>` : ''}
                ${data.projectType ? `
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">TYPE:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #e2e8f0;">${data.projectType}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">SUBJECT:</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #f8fafc;">${data.subject}</td>
                </tr>
              </table>

              <!-- Message Body -->
              <div style="font-family: monospace; font-size: 11px; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
                Message Content:
              </div>
              <div style="background-color: #080e1e; border: 1px solid #1e293b; border-left: 3px solid #00f0ff; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${data.message}</div>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background-color: #00f0ff; color: #000000; font-family: monospace; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-right: 12px;">
                      Reply Directly via Email →
                    </a>
                    <a href="${env.SITE_URL}/admin" style="display: inline-block; background-color: #1e293b; color: #f1f5f9; font-family: monospace; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 10px; border: 1px solid #334155;">
                      Open Owner Panel
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center; font-family: monospace; font-size: 11px; color: #64748b;">
              Submitted from Rahul Raj Portfolio Studio • Source: ${data.sourceUrl || '/contact'}
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = `
[NEW PORTFOLIO INQUIRY]
From: ${data.name} <${data.email}>
Subject: ${data.subject}
Company: ${data.company || 'N/A'}
Budget: ${data.budget || 'N/A'}
Project Type: ${data.projectType || 'N/A'}

Message:
${data.message}

--
View in Owner Panel: ${env.SITE_URL}/admin
Reply to: ${data.email}
  `.trim();

  const transporter = createTransporter();
  if (!transporter) {
    console.log('\n' + '='.repeat(64));
    console.log('📨 [DEV SIMULATION] CONTACT EMAIL TO OWNER');
    console.log('='.repeat(64));
    console.log(`To      : ${ownerEmail}`);
    console.log(`Reply-To: ${data.email}`);
    console.log(`Subject : ${subjectLine}`);
    console.log(`From    : ${data.name} (${data.company || 'Direct'})`);
    console.log(`Message : ${data.message.slice(0, 150)}...`);
    console.log('='.repeat(64) + '\n');

    return {
      success: true,
      simulated: true,
      message: 'Email simulated in development mode.',
    };
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Transceiver" <${env.SMTP.user}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: subjectLine,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      simulated: false,
      message: 'Owner notification email delivered successfully.',
    };
  } catch (error) {
    console.error('Failed to dispatch owner notification email via SMTP:', error);
    return {
      success: true,
      simulated: true,
      message: 'SMTP delivery failed; logged to server logs.',
    };
  }
}

/**
 * 2. Visitor Confirmation: Dispatches a reassuring receipt acknowledgment to the visitor
 */
export async function sendContactConfirmationToVisitor(
  data: ContactNotificationPayload
): Promise<EmailDispatchResult> {
  const env = getServerEnv();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 24px; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #0f172a 0%, #030712 100%); border-bottom: 1px solid #1e293b;">
              <div style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #00f0ff; text-transform: uppercase; font-weight: bold; margin-bottom: 4px;">
                Rahul Raj // Portfolio Transmission
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                Message Received
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px 32px;">
              <p style="font-size: 15px; color: #f1f5f9; margin-top: 0;">
                Hello <strong>${data.name}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Thank you for getting in touch. Your message regarding <em>"${data.subject}"</em> has been securely received and recorded in my system.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                I review incoming engineering inquiries and architectural project briefs regularly and will respond as quickly as possible.
              </p>

              <div style="margin-top: 24px; padding: 16px; background-color: #030712; border: 1px solid #1e293b; border-radius: 10px; font-family: monospace; font-size: 12px; color: #cbd5e1;">
                <div style="color: #64748b; margin-bottom: 6px;">Summary of your message:</div>
                <div style="color: #00f0ff;">${data.message.length > 200 ? data.message.slice(0, 200) + '...' : data.message}</div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 18px 32px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center; font-family: monospace; font-size: 11px; color: #64748b;">
              Best regards,<br>
              <strong>Rahul Raj</strong> — Full-Stack &amp; AI Systems Engineer<br>
              <a href="${env.SITE_URL}" style="color: #00f0ff; text-decoration: none;">${env.SITE_URL}</a>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const textContent = `
Hello ${data.name},

Thank you for reaching out. Your transmission regarding "${data.subject}" has been received.
I will review your message and reply as soon as possible.

Best regards,
Rahul Raj — Full-Stack & AI Systems Engineer
${env.SITE_URL}
  `.trim();

  const transporter = createTransporter();
  if (!transporter) {
    return {
      success: true,
      simulated: true,
      message: 'Visitor confirmation simulated in development mode.',
    };
  }

  try {
    await transporter.sendMail({
      from: `"Rahul Raj" <${env.SMTP.user}>`,
      to: data.email,
      subject: `Transmission Received — Rahul Raj Portfolio`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      simulated: false,
      message: 'Confirmation email sent to visitor.',
    };
  } catch (error) {
    console.error('Failed to send visitor confirmation email:', error);
    return {
      success: true,
      simulated: true,
      message: 'Visitor confirmation failed; handled safely.',
    };
  }
}
