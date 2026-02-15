import { ac, admin, member, owner } from '@/auth/permissions';
import { dbGetUserOwnedOrganizationsCount } from '@/db/functions/organization';
import { sendUserActionEmail } from '@/email/send';
import { getUserActiveSubscription } from '@/stripe/subscription';
import { getBaseUrlFromHeaders } from '@/utils/host';
import { organization } from 'better-auth/plugins';

export function getOrganizationPlugin() {
  return organization({
    ac,
    roles: {
      owner,
      admin,
      member,
    },
    requireEmailVerificationOnInvitation: true,
    allowUserToCreateOrganization: async (user) => {
      const [subscription, userOrganziationsCount] = await Promise.all([
        getUserActiveSubscription({ referenceId: user.id }),
        dbGetUserOwnedOrganizationsCount({ userId: user.id }),
      ]);

      if (userOrganziationsCount >= subscription.limits.organizationsAmount) {
        return false;
      }

      return true;
    },
    async sendInvitationEmail(data) {
      const { organization, invitation } = data;
      const searchParams = new URLSearchParams({
        inviteId: invitation.id,
        slug: organization.slug,
      });

      const baseUrl = await getBaseUrlFromHeaders();
      const inviteLink = `${baseUrl}/org/accept-invitation?${searchParams.toString()}`;

      const result = await sendUserActionEmail({
        to: invitation.email,
        action: 'organization-invite',
        actionUrl: inviteLink,
        extra: { organizationName: organization.name },
      });

      if (!result.success) {
        console.error('Error sending organization invite email:', result.error);
        throw new Error('Could not send organization invitation email');
      }
    },
  });
}
