import { deleteProjectAction } from '@/app/(app)/projects/[projectId]/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type ProjectModel } from '@/db/schema';
import { Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import ConfirmationDialog from '../common/confirmation-dialog';

type ProjectActionsDropdownProps = {
  trigger: React.ReactNode;
  project: ProjectModel;
};

export default function ProjectActionsDropdown({ trigger, project }: ProjectActionsDropdownProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDeleteProject() {
    setIsDeleting(true);

    try {
      await deleteProjectAction({ projectId: project.id });

      setIsOpen(false);
      toast.success('Project deleted successfully');

      if (pathname.includes(project.id)) {
        router.replace('/projects');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild aria-label="Project actions menu">
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ConfirmationDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="text-destructive size-4" />
              Delete
            </DropdownMenuItem>
          }
          title="Delete Project"
          description={`Are you sure you want to delete ${project.name} ?`}
          type="destructive"
          onConfirm={handleDeleteProject}
          isLoading={isDeleting}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
