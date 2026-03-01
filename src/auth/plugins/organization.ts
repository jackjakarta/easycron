import { ac, admin, member, owner } from '@/auth/permissions';
import { dbGetOrganizationMemberCount } from '@/db/functions/organization';
import { dbGetOrganizationSubscriptions } from '@/db/functions/subscription';
import { sendUserActionEmail } from '@/email/send';
import { updateStripeSubscriptionSeats } from '@/stripe/seats';
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
    allowUserToCreateOrganization: async (_user) => {
      return true;
    },
    organizationHooks: {
      beforeCreateInvitation: async ({ organization }) => {
        const subscriptions = await dbGetOrganizationSubscriptions({
          organizationId: organization.id,
        });

        const activeSubscription = subscriptions.find(
          (sub) => sub.status === 'active' || sub.status === 'trialing',
        );

        if (activeSubscription === undefined || activeSubscription.plan !== 'pro') {
          throw new Error('Upgrade to Pro to invite members.');
        }
      },
      afterAcceptInvitation: async ({ organization }) => {
        const subscriptions = await dbGetOrganizationSubscriptions({
          organizationId: organization.id,
        });

        const activeSubscription = subscriptions.find(
          (sub) => sub.status === 'active' || sub.status === 'trialing',
        );

        if (activeSubscription?.stripeSubscriptionId) {
          const memberCount = await dbGetOrganizationMemberCount({
            organizationId: organization.id,
          });

          await updateStripeSubscriptionSeats({
            stripeSubscriptionId: activeSubscription.stripeSubscriptionId,
            newSeatCount: memberCount,
          });
        }
      },
      afterRemoveMember: async ({ organization }) => {
        const subscriptions = await dbGetOrganizationSubscriptions({
          organizationId: organization.id,
        });

        const activeSubscription = subscriptions.find(
          (sub) => sub.status === 'active' || sub.status === 'trialing',
        );

        if (activeSubscription?.stripeSubscriptionId) {
          const memberCount = await dbGetOrganizationMemberCount({
            organizationId: organization.id,
          });

          await updateStripeSubscriptionSeats({
            stripeSubscriptionId: activeSubscription.stripeSubscriptionId,
            newSeatCount: memberCount,
          });
        }
      },
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
