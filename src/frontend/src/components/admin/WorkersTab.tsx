import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllWorkers } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RefreshCw } from 'lucide-react';

export default function WorkersTab() {
  const { t } = useI18n();
  const { data: workers = [], isLoading, refetch } = useGetAllWorkers();

  return (
    <Card className="border-admin-border bg-admin-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-admin-foreground">{t('admin.workers')}</CardTitle>
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
        ) : workers.length === 0 ? (
          <div className="text-center py-8 text-admin-muted">{t('admin.noWorkers')}</div>
        ) : (
          <div className="rounded-md border border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-accent/50 hover:bg-admin-accent/50">
                  <TableHead className="text-admin-foreground">{t('admin.workerId')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.workerName')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.workerSkill')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.workerCategory')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.workerLocation')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id.toString()} className="border-admin-border">
                    <TableCell className="text-admin-foreground">{worker.id.toString()}</TableCell>
                    <TableCell className="text-admin-foreground font-medium">{worker.name}</TableCell>
                    <TableCell className="text-admin-muted">{worker.skill}</TableCell>
                    <TableCell className="text-admin-muted">{worker.category}</TableCell>
                    <TableCell className="text-admin-muted">{worker.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
