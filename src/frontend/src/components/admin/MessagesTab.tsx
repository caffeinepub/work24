import { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAdminMessages, useDeleteMessage } from '../../hooks/useQueries';
import { formatIcTime } from '../../lib/formatIcTime';
import { AdminMessageRenderer } from './AdminMessageRenderer';
import { getMessageSource } from '../../lib/adminMessageFormatting';
import { toast } from 'sonner';

export default function MessagesTab() {
  const { t } = useI18n();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<bigint | null>(null);

  const { data: messages, isLoading, error, refetch, isFetching } = useGetAdminMessages();
  const deleteMutation = useDeleteMessage();

  const handleDeleteClick = (messageId: bigint) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete === null) return;

    try {
      await deleteMutation.mutateAsync(messageToDelete);
      toast.success(t('admin.deleteSuccess'));
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(t('admin.deleteFailed'));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {t('admin.errorLoadingMessages')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.messagesTitle')}</h2>
          <p className="text-muted-foreground">{t('admin.messagesDescription')}</p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {t('admin.refresh')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('admin.loading')}
        </div>
      ) : !messages || messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('admin.empty')}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t('admin.id')}</TableHead>
                <TableHead className="w-[140px]">{t('admin.source')}</TableHead>
                <TableHead className="w-[180px]">{t('admin.timestamp')}</TableHead>
                <TableHead>{t('admin.message')}</TableHead>
                <TableHead className="w-[100px] text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map(([messageId, messageText, timestamp]) => (
                <TableRow key={messageId.toString()}>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{messageId.toString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {getMessageSource(messageText, t)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatIcTime(timestamp)}
                  </TableCell>
                  <TableCell className="max-w-2xl">
                    <AdminMessageRenderer messageText={messageText} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(messageId)}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleteMutation.isPending}>
              {t('admin.deleteCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t('admin.deleting') : t('admin.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
