import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as edgeConfig from '@vercel/edge-config';
import * as console from 'console';

export const config = {
  matcher: ['/'],
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const landingExperiment = edgeConfig.get('landing_page');
  console.log('landingExperiment', landingExperiment);
}
