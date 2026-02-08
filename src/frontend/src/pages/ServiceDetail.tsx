import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useI18n } from '../i18n/I18nProvider';
import { getServiceById } from '../lib/servicesCatalog';
import { getWorkersByService } from '../lib/workersStorage';
import { Worker } from '../types/workers';
import WorkerCard from '../components/workers/WorkerCard';
import ContactViaWork24Dialog from '../components/contact/ContactViaWork24Dialog';

export default function ServiceDetail() {
  const { serviceId } = useParams({ from: '/service/$serviceId' });
  const { t } = useI18n();
  const service = getServiceById(serviceId);
  const workers = getWorkersByService(serviceId);
  
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleContact = (worker: Worker) => {
    setSelectedWorker(worker);
    setContactDialogOpen(true);
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          {service ? t(service.nameKey) : serviceId}
        </h1>
        <p className="text-lg text-muted-foreground">{t('serviceDetail.title')}</p>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">{t('serviceDetail.noWorkers')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onContact={handleContact}
            />
          ))}
        </div>
      )}

      <ContactViaWork24Dialog
        worker={selectedWorker}
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
}
