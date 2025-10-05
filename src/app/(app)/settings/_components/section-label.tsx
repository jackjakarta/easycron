import { cn } from '@/utils/tailwind';

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return <h1 className={cn('mb-2 text-base font-semibold', className)}>{children}</h1>;
}
