'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TypographyP } from '@/components/ui/typography';
import { cn } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createProjectAction } from './actions';

const newProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});

type NewProjectFormData = z.infer<typeof newProjectSchema>;

type CreateProjectDialogProps = {
  trigger?: React.ReactNode;
  buttonRef?: React.ComponentProps<'button'>['ref'];
  hidden?: boolean;
};

export default function CreateProjectDialog({
  trigger,
  buttonRef,
  hidden = false,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const t = useTranslations('projects.actions.create');
  const tCommon = useTranslations('common');

  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NewProjectFormData>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { name: '', description: '' },
  });

  async function onSubmit(data: NewProjectFormData) {
    const { name: _name, description: _description } = data;

    const name = _name.trim();
    const description =
      _description === undefined || _description.trim().length === 0 ? undefined : _description;

    try {
      const result = await createProjectAction({ name, description });
      const { data: newProject } = result;

      if (result.code === 402) {
        toast.error(t('toast.limits-exceeded'));
        setIsOpen(false);
        reset();
        return;
      }

      if (newProject === undefined) {
        toast.error(t('toast.create-error'));
        return;
      }

      setIsOpen(false);
      reset();

      toast.success(t('toast.created-success'));
      router.push(`/projects/${newProject.id}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error(t('toast.create-error'));
    }
  }

  const nameValue = watch('name');
  const buttonDisabled = isSubmitting || nameValue.trim().length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button ref={buttonRef} className={cn(hidden && 'hidden')}>
            {t('title')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto">
          <div className="space-y-6 px-0">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name.label')}</Label>
              <Input
                id="name"
                placeholder={t('form.name.placeholder')}
                {...register('name')}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <TypographyP className="text-destructive text-sm">
                  {errors.name.message}
                </TypographyP>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('form.description.label')}</Label>
              <Textarea
                id="description"
                placeholder={t('form.description.placeholder')}
                {...register('description')}
                className={cn(errors.description && 'border-destructive')}
              />
              {errors.description && (
                <TypographyP className="text-destructive text-sm">
                  {errors.description.message}
                </TypographyP>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{tCommon('cancel')}</Button>
            </DialogClose>
            <Button type="submit" disabled={buttonDisabled}>
              {isSubmitting ? tCommon('loading') : t('form.buttons.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
