import { NextResponse } from 'next/server';
import openapiSpec from '../../../../public/openapi.json';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(openapiSpec, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-passcode',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
