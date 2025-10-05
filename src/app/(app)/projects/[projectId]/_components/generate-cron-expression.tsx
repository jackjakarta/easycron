'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { toast } from 'sonner';

import { generateCronExpressionAction } from '../actions';

type GenerateCronExpressionProps = {
  trigger: React.ReactNode;
  onFinish: (value: string) => void;
};

export default function GenerateCronExpression({ trigger, onFinish }: GenerateCronExpressionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState('');

  async function handleGenerateExpression(value: string) {
    setIsLoading(true);
    const prompt = value.trim();

    try {
      const cronExpression = await generateCronExpressionAction({ prompt });
      onFinish(cronExpression);
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating cron expression:', error);
      toast.error('Failed to generate cron expression. Please try again.');
    } finally {
      setValue('');
      setIsLoading(false);
    }
  }

  return (
    <Popover open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>
        {isLoading && (
          <div className="flex h-32 w-64 items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="block text-sm font-medium">
                Describe your scheduling needs
              </Label>
              <Textarea
                id="prompt"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="E.g., Every weekday at 9 AM"
                className="mt-1 block w-full"
                rows={4}
              />
            </div>
            <Button type="button" onClick={() => handleGenerateExpression(value)}>
              Generate Expression
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
