import { honoClient } from '@/app/api/client';
import { type ApiKeyModel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useApiKeysQuery(options?: QueryOptions<ApiKeyModel[]> & { userId?: string }) {
  return useQuery<ApiKeyModel[]>({
    ...options,
    queryKey: ['api-keys', options?.userId],
    queryFn: fetchApiKeys,
    enabled: options?.userId !== undefined && (options?.enabled ?? true),
  });
}

async function fetchApiKeys(): Promise<ApiKeyModel[]> {
  const response = await honoClient.api.apiKeys.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch API keys: ${response.statusText}`);
  }

  const data = await response.json();

  const formated = data.map((apiKey) => ({
    ...apiKey,
    lastRefillAt: dateOrNull(apiKey.lastRefillAt),
    lastRequest: dateOrNull(apiKey.lastRequest),
    expiresAt: dateOrNull(apiKey.expiresAt),
    createdAt: new Date(apiKey.createdAt),
    updatedAt: new Date(apiKey.updatedAt),
  }));

  return formated;
}

function dateOrNull(dateString: string | null): Date | null {
  return dateString !== null ? new Date(dateString) : null;
}
