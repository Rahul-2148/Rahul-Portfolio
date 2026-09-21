import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { PresenceModel } from '@/lib/db/models/Presence';
import { getServerEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const env = getServerEnv();

  // 1. Process Memory & Uptime Telemetry
  const memoryUsage = process.memoryUsage();
  const memoryUsageMb = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 10) / 10;
  const uptimeSeconds = Math.round(process.uptime());

  // 2. Database Connection Latency Check
  let dbStatus: 'connected' | 'disconnected' = 'disconnected';
  let dbLatencyMs = 0;
  let activeOnlineVisitors = 0;

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const pingStart = Date.now();
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        dbLatencyMs = Date.now() - pingStart;
        dbStatus = 'connected';

        // Count online visitors in the last 45 seconds
        const activeThreshold = new Date(Date.now() - 45000);
        activeOnlineVisitors = await PresenceModel.countDocuments({
          lastSeenAt: { $gte: activeThreshold },
        });
      }
    }
  } catch (err) {
    console.error('Health check DB probe failed:', err);
    dbStatus = 'disconnected';
  }

  // 3. Email Engine Status
  const emailStatus = env.SMTP.isConfigured ? 'operational' : 'simulated';

  // 4. Overall Health Determination
  const overallStatus =
    dbStatus === 'connected' ? 'healthy' : 'degraded';

  const totalCheckDurationMs = Date.now() - startTime;

  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checkDurationMs: totalCheckDurationMs,
    services: {
      api: {
        status: 'operational',
        nodeVersion: process.version,
        uptimeSeconds,
        memoryUsageMb,
      },
      database: {
        status: dbStatus,
        provider: 'MongoDB Atlas',
        latencyMs: dbLatencyMs,
        readyState: mongoose.connection.readyState,
      },
      email: {
        status: emailStatus,
        mode: env.SMTP.isConfigured ? 'SMTP Live' : 'Dev Simulation',
        targetRecipient: env.ADMIN_EMAIL,
      },
      realtime: {
        status: 'operational',
        activeSessions: activeOnlineVisitors,
        heartbeatWindowSeconds: 45,
      },
    },
  });
}
