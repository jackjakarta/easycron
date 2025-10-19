import { deleteProjectAction } from '@/app/(app)/projects/[projectId]/actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type ProjectModel } from '@/db/schema';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const queryClient = useQueryClient();

  const t = useTranslations('projects.actions.delete-confirmation');
  const tCommon = useTranslations('common');

  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDeleteProject() {
    setIsDeleting(true);

    try {
      await deleteProjectAction({ projectId: project.id });

      setIsOpen(false);
      toast.success(t('toast.deleted-success'));

      if (pathname.includes(project.id)) {
        router.replace('/projects');
      }

      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(t('toast.delete-error'));
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
              {tCommon('delete')}
            </DropdownMenuItem>
          }
          title={t('title')}
          description={t('description', { projectName: project.name })}
          type="destructive"
          onConfirm={handleDeleteProject}
          isLoading={isDeleting}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
