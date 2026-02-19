import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Worker } from '../../backend';
import ContactViaWork24Dialog from '../contact/ContactViaWork24Dialog';

interface WorkerCardProps {
  worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium hover:border-primary transition-all">
        <div className="aspect-square relative">
          <img
            src={worker.profileImage.getDirectURL()}
            alt={worker.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{worker.name}</h3>
            <p className="text-sm text-muted-foreground">{worker.skill}</p>
            <p className="text-sm text-muted-foreground">{worker.location}</p>
          </div>

          {worker.workImages.length > 0 && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => setGalleryOpen(true)}>
              View Work ({worker.workImages.length} photos)
            </Button>
          )}

          <Button className="w-full" onClick={() => setContactDialogOpen(true)}>
            Contact via Work24
          </Button>
        </div>
      </div>

      <ContactViaWork24Dialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        targetId={worker.id}
        targetType="worker"
        targetName={worker.name}
      />

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{worker.name}'s Work</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
            {worker.workImages.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={image.getDirectURL()}
                  alt={`Work ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
