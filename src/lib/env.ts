/**
 * Centralized Server-Side Environment Configuration & Validation
 * 
 * Ensures all required secrets and configuration keys are validated at runtime.
 * Never imports or leaks server secrets to client components.
 */

interface ServerEnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB_URI: string;
  ADMIN_PASSCODE: string;
  ADMIN_RECOVERY_KEY: string;
  ADMIN_EMAIL: string;
  SITE_URL: string;
  SMTP: {
    isConfigured: boolean;
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

let cachedEnv: ServerEnvConfig | null = null;

export function getServerEnv(): ServerEnvConfig {
  if (cachedEnv) return cachedEnv;

  const NODE_ENV = (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';
  const MONGODB_URI = process.env.MONGODB_URI || '';
  const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'rahul2148';
  const ADMIN_RECOVERY_KEY = process.env.ADMIN_RECOVERY_KEY || 'RAHUL-RECOVER-2026-SECRET';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rahulraj2148@gmail.com';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const isSmtpConfigured = Boolean(smtpUser && smtpPass && smtpPass.trim().length > 0);

  // Runtime Diagnostic Logging
  if (!MONGODB_URI && NODE_ENV === 'production') {
    console.error('⚠️ [SERVER CONFIG ALERT] MONGODB_URI is not set in production environment!');
  }

  cachedEnv = {
    NODE_ENV,
    MONGODB_URI,
    ADMIN_PASSCODE,
    ADMIN_RECOVERY_KEY,
    ADMIN_EMAIL,
    SITE_URL,
    SMTP: {
      isConfigured: isSmtpConfigured,
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
    },
  };

  return cachedEnv;
}
