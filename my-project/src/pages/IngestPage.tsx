import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { logApi } from '@/lib/api';
import { LogEntryRequest, ApiErrorResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const ingestSchema = z.object({
  timestamp: z.string().min(1, 'Timestamp is required'),
  level: z.enum(['ERROR', 'WARN', 'INFO', 'DEBUG']),
  service: z.string().min(1, 'Service is required').max(128, 'Service name too long'),
  message: z.string().min(1, 'Message is required').max(8192, 'Message too long'),
  eventId: z.string().uuid('Must be a valid UUID').optional().or(z.literal('')),
});

type IngestFormValues = z.infer<typeof ingestSchema>;

export default function IngestPage() {
  const [lastResponse, setLastResponse] = useState<any>(null);

  const form = useForm<IngestFormValues>({
    resolver: zodResolver(ingestSchema),
    defaultValues: {
      timestamp: new Date().toISOString().slice(0, 19),
      level: 'INFO',
      service: '',
      message: '',
      eventId: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LogEntryRequest) => logApi.ingestLog(data),
    onSuccess: (data) => {
      toast.success('Log ingested successfully');
      setLastResponse(data);
      form.reset({
        ...form.getValues(),
        message: '',
        eventId: '',
        timestamp: new Date().toISOString().slice(0, 19),
      });
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiErrorResponse;
      const message = apiError?.message || 'Failed to ingest log';
      toast.error(message);
      
      if (apiError?.details) {
        apiError.details.forEach(detail => toast.error(detail));
      }
    },
  });

  const onSubmit = (data: IngestFormValues) => {
    const payload: LogEntryRequest = {
      timestamp: data.timestamp,
      level: data.level,
      service: data.service,
      message: data.message,
      eventId: data.eventId || undefined,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ingest New Log</CardTitle>
          <CardDescription>Manually push a log entry to the monitoring system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp</Label>
                <input
                  id="timestamp" 
                  type="datetime-local" 
                  step="1"
                  className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
                  {...form.register('timestamp')} 
                />
                {form.formState.errors.timestamp && (
                  <p className="text-sm text-destructive">{form.formState.errors.timestamp.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Log Level</Label>
                <Select 
                  onValueChange={(value) => form.setValue('level', value as any)} 
                  defaultValue={form.getValues('level')}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEBUG">DEBUG</SelectItem>
                    <SelectItem value="INFO">INFO</SelectItem>
                    <SelectItem value="WARN">WARN</SelectItem>
                    <SelectItem value="ERROR">ERROR</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.level && (
                  <p className="text-sm text-destructive">{form.formState.errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Name</Label>
              <input
                id="service" 
                placeholder="e.g. payment-service" 
                className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
                {...form.register('service')} 
              />
              {form.formState.errors.service && (
                <p className="text-sm text-destructive">{form.formState.errors.service.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventId">Event ID (Optional UUID)</Label>
              <input
                id="eventId" 
                placeholder="00000000-0000-0000-0000-000000000000" 
                className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
                {...form.register('eventId')} 
              />
              {form.formState.errors.eventId && (
                <p className="text-sm text-destructive">{form.formState.errors.eventId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea 
                id="message"
                className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter log message details..."
                {...form.register('message')}
              />
              {form.formState.errors.message && (
                <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingesting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Log Entry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {lastResponse && (
        <Card className={lastResponse.forwardedToStream ? "border-green-500/50 bg-green-500/5" : "border-blue-500/50 bg-blue-500/5"}>
          <CardHeader className="flex flex-row items-center gap-4">
            {lastResponse.forwardedToStream ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-blue-500" />
            )}
            <div>
              <CardTitle>
                {lastResponse.forwardedToStream ? "Published to Kafka" : "Accepted but not forwarded to stream"}
              </CardTitle>
              <CardDescription>Event ID: {lastResponse.eventId}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{lastResponse.detail}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
