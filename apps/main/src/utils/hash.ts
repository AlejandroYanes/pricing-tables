import crypto from 'crypto';

export function hashString(text: string) {
  return crypto.createHash('md5').update(text).digest('hex')
}
