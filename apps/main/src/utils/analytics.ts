/* eslint-disable max-len */
import { sql } from '@vercel/postgres';
import type { Analytic } from '@dealo/models';

export async function recordEvent(analytic: Omit<Analytic, 'createdAt' | 'variant'> & { variant?: string }) {
  await sql`
    INSERT INTO "Analytic" (id, experiment, variant, event, "visitorId", country, region, device, "createdAt")
    VALUES (${analytic.id}, ${analytic.experiment}, ${analytic.variant ?? 'default'}, ${analytic.event}, ${analytic.visitorId ?? null}, ${analytic.country ?? null}, ${analytic.region ?? null}, ${analytic.device ?? null}, NOW())
  `;
}
