'use client';

import { authClient } from '@/auth/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type AcceptInvitationCardProps = {
  invitationId: string;
  organizationName: string;
  organizationSlug: string;
  organizationLogo: string | null;
  role: string;
  status: string;
  expiresAt: string;
};

export default function AcceptInvitationCard({
  invitationId,
  organizationName,
  organizationSlug,
  organizationLogo,
  role,
  status,
  expiresAt,
}: AcceptInvitationCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isExpired = new Date(expiresAt) < new Date();
  const isPending = status === 'pending';
  const canAct = isPending && !isExpired;

  async function handleAccept() {
    setIsLoading(true);

    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to accept invitation');
      setIsLoading(false);
      return;
    }

    toast.success(`You have joined ${organizationName}`);
    router.push(`/org/${organizationSlug}`);
  }

  async function handleReject() {
    setIsLoading(true);

    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    });

    if (error) {
      toast.error(error.message ?? 'Failed to decline invitation');
      setIsLoading(false);
      return;
    }

    toast.success('Invitation declined');
    router.push('/dashboard');
  }

  const initials = organizationName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Avatar className="h-16 w-16 rounded-lg">
            {organizationLogo && <AvatarImage src={organizationLogo} alt={organizationName} />}
            <AvatarFallback className="bg-primary text-primary-foreground rounded-lg text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>Join {organizationName}</CardTitle>
        <CardDescription>
          You have been invited to join as{' '}
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canAct && (
          <div className="bg-muted rounded-lg p-4 text-center">
            {isExpired && (
              <p className="text-muted-foreground text-sm">
                This invitation has expired. Please ask the organization admin to send a new one.
              </p>
            )}
            {!isPending && !isExpired && (
              <p className="text-muted-foreground text-sm">
                This invitation has already been{' '}
                {status === 'accepted'
                  ? 'accepted'
                  : status === 'rejected'
                    ? 'declined'
                    : 'canceled'}
                .
              </p>
            )}
          </div>
        )}

        {canAct && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isLoading}
            >
              Decline
            </Button>
            <Button className="flex-1" onClick={handleAccept} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Accept Invitation'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
