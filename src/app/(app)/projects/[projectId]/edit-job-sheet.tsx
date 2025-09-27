'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { type JobModel } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const editJobSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  url: z.string().url('Invalid URL').max(2000, 'URL must be at most 2000 characters'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  cronExpression: z
    .string()
    .min(1, 'Cron expression is required')
    .max(100, 'Cron expression must be at most 100 characters'),
  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .max(100, 'Timezone must be at most 100 characters'),
  body: z.string().max(5000, 'Body must be at most 5000 characters').optional(),
});

type EditJobFormData = z.infer<typeof editJobSchema>;

type EditJobDialogProps = {
  job: JobModel;
  trigger: React.ReactNode;
};

export default function EditJobSheet({ trigger, job }: EditJobDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditJobFormData>({
    resolver: zodResolver(editJobSchema),
    defaultValues: {
      name: job.name,
      url: job.url,
      method: job.httpMethod,
      cronExpression: job.scheduleCron,
      timezone: job.timezone,
      body: job.body || '',
    },
  });

  async function onSubmit(data: EditJobFormData) {
    try {
      console.debug({ data });
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Failed to update job:', error);
      toast.error('Failed to update job');
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit job</SheetTitle>
          <SheetDescription>
            Make changes to your job here. Click save when you are done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-6 px-4">
            <div className="space-y-2">
              <Label htmlFor="name">Job Name</Label>
              <Input
                id="name"
                placeholder="Enter job name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/api/endpoint"
                {...register('url')}
                className={errors.url ? 'border-red-500' : ''}
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.method ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.method && <p className="text-sm text-red-500">{errors.method.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cronExpression">Cron Expression</Label>
              <Input
                id="cronExpression"
                placeholder="0 0 * * *"
                {...register('cronExpression')}
                className={errors.cronExpression ? 'border-red-500' : ''}
              />
              {errors.cronExpression && (
                <p className="text-sm text-red-500">{errors.cronExpression.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                Example: "0 0 * * *" runs daily at midnight
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="UTC"
                {...register('timezone')}
                className={errors.timezone ? 'border-red-500' : ''}
              />
              {errors.timezone && <p className="text-sm text-red-500">{errors.timezone.message}</p>}
              <p className="text-muted-foreground text-xs">
                Example: UTC, America/New_York, Europe/London
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Request Body (Optional)</Label>
              <Textarea
                id="body"
                placeholder="JSON payload for POST/PUT requests"
                rows={4}
                {...register('body')}
                className={errors.body ? 'border-red-500' : ''}
              />
              {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
