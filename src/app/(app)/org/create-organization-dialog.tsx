'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createOrganizationAction } from './actions';

export default function CreateOrganizationDialog() {
  const router = useRouter();

  async function handleCreateOrganization() {
    try {
      const organization = await createOrganizationAction({ name: 'New Organization' });

      toast.success('Organization created successfully');
      router.push(`/org/${organization.slug}`);
    } catch (error) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization');
    }
  }

  return <Button onClick={handleCreateOrganization}>Create Organization</Button>;
}
