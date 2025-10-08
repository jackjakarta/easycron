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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { httpMethodSchema } from '@/db/schema';
import { cn } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createJobAction } from '../actions';
import { jobFormSchema, type JobFormData } from '../schemas';
import GenerateCronExpression from './generate-cron-expression';

type CreateJobDialogProps = {
  trigger: React.ReactNode;
  projectId: string;
};

export default function CreateJobDialog({ trigger, projectId }: CreateJobDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  async function onSubmit(data: JobFormData) {
    const { body: _body } = data;
    const body = _body?.trim().length === 0 ? null : _body;

    const cleanedData = {
      ...data,
      body,
    };

    try {
      await createJobAction({ data: cleanedData, projectId });
      setIsOpen(false);
      reset();

      toast.success('Job created successfully');
      router.refresh();
    } catch (error) {
      console.error('Failed to update job:', error);
      toast.error('Failed to update job');
    }
  }

  const httpMethodValue = watch('httpMethod');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>Create a new job with the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto">
          <div className="space-y-6 px-4">
            <div className="space-y-2">
              <Label htmlFor="name">Job Name</Label>
              <Input
                id="name"
                placeholder="Enter job name"
                {...register('name')}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/api/endpoint"
                {...register('url')}
                className={cn(errors.url && 'border-destructive')}
              />
              {errors.url && <p className="text-destructive text-sm">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="httpMethod">HTTP Method</Label>
              <Controller
                name="httpMethod"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={errors.httpMethod ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                    <SelectContent>
                      {httpMethodSchema.options.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.httpMethod && (
                <p className="text-destructive text-sm">{errors.httpMethod.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="scheduleCron">Cron Expression</Label>
                <GenerateCronExpression
                  trigger={
                    <Button variant="outline" type="button" size="sm">
                      Natural Language
                    </Button>
                  }
                  onFinish={(value) => setValue('scheduleCron', value)}
                />
              </div>
              <Input
                id="scheduleCron"
                placeholder="0 0 * * *"
                {...register('scheduleCron')}
                className={cn(errors.scheduleCron && 'border-destructive')}
              />
              {errors.scheduleCron && (
                <p className="text-destructive text-sm">{errors.scheduleCron.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {`Example: "0 0 * * *" runs daily at midnight`}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="UTC"
                {...register('timezone')}
                className={cn(errors.timezone && 'border-destructive')}
              />
              {errors.timezone && (
                <p className="text-destructive text-sm">{errors.timezone.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                Example: UTC, America/New_York, Europe/London
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Request Headers (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ k: '', v: '' })}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Header
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Header name (e.g., Content-Type)"
                        {...register(`headers.${index}.k`)}
                        className={cn(errors.headers?.[index]?.k && 'border-destructive')}
                      />
                      {errors.headers?.[index]?.k && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.headers[index]?.k?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Header value (e.g., application/json)"
                        {...register(`headers.${index}.v`)}
                        className={cn(errors.headers?.[index]?.v && 'border-destructive')}
                      />
                      {errors.headers?.[index]?.v && (
                        <p className="text-destructive mt-1 text-sm">
                          {errors.headers[index]?.v?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-9 w-9 flex-shrink-0 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    {`No headers added. Click "Add Header" to include custom request headers.`}
                  </p>
                )}
              </div>
            </div>

            {(httpMethodValue === 'POST' || httpMethodValue === 'PUT') && (
              <div className="space-y-2">
                <Label htmlFor="body">Request Body (Optional)</Label>
                <Textarea
                  id="body"
                  placeholder="JSON payload for POST/PUT requests"
                  rows={4}
                  {...register('body')}
                  className={cn(errors.body && 'border-destructive')}
                />
                {errors.body && <p className="text-destructive text-sm">{errors.body.message}</p>}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
