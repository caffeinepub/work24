import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetMaterials } from '../../hooks/useQueries';

export default function MaterialsTab() {
  const { t } = useI18n();
  const { data: materials, isLoading, refetch, isFetching } = useGetMaterials();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.materialsTitle')}</h2>
          <p className="text-muted-foreground">{t('admin.materialsDescription')}</p>
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
      ) : !materials || materials.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('admin.noMaterials')}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.materialName')}</TableHead>
                <TableHead>{t('admin.category')}</TableHead>
                <TableHead>{t('admin.location')}</TableHead>
                <TableHead>{t('admin.submittedBy')}</TableHead>
                <TableHead>{t('admin.description')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{material.category}</Badge>
                  </TableCell>
                  <TableCell>{material.location || t('admin.notProvided')}</TableCell>
                  <TableCell>
                    {material.submittedBy ? (
                      <div className="space-y-1">
                        <div className="font-medium">{material.submittedBy.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {material.submittedBy.id}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">{t('admin.unknown')}</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="line-clamp-2 text-sm text-muted-foreground">
                      {material.description}
                    </div>
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
