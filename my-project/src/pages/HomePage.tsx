import { useQuery } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Terminal, Activity, ShieldAlert, Search, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { data: serviceInfo, isLoading, error } = useQuery({
    queryKey: ['serviceInfo'],
    queryFn: logApi.getServiceInfo,
  });

  const KIBANA_URL = import.meta.env.VITE_KIBANA_URL || 'http://localhost:5601';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Terminal className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Log Monitor Service</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Centralized logging and monitoring platform for distributed services. 
          Ingest, search, and visualize your logs with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Activity className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Real-time KPIs and log level distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Search className="w-8 h-8 text-purple-500 mb-2" />
            <CardTitle>Search</CardTitle>
            <CardDescription>Query logs by level, service, or message</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/search">Search Logs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <ShieldAlert className="w-8 h-8 text-red-500 mb-2" />
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Monitor active system alerts and issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/alerts">View Alerts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              <CardTitle>Service Status</CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={KIBANA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Open Kibana <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              Failed to connect to backend service. Please check if the API is running.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-mono font-medium text-green-500">ONLINE</p>
                </div>
                <div className="p-3 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-mono font-medium">v1.2.0-stable</p>
                </div>
              </div>
              <pre className="p-4 bg-black text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
                {JSON.stringify(serviceInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
