import { cnanoid } from './nanoid';

export function createHmacSigningKey() {
  const prefix = 'whsec';
  const key = cnanoid(42);

  return `${prefix}_${key}`;
}
