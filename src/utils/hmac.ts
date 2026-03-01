import { cnanoid } from './nanoid';

export function createHmacSigningKey({ noPrefix = false }: { noPrefix?: boolean } = {}) {
  const prefix = 'whsec';
  const key = cnanoid(42);

  if (noPrefix) {
    return key;
  }

  return `${prefix}_${key}`;
}
