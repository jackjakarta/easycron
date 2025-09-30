'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApiKeysQuery } from '@/hooks/query/use-api-keys-query';
import { formatDateToDayMonthYearTime } from '@/utils/date';
import { cn } from '@/utils/tailwind';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { updateApiKeyEnabledAction } from './actions';
import ApiKeysTableRowSkeleton from './api-keys-table-row-skeleton';
import CreateKeyDialog from './create-key-dialog';

export default function ApiKeysTable() {
  const queryClient = useQueryClient();

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: apiKeys = [], isLoading, isError } = useApiKeysQuery();

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.start?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  async function handleEnableOrDisableKey(keyId: string, enabled: boolean) {
    try {
      await updateApiKeyEnabledAction({ apiKeyId: keyId, enabled });
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success(`API key ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Failed to update API key status:', error);
      toast.error('Failed to update API key status');
    }
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedKeys(new Set(filteredKeys.map((key) => key.id)));
    } else {
      setSelectedKeys(new Set());
    }
  }

  function handleSelectKey(keyId: string, checked: boolean) {
    const newSelected = new Set(selectedKeys);

    if (checked) {
      newSelected.add(keyId);
    } else {
      newSelected.delete(keyId);
    }

    setSelectedKeys(newSelected);
  }

  const isAllSelected = filteredKeys.length > 0 && selectedKeys.size === filteredKeys.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-balance">API Keys</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your API keys and monitor their usage
            </CardDescription>
          </div>
          <CreateKeyDialog
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            }
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search API keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {selectedKeys.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{selectedKeys.size} selected</span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b">
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all API keys"
                  />
                </TableHead>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Key</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Requests</TableHead>
                <TableHead className="font-medium">Last Used</TableHead>
                <TableHead className="font-medium">Expires</TableHead>
                <TableHead className="font-medium">Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <ApiKeysTableRowSkeleton key={`skeleton-${index}`} />
                ))}

              {isError && (
                <TableRow>
                  <TableCell colSpan={9} className="py-4 text-center">
                    <span className="text-destructive">Failed to load API keys.</span>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                filteredKeys.length > 0 &&
                filteredKeys.map((apiKey) => (
                  <TableRow key={apiKey.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedKeys.has(apiKey.id)}
                        onCheckedChange={(checked) =>
                          handleSelectKey(apiKey.id, checked as boolean)
                        }
                        aria-label={`Select ${apiKey.name || 'Unnamed key'}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {apiKey.name ?? <span className="text-muted-foreground italic">Unnamed</span>}
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted rounded px-2 py-1 font-mono text-sm">
                        {apiKey.start || '••••••••'}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(apiKey.enabled && 'bg-muted-foreground text-background')}
                      >
                        {apiKey.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {String(apiKey.requestCount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {apiKey.lastRequest !== null
                        ? formatDateToDayMonthYearTime(apiKey.lastRequest)
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {apiKey.expiresAt ? (
                        <span
                          className={
                            apiKey.expiresAt < new Date()
                              ? 'text-destructive'
                              : apiKey.expiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? 'text-warning'
                                : 'text-muted-foreground'
                          }
                        >
                          {formatDateToDayMonthYearTime(apiKey.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDateToDayMonthYearTime(apiKey.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="gap-2"
                            onSelect={() => handleEnableOrDisableKey(apiKey.id, !apiKey.enabled)}
                          >
                            {apiKey.enabled ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                Enable
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                            <Trash2 className="text-destructive h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// function formatNumber(num: number) {
//   return new Intl.NumberFormat('en-US').format(num);
// }
