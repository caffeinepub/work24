import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllMessages, useGetAllWorkers, useGetAllMaterials } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MessageSquare, Users, Package, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export default function AdminSummaryCards() {
  const { t } = useI18n();
  const { 
    data: messages = [], 
    isLoading: messagesLoading, 
    isError: messagesError, 
    error: messagesErrorObj,
    refetch: refetchMessages 
  } = useGetAllMessages();
  const { 
    data: workers = [], 
    isLoading: workersLoading, 
    isError: workersError,
    error: workersErrorObj,
    refetch: refetchWorkers 
  } = useGetAllWorkers();
  const { 
    data: materials = [], 
    isLoading: materialsLoading, 
    isError: materialsError,
    error: materialsErrorObj,
    refetch: refetchMaterials 
  } = useGetAllMaterials();

  const hasAnyError = messagesError || workersError || materialsError;
  const isAnyLoading = messagesLoading || workersLoading || materialsLoading;

  const cards = [
    {
      title: t('admin.totalMessages'),
      value: messagesLoading ? '...' : messagesError ? 'Error' : messages.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      hasError: messagesError,
      error: messagesErrorObj,
      refetch: refetchMessages,
    },
    {
      title: t('admin.totalWorkers'),
      value: workersLoading ? '...' : workersError ? 'Error' : workers.length.toString(),
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      hasError: workersError,
      error: workersErrorObj,
      refetch: refetchWorkers,
    },
    {
      title: t('admin.totalMaterials'),
      value: materialsLoading ? '...' : materialsError ? 'Error' : materials.length.toString(),
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      hasError: materialsError,
      error: materialsErrorObj,
      refetch: refetchMaterials,
    },
    {
      title: t('admin.totalActivity'),
      value: isAnyLoading
        ? '...'
        : hasAnyError
        ? 'Error'
        : (messages.length + workers.length + materials.length).toString(),
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      hasError: hasAnyError,
      error: null,
      refetch: () => {
        refetchMessages();
        refetchWorkers();
        refetchMaterials();
      },
    },
  ];

  return (
    <div className="space-y-4">
      {hasAnyError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Loading Issues</AlertTitle>
          <AlertDescription>
            Some dashboard data failed to load. Check individual cards below for details and retry options.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-admin-border bg-admin-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-admin-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {card.hasError ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-destructive">Error</div>
                    <p className="text-xs text-admin-muted">
                      {card.error instanceof Error ? card.error.message : 'Failed to load data'}
                    </p>
                    <Button
                      onClick={() => card.refetch()}
                      size="sm"
                      variant="outline"
                      className="w-full gap-2 mt-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-admin-foreground">{card.value}</div>
                    <p className="text-xs text-admin-muted">
                      {card.value === '...' ? 'Loading...' : 'Total count'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
