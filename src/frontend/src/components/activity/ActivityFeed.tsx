import React from 'react';
import { useGetAllMessages } from '../../hooks/useQueries';
import { useI18n } from '../../i18n/I18nProvider';
import { formatIcTime } from '../../lib/formatIcTime';
import { MessageSquare, Loader2 } from 'lucide-react';

export default function ActivityFeed() {
  const { t } = useI18n();
  const { data: messages = [], isLoading } = useGetAllMessages();

  // Sort messages by timestamp (most recent first)
  const sortedMessages = [...messages].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  // Take only the most recent 10 messages
  const recentMessages = sortedMessages.slice(0, 10);

  if (isLoading) {
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

  if (recentMessages.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <p className="text-muted-foreground text-center py-8">No recent activity</p>
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
            <p className="text-sm text-foreground">{message.text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatIcTime(message.timestamp)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
