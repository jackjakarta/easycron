'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type EventType, type WebhookEndpointModel } from '@/db/schema';
import { format } from 'date-fns';
import { AlertTriangle, Copy, MoreHorizontal } from 'lucide-react';

import CreateWebhookDialog from './create-endpoint-dialog';

type WebhookEndpointsTableProps = {
  endpoints: WebhookEndpointModel[];
};

export default function WebhookEndpointsTable({ endpoints }: WebhookEndpointsTableProps) {
  return (
    <div className="border-border rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">URL</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Events</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold">Failures</TableHead>
            <TableHead className="font-semibold">Last Failure</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                No webhook endpoints configured yet
              </TableCell>
            </TableRow>
          ) : (
            endpoints.map((endpoint) => (
              <TableRow key={endpoint.id} className="hover:bg-muted/50">
                <TableCell className="max-w-xs truncate font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{endpoint.url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      // onClick={() => copyToClipboard(endpoint.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(endpoint.isActive, endpoint.consecutiveFailures)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {endpoint.enabledEventTypes.map((event) => (
                      <span
                        key={event}
                        className={`inline-block rounded px-2 py-1 text-xs ${getEventTypeBadge(event)}`}
                      >
                        {event.split('.')[2]}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(endpoint.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {endpoint.consecutiveFailures > 0 && (
                      <AlertTriangle className="text-destructive h-4 w-4" />
                    )}
                    <span className={endpoint.consecutiveFailures > 0 ? 'font-semibold' : ''}>
                      {endpoint.consecutiveFailures}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {endpoint.lastFailureAt
                    ? format(new Date(endpoint.lastFailureAt), 'MMM dd, HH:mm')
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusBadge(isActive: boolean, failures: number) {
  if (failures > 0) {
    return <Badge variant="destructive">Failed</Badge>;
  }

  return isActive ? (
    <Badge variant="default">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
}

function getEventTypeBadge(eventType: EventType) {
  const colors: Record<EventType, string> = {
    'job.execution.completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'job.execution.failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return colors[eventType] || 'bg-gray-100 text-gray-800';
}
