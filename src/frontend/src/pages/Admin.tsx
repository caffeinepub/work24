import { useState } from 'react';
import { RefreshCw, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '../i18n/I18nProvider';
import { useGetAdminMessages, useDeleteMessage } from '../hooks/useQueries';
import { formatIcTime } from '../lib/formatIcTime';
import { setAdminSession, clearAdminSession, isAdminLoggedIn } from '../lib/adminSession';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminMessageRenderer } from '../components/admin/AdminMessageRenderer';

export default function Admin() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<bigint | null>(null);

  const { data: messages, isLoading, error, refetch, isFetching } = useGetAdminMessages();
  const deleteMutation = useDeleteMessage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Validate credentials
    if (username === 'Bharat1213' && password === 'bharatranjan1213') {
      setAdminSession(username, password);
      setIsLoggedIn(true);
      // Trigger data fetch
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      }, 100);
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    queryClient.clear();
  };

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

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t('admin.loginTitle')}</CardTitle>
            <CardDescription>{t('admin.loginDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('admin.usernameLabel')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('admin.usernamePlaceholder')}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('admin.passwordLabel')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.passwordPlaceholder')}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? t('admin.loggingIn') : t('admin.loginButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if unauthorized
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('admin.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
              <AlertDescription>
                {t('admin.accessDeniedDescription')}
              </AlertDescription>
            </Alert>
            <Button onClick={handleLogout} variant="outline" className="mt-4">
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('admin.title')}</CardTitle>
              <CardDescription>{t('admin.description')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                {t('admin.refresh')}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('admin.logout')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableHead className="w-[200px]">{t('admin.timestamp')}</TableHead>
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
        </CardContent>
      </Card>

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
