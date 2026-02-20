import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllMessages, useDeleteMessage } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { RefreshCw, Trash2 } from 'lucide-react';
import { formatIcTime } from '../../lib/formatIcTime';
import AdminMessageRenderer from './AdminMessageRenderer';

export default function MessagesTab() {
  const { t } = useI18n();
  const { data: messages = [], isLoading, refetch } = useGetAllMessages();
  const deleteMutation = useDeleteMessage();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<bigint | null>(null);

  // Sort messages by timestamp in descending order (newest first)
  const sortedMessages = [...messages].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  const handleDeleteClick = (messageId: bigint) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete !== null) {
      await deleteMutation.mutateAsync(messageToDelete);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  return (
    <Card className="border-admin-border bg-admin-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-admin-foreground">{t('admin.messages')}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2 border-admin-border text-admin-foreground hover:bg-admin-accent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t('admin.refresh')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-admin-muted">{t('admin.loading')}</div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center py-8 text-admin-muted">{t('admin.noMessages')}</div>
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
