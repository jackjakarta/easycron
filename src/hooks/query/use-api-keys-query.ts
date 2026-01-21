import { honoClient } from '@/app/api/client';
import { type ApiKeyModel } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';

import { type QueryOptions } from './types';

export function useApiKeysQuery(options?: QueryOptions<ApiKeyModel[]>) {
  return useQuery<ApiKeyModel[]>({
    ...options,
    queryKey: ['api-keys'],
    queryFn: fetchApiKeys,
  });
}

async function fetchApiKeys(): Promise<ApiKeyModel[]> {
  const response = await honoClient.api.apiKeys.$get();

  if (!response.ok) {
    console.error(`Failed to fetch API keys: ${response.statusText}`);
    throw new Error(`Failed to fetch API keys: ${response.statusText}`);
  }

  const data = await response.json();

  const formated = data.map((apiKey) => ({
    ...apiKey,
    createdAt: new Date(apiKey.createdAt),
    updatedAt: new Date(apiKey.updatedAt),
    lastRefillAt: apiKey.lastRefillAt ? new Date(apiKey.lastRefillAt) : null,
    lastRequest: apiKey.lastRequest ? new Date(apiKey.lastRequest) : null,
    expiresAt: apiKey.expiresAt ? new Date(apiKey.expiresAt) : null,
  }));

  return formated;
}
