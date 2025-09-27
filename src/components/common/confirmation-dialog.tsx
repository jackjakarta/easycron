'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React from 'react';

import { Button } from '../ui/button';

type ConfirmationDialogVariant = 'info' | 'confirm' | 'warning' | 'destructive';

type ConfirmationDialogProps = {
  title: string;
  description: string;
  trigger: React.ReactNode;
  onConfirm: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  type?: ConfirmationDialogVariant;
};

export default function ConfirmationDialog({
  title,
  onConfirm,
  trigger,
  description,
  isLoading = false,
  type = 'confirm',
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onConfirm}>
            <Button
              variant={type === 'destructive' ? 'destructive' : 'default'}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : getConfirmationActionName(type)}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getConfirmationActionName(type?: ConfirmationDialogVariant) {
  switch (type) {
    case 'destructive':
      return 'Delete';
    case 'info':
      return 'Ok';
    case 'warning':
      return 'I understand';
    case 'confirm':
      return 'Confirm';
    default:
      return 'Ok';
  }
}
