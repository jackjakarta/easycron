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
    throw new Error(`Failed to fetch API keys: ${response.statusText}`);
  }

  const data = await response.json();

  const formated = data.map((apiKey) => ({
    ...apiKey,
    lastRefillAt: getDateOrNull(apiKey.lastRefillAt),
    lastRequest: getDateOrNull(apiKey.lastRequest),
    expiresAt: getDateOrNull(apiKey.expiresAt),
    createdAt: new Date(apiKey.createdAt),
    updatedAt: new Date(apiKey.updatedAt),
  }));

  return formated;
}

function getDateOrNull(dateString: string | null): Date | null {
  return dateString ? new Date(dateString) : null;
}
