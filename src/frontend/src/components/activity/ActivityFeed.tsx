import React from 'react';
import { useGetAllMessages } from '../../hooks/useQueries';
import { useI18n } from '../../i18n/I18nProvider';
import { formatIcTime } from '../../lib/formatIcTime';
import { MessageSquare, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import ActivityMessageRenderer from './ActivityMessageRenderer';

export default function ActivityFeed() {
  const { t } = useI18n();
  const { data: messages = [], isLoading, isError, error, refetch, isFetched } = useGetAllMessages();

  // Sort messages by timestamp (most recent first)
  const sortedMessages = [...messages].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  // Take only the most recent 10 messages
  const recentMessages = sortedMessages.slice(0, 10);

  // Error state
  if (isError && !isLoading) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                          errorMessage.toLowerCase().includes('fetch') ||
                          errorMessage.toLowerCase().includes('connection');

    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Activity</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              {isNetworkError 
                ? 'Network connectivity issue. Please check your internet connection.'
                : 'Failed to load activity from the backend.'}
            </p>
            <Button
              onClick={() => refetch()}
              size="sm"
              variant="outline"
              className="mt-2 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isLoading && !isFetched) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Empty state
  if (recentMessages.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <Alert className="border-border">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Activity Yet</AlertTitle>
          <AlertDescription>
            {isFetched 
              ? 'No activity has been recorded yet. Activity will appear here when users submit worker registrations, material listings, or contact requests.'
              : 'Loading activity...'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>
      <div className="space-y-3">
        {recentMessages.map((message) => (
          <div
            key={message.id.toString()}
            className="border-l-2 border-primary/30 pl-4 py-2 hover:border-primary/60 transition-colors"
          >
            <ActivityMessageRenderer message={message.text} />
            <p className="text-xs text-muted-foreground mt-1">
              {formatIcTime(message.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
