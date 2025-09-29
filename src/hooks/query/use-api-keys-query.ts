import { type ApiKeyModel } from '@/db/schema';
import { betterFetch } from '@better-fetch/fetch';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useApiKeysQuery(
  options?: Omit<UseQueryOptions<ApiKeyModel[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ApiKeyModel[]>({
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
    ...options,
  });
}

async function fetchApiKeys() {
  const { data: apiKeys, error } = await betterFetch<ApiKeyModel[]>('/api/api-keys', {
    cache: 'no-store',
  });

  if (error !== null) {
    console.error(`Failed to fetch API keys: ${error.message}`);
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return Array.isArray(apiKeys) ? apiKeys : [];
}
