import { type ApiKeyModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useApiKeysQuery(options?: QueryOptions<ApiKeyModel[]>) {
  return useQuery<ApiKeyModel[]>({
    ...options,
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
  });
}

async function fetchApiKeys() {
  const { data: apiKeys = [], error } = await betterFetch<ApiKeyModel[]>('/api/apiKeys', {
    cache: 'no-store',
  });

  if (error !== null) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return Array.isArray(apiKeys) ? apiKeys : [];
}
