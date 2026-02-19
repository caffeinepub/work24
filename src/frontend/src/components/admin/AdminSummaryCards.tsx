import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useGetAllMessages, useGetAllWorkers, useGetAllMaterials } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageSquare, Users, Package, TrendingUp } from 'lucide-react';

export default function AdminSummaryCards() {
  const { t } = useI18n();
  const { data: messages = [], isLoading: messagesLoading } = useGetAllMessages();
  const { data: workers = [], isLoading: workersLoading } = useGetAllWorkers();
  const { data: materials = [], isLoading: materialsLoading } = useGetAllMaterials();

  const cards = [
    {
      title: t('admin.totalMessages'),
      value: messagesLoading ? '...' : messages.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('admin.totalWorkers'),
      value: workersLoading ? '...' : workers.length.toString(),
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: t('admin.totalMaterials'),
      value: materialsLoading ? '...' : materials.length.toString(),
      icon: Package,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: t('admin.totalActivity'),
      value: messagesLoading || workersLoading || materialsLoading
        ? '...'
        : (messages.length + workers.length + materials.length).toString(),
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-admin-border bg-admin-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-admin-muted">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-admin-foreground">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
