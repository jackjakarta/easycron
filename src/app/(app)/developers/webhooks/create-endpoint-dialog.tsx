'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { eventTypeSchema, ProjectModel } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createWebhookEndpointAction } from './actions';

const webhookEndpointSchema = z.object({
  url: z.url('Please enter a valid URL'),
  isActive: z.boolean().optional(),
  enabledEventTypes: z.array(eventTypeSchema).min(1, 'Select at least one event type'),
  projectId: z.uuid('Please enter a valid project ID'),
});

type FormData = z.infer<typeof webhookEndpointSchema>;

type CreateWebhookDialogProps = {
  trigger: React.ReactNode;
  projects: ProjectModel[];
};

export default function CreateWebhookDialog({ projects, trigger }: CreateWebhookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(webhookEndpointSchema),
    defaultValues: {
      url: '',
      isActive: true,
      enabledEventTypes: ['job.execution.completed'],
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      await createWebhookEndpointAction(data);

      form.reset();
      setOpen(false);
      toast.success('Webhook endpoint created successfully!');
    } catch (error) {
      console.error('Failed to create webhook:', error);
      toast.error('Failed to create webhook endpoint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Webhook Endpoint</DialogTitle>
          <DialogDescription>
            Add a new webhook endpoint to receive job execution events
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* URL Field */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/webhooks/jobs"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>The URL where we will send webhook events</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project ID Field */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The project this webhook is associated with</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Toggle */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Enable this endpoint to receive events</FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Event Types */}
            <FormField
              control={form.control}
              name="enabledEventTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Types</FormLabel>
                  <div className="space-y-2">
                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes('job.execution.completed') ?? false}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange([...current, 'job.execution.completed']);
                            } else {
                              field.onChange(
                                current.filter((e) => e !== 'job.execution.completed'),
                              );
                            }
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">
                        Job Execution Completed
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes('job.execution.failed') ?? false}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange([...current, 'job.execution.failed']);
                            } else {
                              field.onChange(current.filter((e) => e !== 'job.execution.failed'));
                            }
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal">
                        Job Execution Failed
                      </FormLabel>
                    </FormItem>
                  </div>
                  <FormDescription>Select which events trigger this webhook</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Endpoint'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
