import { cn } from '@/utils/tailwind';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
};

export default function PageContainer({ children, className, wide = false }: PageContainerProps) {
  if (wide) {
    return <div className={cn('flex flex-1 flex-col gap-4 px-4 pb-4', className)}>{children}</div>;
  }

  return (
    <div className={cn('mx-auto w-full max-w-4xl', className)}>
      <div className="flex flex-1 flex-col gap-4 px-4 pb-4">{children}</div>
    </div>
  );
}
