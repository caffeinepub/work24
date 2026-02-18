import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetWorkers } from '../../hooks/useQueries';
import { services } from '../../lib/servicesCatalog';

export default function WorkersTab() {
  const { t } = useI18n();
  const { data: workers, isLoading, refetch, isFetching } = useGetWorkers();

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? t(service.nameKey) : serviceId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.workersTitle')}</h2>
          <p className="text-muted-foreground">{t('admin.workersDescription')}</p>
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
      ) : !workers || workers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('admin.noWorkers')}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.workerName')}</TableHead>
                <TableHead>{t('admin.skill')}</TableHead>
                <TableHead>{t('admin.serviceCategory')}</TableHead>
                <TableHead>{t('admin.location')}</TableHead>
                <TableHead>{t('admin.submittedBy')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.skill}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getServiceName(worker.serviceCategory)}</Badge>
                  </TableCell>
                  <TableCell>{worker.location || t('admin.notProvided')}</TableCell>
                  <TableCell>
                    {worker.submittedBy ? (
                      <div className="space-y-1">
                        <div className="font-medium">{worker.submittedBy.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {worker.submittedBy.id}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">{t('admin.unknown')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
