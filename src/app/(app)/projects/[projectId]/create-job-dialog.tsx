'use client';

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

type CreateJobDialogProps = {
  trigger: React.ReactNode;
};

export default function CreateJobDialog({ trigger }: CreateJobDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>Create a new job with the details below.</DialogDescription>
        </DialogHeader>
        CONTENT HERE
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
