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
  trigger: React.ReactNode;
};

export default function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
  const queryClient = useQueryClient();
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
      await createProjectAction({ name, description });
      setIsOpen(false);
      reset();

      toast.success('Job created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Failed to update job:', error);
      toast.error('Failed to update job');
    }
  }

  const nameValue = watch('name');
  const buttonDisabled = isSubmitting || nameValue.trim().length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project with the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto">
          <div className="space-y-6 px-0">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
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
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={buttonDisabled}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
