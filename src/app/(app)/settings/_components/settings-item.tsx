import { Label } from '@/components/ui/label';
import { TypographyP } from '@/components/ui/typography';

export default function SettingsItem({
  title,
  description,
  actionComponent,
}: {
  title: string;
  description: string;
  actionComponent: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 max-md:flex-wrap">
      <div className="flex flex-col gap-2">
        <Label>{title}</Label>
        <TypographyP className="text-muted-foreground text-sm">{description}</TypographyP>
      </div>
      {actionComponent}
    </div>
  );
}
