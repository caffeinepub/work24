import { useState } from 'react';
import { Worker } from '../../types/workers';
import Work24Card from '../common/Work24Card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useI18n } from '../../i18n/I18nProvider';
import { sanitizeWorkerData } from '../../lib/safety/noDirectContact';

interface WorkerCardProps {
  worker: Worker;
  onContact: (worker: Worker) => void;
}

export default function WorkerCard({ worker, onContact }: WorkerCardProps) {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const safeWorker = sanitizeWorkerData(worker);

  return (
    <Work24Card className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-start space-x-4">
          <img
            src={safeWorker.profileImage}
            alt={safeWorker.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{safeWorker.name}</h3>
            <p className="text-sm text-muted-foreground">{safeWorker.skill}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{t('worker.workGallery')}</p>
          <div className="grid grid-cols-3 gap-2">
            {safeWorker.workImages.slice(0, 3).map((img: string, idx: number) => (
              <Dialog key={idx}>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="aspect-square rounded-md overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`Work ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <img
                    src={img}
                    alt={`Work ${idx + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onContact(worker)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {t('serviceDetail.contactButton')}
        </Button>
      </div>
    </Work24Card>
  );
}
