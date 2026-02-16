import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useI18n } from '../i18n/I18nProvider';
import { useGetAdminMessages } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { formatIcTime } from '../lib/formatIcTime';

export default function Admin() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading, error, refetch, isFetching } = useGetAdminMessages();

  const isAuthenticated = !!identity;

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('admin.title')}</CardTitle>
            <CardDescription>{t('admin.signInPrompt')}</CardDescription>
          </CardHeader>
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
                    <TableHead className="w-[200px]">{t('admin.timestamp')}</TableHead>
                    <TableHead>{t('admin.message')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map(([message, timestamp], index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {formatIcTime(timestamp)}
                      </TableCell>
                      <TableCell className="whitespace-pre-wrap break-words">
                        {message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
