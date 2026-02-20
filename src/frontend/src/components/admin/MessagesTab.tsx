import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllMessages, useDeleteMessage } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { RefreshCw, Trash2, AlertCircle, WifiOff } from 'lucide-react';
import { formatIcTime } from '../../lib/formatIcTime';
import AdminMessageRenderer from './AdminMessageRenderer';

export default function MessagesTab() {
  const { t } = useI18n();
  const { data: messages = [], isLoading, refetch, isFetched, dataUpdatedAt, error, isError, failureCount } = useGetAllMessages();
  const deleteMutation = useDeleteMessage();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<bigint | null>(null);

  // Log when component mounts and when data updates
  useEffect(() => {
    console.log('[MessagesTab] Component mounted');
    return () => console.log('[MessagesTab] Component unmounted');
  }, []);

  useEffect(() => {
    console.log('[MessagesTab] Data state changed:', {
      messageCount: messages.length,
      isLoading,
      isFetched,
      isError,
      failureCount,
      dataUpdatedAt: new Date(dataUpdatedAt).toISOString(),
      messageIds: messages.map(m => m.id.toString()),
      error: error ? String(error) : null,
    });
  }, [messages, isLoading, isFetched, dataUpdatedAt, isError, error, failureCount]);

  // Sort messages by timestamp in descending order (newest first)
  const sortedMessages = [...messages].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  console.log('[MessagesTab] Rendering with', sortedMessages.length, 'sorted messages');

  const handleDeleteClick = (messageId: bigint) => {
    console.log('[MessagesTab] Delete clicked for message:', messageId.toString());
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete !== null) {
      console.log('[MessagesTab] Confirming delete for message:', messageToDelete.toString());
      await deleteMutation.mutateAsync(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleRetry = () => {
    console.log('[MessagesTab] Manual retry triggered');
    refetch();
  };

  // Show error state with detailed diagnostics
  if (isError && !isLoading) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                          errorMessage.toLowerCase().includes('fetch') ||
                          errorMessage.toLowerCase().includes('connection');

    return (
      <Card className="border-admin-border bg-admin-card">
        <CardHeader>
          <CardTitle className="text-admin-foreground">{t('admin.messages')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Messages</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                {isNetworkError 
                  ? 'Network connectivity issue detected. Please check your internet connection and try again.'
                  : 'Failed to load messages from the backend. The backend canister may be unavailable.'}
              </p>
              <p className="text-xs font-mono mt-2 opacity-75">
                Error: {errorMessage}
              </p>
              <p className="text-xs opacity-75">
                Failed attempts: {failureCount}
              </p>
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              onClick={handleRetry}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Retry
            </Button>
            {isNetworkError && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <WifiOff className="h-4 w-4" />
                Reload Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-admin-border bg-admin-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-admin-foreground">{t('admin.messages')}</CardTitle>
          {isFetched && (
            <p className="text-xs text-admin-muted mt-1">
              Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()} • Auto-refreshing every 10s
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('[MessagesTab] Manual refresh triggered');
            refetch();
          }}
          disabled={isLoading}
          className="gap-2 border-admin-border text-admin-foreground hover:bg-admin-accent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('admin.refresh')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && !isFetched ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-admin-muted" />
            <p className="text-admin-muted">{t('admin.loading')}</p>
          </div>
        ) : sortedMessages.length === 0 ? (
          <Alert className="border-admin-border">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-admin-foreground">No Messages Found</AlertTitle>
            <AlertDescription className="text-admin-muted">
              {isFetched 
                ? 'The backend returned zero messages. This could mean no activity has been submitted yet, or messages were deleted.'
                : 'Waiting for data...'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md border border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-accent/50 hover:bg-admin-accent/50">
                  <TableHead className="text-admin-foreground">{t('admin.messageId')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.timestamp')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.message')}</TableHead>
                  <TableHead className="text-admin-foreground text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMessages.map((message) => (
                  <TableRow key={message.id.toString()} className="border-admin-border">
                    <TableCell className="text-admin-foreground">{message.id.toString()}</TableCell>
                    <TableCell className="text-admin-muted text-sm">
                      {formatIcTime(message.timestamp)}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <AdminMessageRenderer message={message.text} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(message.id)}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-admin-card border-admin-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-admin-foreground">
                {t('admin.confirmDelete')}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-admin-muted">
                {t('admin.deleteWarning')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-admin-border text-admin-foreground hover:bg-admin-accent">
                {t('admin.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('admin.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
