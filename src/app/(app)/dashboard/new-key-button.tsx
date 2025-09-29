'use client';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { toast } from 'sonner';

export default function CreateKeyButton() {
  const [rawKey, setRawKey] = React.useState<string | null>(null);

  async function handleClick() {
    const { error, data } = await authClient.apiKey.create({
      name: 'project-key-one',
      expiresIn: 60 * 60 * 24 * 7,
      prefix: 'sk-',
    });

    if (error !== null) {
      toast.error(`Error creating API key: ${error.message}`);
      return;
    }

    setRawKey(data.key);
    toast.success('API key created successfully!');
  }

  return (
    <div>
      {rawKey !== null ? (
        <span>{rawKey}</span>
      ) : (
        <Button onClick={handleClick}>Create API Key</Button>
      )}
    </div>
  );
}
