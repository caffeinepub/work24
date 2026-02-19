import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllMaterials } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { RefreshCw } from 'lucide-react';

export default function MaterialsTab() {
  const { t } = useI18n();
  const { data: materials = [], isLoading, refetch } = useGetAllMaterials();

  return (
    <Card className="border-admin-border bg-admin-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-admin-foreground">{t('admin.materials')}</CardTitle>
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
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-admin-muted">{t('admin.noMaterials')}</div>
        ) : (
          <div className="rounded-md border border-admin-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-accent/50 hover:bg-admin-accent/50">
                  <TableHead className="text-admin-foreground">{t('admin.materialId')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.materialName')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.materialCategory')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.materialLocation')}</TableHead>
                  <TableHead className="text-admin-foreground">{t('admin.materialDescription')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id.toString()} className="border-admin-border">
                    <TableCell className="text-admin-foreground">{material.id.toString()}</TableCell>
                    <TableCell className="text-admin-foreground font-medium">{material.name}</TableCell>
                    <TableCell className="text-admin-muted">{material.category}</TableCell>
                    <TableCell className="text-admin-muted">{material.location}</TableCell>
                    <TableCell className="text-admin-muted max-w-md truncate">
                      {material.description}
                    </TableCell>
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
