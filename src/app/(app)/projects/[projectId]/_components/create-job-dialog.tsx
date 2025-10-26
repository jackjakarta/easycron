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
import { TypographyP } from '@/components/ui/typography';
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
    defaultValues: {
      httpMethod: 'GET',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  async function onSubmit(data: JobFormData) {
    const { body: _body, authorizationHeader } = data;
    const body = _body?.trim().length === 0 ? null : _body;

    const authHeaderCleaned =
      authorizationHeader?.k && authorizationHeader?.v
        ? {
            k: authorizationHeader.k.trim(),
            v: authorizationHeader.v.trim(),
          }
        : null;

    const cleanedData = {
      ...data,
      body,
      authorizationHeader: authHeaderCleaned,
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
      <DialogContent className="max-h-[95dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>Create a new job with the details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto">
          <div className="space-y-6 pt-1">
            <div className="space-y-4">
              <Label htmlFor="name">Job Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter job name"
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <TypographyP className="text-destructive text-sm">
                  {errors.name.message}
                </TypographyP>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                {...register('url')}
                placeholder="https://example.com/api/endpoint"
                className={cn(errors.url && 'border-destructive')}
              />
              {errors.url && (
                <TypographyP className="text-destructive text-sm">{errors.url.message}</TypographyP>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
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
              </div>
              {errors.httpMethod && (
                <TypographyP className="text-destructive text-sm">
                  {errors.httpMethod.message}
                </TypographyP>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="authorizationHeader">Authorization Header (Optional)</Label>
              <div className="flex items-center justify-between gap-2">
                <Input
                  id="authorizationHeaderKey"
                  placeholder="Key"
                  {...register('authorizationHeader.k')}
                />
                <Input
                  id="authorizationHeaderValue"
                  placeholder="Value"
                  {...register('authorizationHeader.v')}
                />
              </div>
              <TypographyP className="text-muted-foreground -mt-2 text-xs">
                Values are not stored in plaintext and are securely encrypted.
              </TypographyP>
              {errors.authorizationHeader && (
                <TypographyP className="text-destructive text-sm">
                  {errors.authorizationHeader.message} - AN ERROR
                </TypographyP>
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
                {...register('scheduleCron')}
                placeholder="0 0 * * *"
                className={cn(errors.scheduleCron && 'border-destructive')}
              />
              {errors.scheduleCron && (
                <TypographyP className="text-destructive text-sm">
                  {errors.scheduleCron.message}
                </TypographyP>
              )}
              <TypographyP className="text-muted-foreground text-xs">
                {`Example: "0 0 * * *" runs daily at midnight`}
              </TypographyP>
            </div>

            <div className="space-y-4">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                {...register('timezone')}
                placeholder="UTC"
                className={cn(errors.timezone && 'border-destructive')}
              />
              {errors.timezone && (
                <TypographyP className="text-destructive text-sm">
                  {errors.timezone.message}
                </TypographyP>
              )}
              <TypographyP className="text-muted-foreground -mt-2 text-xs">
                Example: UTC, America/New_York, Europe/London
              </TypographyP>
            </div>

            <div className="space-y-4">
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
                        {...register(`headers.${index}.k`)}
                        placeholder="Header name (e.g., Content-Type)"
                        className={cn(errors.headers?.[index]?.k && 'border-destructive')}
                      />
                      {errors.headers?.[index]?.k && (
                        <TypographyP className="text-destructive mt-1 text-sm">
                          {errors.headers[index]?.k?.message}
                        </TypographyP>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register(`headers.${index}.v`)}
                        placeholder="Header value (e.g., application/json)"
                        className={cn(errors.headers?.[index]?.v && 'border-destructive')}
                      />
                      {errors.headers?.[index]?.v && (
                        <TypographyP className="text-destructive mt-1 text-sm">
                          {errors.headers[index]?.v?.message}
                        </TypographyP>
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
                  <TypographyP className="text-muted-foreground -mt-2 text-sm">
                    {`No headers added. Click "Add Header" to include custom request headers.`}
                  </TypographyP>
                )}
              </div>
            </div>

            {httpMethodValue !== 'GET' && (
              <div className="space-y-4">
                <Label htmlFor="body">Request Body (Optional)</Label>
                <Textarea
                  id="body"
                  {...register('body')}
                  rows={4}
                  placeholder="JSON payload for POST/PUT requests"
                  className={cn(errors.body && 'border-destructive')}
                />
                {errors.body && (
                  <TypographyP className="text-destructive text-sm">
                    {errors.body.message}
                  </TypographyP>
                )}
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
