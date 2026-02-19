import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '../i18n/I18nProvider';
import { getServiceById } from '../lib/servicesCatalog';
import { useGetWorkersByCategory } from '../hooks/useQueries';
import WorkerCard from '../components/workers/WorkerCard';

export default function ServiceDetail() {
  const { serviceId } = useParams({ from: '/service/$serviceId' });
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const service = getServiceById(serviceId);
  const { data: workers, isLoading } = useGetWorkersByCategory(serviceId);

  if (!service) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg text-muted-foreground">Service not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">{service.icon}</span>
            {t(service.nameKey)}
          </h1>
          <p className="text-muted-foreground">Available workers in this category</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading workers...</p>
        </div>
      ) : workers && workers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker.id.toString()} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No workers available for this service yet.</p>
        </div>
      )}
    </div>
  );
}
