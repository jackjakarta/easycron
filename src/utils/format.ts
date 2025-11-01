import { cnanoid } from './nanoid';

export function slugifyName({
  name,
  withNanoId = false,
}: {
  name: string;
  withNanoId?: boolean;
}): string {
  if (withNanoId) {
    return `${name} ${cnanoid(4)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
