import { Button } from '@/components/ui/button';
import { type ProjectModel } from '@/db/schema';
import { Plus } from 'lucide-react';

import CreateWebhookDialog from './create-endpoint-dialog';

type HeaderSectionProps = {
  projects: ProjectModel[];
};

export default function HeaderSection({ projects }: HeaderSectionProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-foreground mb-2 text-4xl font-bold">Webhook Endpoints</h1>
        <p className="text-muted-foreground">
          Manage and monitor your webhook endpoints for job execution events
        </p>
      </div>
      <CreateWebhookDialog
        projects={projects}
        trigger={
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Endpoint
          </Button>
        }
      />
    </div>
  );
}
