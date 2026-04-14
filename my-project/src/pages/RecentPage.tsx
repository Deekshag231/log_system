import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const levelColors: Record<string, string> = {
  ERROR: 'destructive',
  WARN: 'warning',
  INFO: 'default',
  DEBUG: 'secondary',
};

export default function RecentPage() {
  const [limit, setLimit] = useState('50');
  const [filter, setFilter] = useState('');

  const { data: logs, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['recentLogs', limit],
    queryFn: () => logApi.getRecentLogs(parseInt(limit)),
  });

  const filteredLogs = logs?.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) ||
    log.service.toLowerCase().includes(filter.toLowerCase()) ||
    log.level.toLowerCase().includes(filter.toLowerCase())
  );

  const handleExport = () => {
    if (!logs) return;
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-export-${format(new Date(), 'yyyyMMdd-HHmm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={limit} onValueChange={(value) => value && setLimit(value)}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">Last 20</SelectItem>
              <SelectItem value="50">Last 50</SelectItem>
              <SelectItem value="100">Last 100</SelectItem>
              <SelectItem value="200">Last 200</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 md:w-64">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Filter results..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-45">Timestamp</TableHead>
                  <TableHead className="w-25">Level</TableHead>
                  <TableHead className="w-37.5">Service</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-25 text-right">Event ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs && filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => (
                    <TableRow key={`${log.eventId}-${idx}`}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={levelColors[log.level] as any || 'outline'}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.service}</TableCell>
                      <TableCell className="max-w-md truncate" title={log.message}>
                        {log.message}
                      </TableCell>
                      <TableCell className="text-right font-mono text-[10px] text-muted-foreground">
                        {log.eventId.slice(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No recent logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
