import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { AlertRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { AlertTriangle, Bell, ShieldAlert, Clock, Info, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: logApi.getActiveAlerts,
    refetchInterval: 30000, // Poll every 30s
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Active Alerts</h2>
          <p className="text-muted-foreground">
            Currently triggered system alerts requiring attention.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 gap-1">
          <Bell className="w-3 h-3" />
          {alerts?.length || 0} Active
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : alerts && alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedAlert(alert)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(alert.triggeredAt), 'HH:mm')}
                  </span>
                </div>
                <CardTitle className="text-lg">{alert.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {alert.detail}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    ID: {alert.id.slice(0, 8)}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-green-500/10 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="mb-2">No Active Alerts</CardTitle>
            <CardDescription>
              All systems are operational. No issues detected at this time.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-125">
          {selectedAlert && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAlert.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  )}
                  <Badge variant={selectedAlert.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{selectedAlert.title}</DialogTitle>
                <DialogDescription>
                  Triggered at {format(new Date(selectedAlert.triggeredAt), 'PPPP p')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Detail
                  </h4>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedAlert.detail}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-green-500">ACTIVE</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Alert ID</p>
                    <p className="font-mono text-xs">{selectedAlert.id}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>Close</Button>
                <Button variant="destructive">Acknowledge</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
