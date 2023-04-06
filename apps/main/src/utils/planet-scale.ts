import { connect } from '@planetscale/database'

import { serverEnv } from 'env/schema.mjs';

export default function initDb() {
  const config = {
    url: serverEnv.DATABASE_URL
  };

  return connect(config);
}
