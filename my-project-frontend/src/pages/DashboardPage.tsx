import { useQuery } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AlertTriangle, FileText, ShieldAlert, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COLORS = {
  ERROR: '#ef4444',
  WARN: '#f59e0b',
  INFO: '#3b82f6',
  DEBUG: '#6b7280',
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const [serviceInfo, recentLogs, activeAlerts] = await Promise.all([
        logApi.getServiceInfo(),
        logApi.getRecentLogs(100),
        logApi.getActiveAlerts(),
      ]);

      return {
        serviceInfo,
        recentLogs,
        activeAlerts,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentLogs = data?.recentLogs || [];
  const activeAlerts = data?.activeAlerts || [];

  const errorCount = recentLogs.filter((l) => l.level === 'ERROR').length;
  const warnCount = recentLogs.filter((l) => l.level === 'WARN').length;
  const infoCount = recentLogs.filter((l) => l.level === 'INFO').length;
  const debugCount = recentLogs.filter((l) => l.level === 'DEBUG').length;

  const distributionData = [
    { name: 'ERROR', value: errorCount, color: COLORS.ERROR },
    { name: 'WARN', value: warnCount, color: COLORS.WARN },
    { name: 'INFO', value: infoCount, color: COLORS.INFO },
    { name: 'DEBUG', value: debugCount, color: COLORS.DEBUG },
  ].filter((d) => d.value > 0);

  const stats = [
    {
      label: 'Recent Logs',
      value: recentLogs.length,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Errors',
      value: errorCount,
      icon: ShieldAlert,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Warnings',
      value: warnCount,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.length,
      icon: Info,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Log Level Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-75 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {distributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className="text-sm text-muted-foreground">({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        alert.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'
                      )}
                    />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.detail}</p>
                    </div>
                  </div>
                  <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : 'outline'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No active alerts detected. System is healthy.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
