import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { LogDocument } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const levelColors: Record<string, string> = {
  ERROR: 'destructive',
  WARN: 'warning',
  INFO: 'default',
  DEBUG: 'secondary',
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('level');
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [results, setResults] = useState<LogDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchValue && activeTab !== 'range') return;
    
    setIsSearching(true);
    try {
      let data: LogDocument[] = [];
      switch (activeTab) {
        case 'level':
          data = await logApi.searchByLevel(searchValue.toUpperCase());
          break;
        case 'service':
          data = await logApi.searchByService(searchValue);
          break;
        case 'message':
          data = await logApi.searchByMessage(searchValue);
          break;
        case 'range':
          if (dateRange.from && dateRange.to) {
            data = await logApi.searchByRange(
              new Date(dateRange.from).toISOString(),
              new Date(dateRange.to).toISOString()
            );
          }
          break;
      }
      setResults(data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="level">By Level</TabsTrigger>
              <TabsTrigger value="service">By Service</TabsTrigger>
              <TabsTrigger value="message">By Message</TabsTrigger>
              <TabsTrigger value="range">By Time Range</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                {activeTab === 'range' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input 
                        type="datetime-local" 
                        value={dateRange.from} 
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="datetime-local" 
                        value={dateRange.to} 
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      className="pl-10"
                      placeholder={
                        activeTab === 'level' ? "ERROR, WARN, INFO, DEBUG" :
                        activeTab === 'service' ? "Enter service name..." :
                        "Search in log messages..."
                      }
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                )}
              </div>
              <Button onClick={handleSearch} disabled={isSearching} className="md:w-32">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Results ({results.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Showing top 50 matches</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-45">Timestamp</TableHead>
                  <TableHead className="w-25">Level</TableHead>
                  <TableHead className="w-37.5">Service</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length > 0 ? (
                  results.map((log) => (
                    <TableRow key={log.id}>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      {isSearching ? "Searching..." : "No logs found. Try a different search."}
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
