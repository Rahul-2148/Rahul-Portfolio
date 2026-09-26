/**
 * Centralized Server-Side Environment Configuration & Validation
 * 
 * Ensures all required secrets and configuration keys are validated at runtime.
 * Never imports or leaks server secrets to client components.
 * Zero hardcoded fallback credentials in source code.
 */

interface ServerEnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB_URI: string;
  ADMIN_PASSCODE: string;
  ADMIN_EMAIL: string;
  SITE_URL: string;
  SMTP: {
    isConfigured: boolean;
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  CLOUDINARY: {
    isConfigured: boolean;
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  AI: {
    isConfigured: boolean;
    hasGemini: boolean;
    hasGroq: boolean;
    hasOpenAI: boolean;
    geminiKey: string;
    groqKey: string;
    openaiKey: string;
    geminiModel: string;
    groqModel: string;
  };
}

let cachedEnv: ServerEnvConfig | null = null;

export function getServerEnv(): ServerEnvConfig {
  if (cachedEnv) return cachedEnv;

  const NODE_ENV = (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';
  const MONGODB_URI = process.env.MONGODB_URI || '';
  // Secure: Initial passcode provided via environment.
  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rahulraj21480@gmail.com';
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || vercelUrl || 'http://localhost:3000';

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const isSmtpConfigured = Boolean(smtpUser && smtpPass && smtpPass.trim().length > 0);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const groqKey = process.env.GROQ_API_KEY || '';
  const openaiKey = process.env.OPENAI_API_KEY || '';
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const isAiConfigured = Boolean(geminiKey || groqKey || openaiKey);

  // Runtime Diagnostic Logging for Missing Secrets in Production
  if (!MONGODB_URI && NODE_ENV === 'production') {
    console.error('⚠️ [SECURITY ALERT] MONGODB_URI is not configured in production environment!');
  }
  if (!ADMIN_PASSCODE && NODE_ENV === 'production') {
    console.error('⚠️ [SECURITY ALERT] ADMIN_PASSCODE is not set in environment! Admin panel is locked.');
  }

  cachedEnv = {
    NODE_ENV,
    MONGODB_URI,
    ADMIN_PASSCODE,
    ADMIN_EMAIL,
    SITE_URL,
    SMTP: {
      isConfigured: isSmtpConfigured,
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
    },
    CLOUDINARY: {
      isConfigured: isCloudinaryConfigured,
      cloudName,
      apiKey,
      apiSecret,
    },
    AI: {
      isConfigured: isAiConfigured,
      hasGemini: Boolean(geminiKey),
      hasGroq: Boolean(groqKey),
      hasOpenAI: Boolean(openaiKey),
      geminiKey,
      groqKey,
      openaiKey,
      geminiModel,
      groqModel,
    },
  };

  return cachedEnv;
}
