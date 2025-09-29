import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export default function ApiKeysTableRowSkeleton() {
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="pl-6">
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-6 w-32 rounded" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>

      <TableCell>
        <Skeleton className="h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  );
}
