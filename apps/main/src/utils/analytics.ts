import type { Analytic } from '@dealo/models';

import initDb from './planet-scale';

export async function recordEvent(analytic: Omit<Analytic, 'createdAt' | 'variant'> & { variant?: string }) {
  const db = initDb();

  await db.transaction(async (tx) => {
    await tx.execute(
      'INSERT INTO Analytic (id, experiment, variant, event, country, region, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [analytic.id, analytic.experiment, analytic.variant ?? 'default', analytic.event, analytic.country ?? null, analytic.region ?? null]
    );
  });
}
