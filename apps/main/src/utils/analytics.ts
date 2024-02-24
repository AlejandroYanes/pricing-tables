/* eslint-disable max-len */
import type { Analytic } from '@dealo/models';

import initDb from './planet-scale';

export async function recordEvent(analytic: Omit<Analytic, 'createdAt' | 'variant'> & { variant?: string }) {
  const db = initDb();

  await db.transaction(async (tx) => {
    await tx.execute(
      'INSERT INTO Analytic (id, experiment, variant, event, visitorId, country, region, device, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        analytic.id,
        analytic.experiment,
        analytic.variant ?? 'default',
        analytic.event,
        analytic.visitorId ?? null,
        analytic.country ?? null,
        analytic.region ?? null,
        analytic.device ?? null,
      ]
    );
  });
}
