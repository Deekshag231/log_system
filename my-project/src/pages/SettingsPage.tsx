import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, RefreshCw, Bell, Shield, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: '30',
    notifications: true,
    alertSeverity: 'WARN',
    retentionDays: '30',
    apiEndpoint: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    kibanaUrl: import.meta.env.VITE_KIBANA_URL || 'http://localhost:5601',
  });

  const handleSave = () => {
    toast.success('Settings saved locally');
    // In a real app, this would call an API
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <CardTitle>Data Fetching</CardTitle>
            </div>
            <CardDescription>Configure how the dashboard updates data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch 
                id="auto-refresh" 
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
              <Select 
                value={settings.refreshInterval} 
                onValueChange={(val) => setSettings({ ...settings, refreshInterval: val || '30' })}
                disabled={!settings.autoRefresh}
              >
                <SelectTrigger id="refresh-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage alert notifications and thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable Browser Notifications</Label>
              <Switch 
                id="notifications" 
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-severity">Minimum Alert Severity</Label>
              <Select 
                value={settings.alertSeverity} 
                onValueChange={(val) => setSettings({ ...settings, alertSeverity: val || 'WARN' })}
              >
                <SelectTrigger id="min-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <CardTitle>Storage & Retention</CardTitle>
            </div>
            <CardDescription>Configure data retention policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Log Retention (days)</Label>
              <Input 
                id="retention" 
                type="number" 
                value={settings.retentionDays}
                onChange={(e) => setSettings({ ...settings, retentionDays: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              <CardTitle>API Configuration</CardTitle>
            </div>
            <CardDescription>Backend connection settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">API Base URL</Label>
              <Input 
                id="api-url" 
                value={settings.apiEndpoint}
                onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kibana-url">Kibana URL</Label>
              <Input 
                id="kibana-url" 
                value={settings.kibanaUrl}
                onChange={(e) => setSettings({ ...settings, kibanaUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible administrative actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1">Flush Cache</Button>
          <Button variant="destructive" className="flex-1">Clear All Logs</Button>
        </CardContent>
      </Card>
    </div>
  );
}
