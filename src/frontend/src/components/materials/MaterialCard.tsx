import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Material } from '../../backend';
import ContactViaWork24Dialog from '../contact/ContactViaWork24Dialog';

interface MaterialCardProps {
  material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-medium hover:border-primary transition-all">
        {material.images.length > 0 && (
          <div className="aspect-square relative">
            <img
              src={material.images[0].getDirectURL()}
              alt={material.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{material.name}</h3>
            <p className="text-sm text-primary font-medium">{material.category}</p>
            <p className="text-sm text-muted-foreground">{material.location}</p>
          </div>
          <p className="text-sm line-clamp-2">{material.description}</p>
          <Button className="w-full" onClick={() => setContactDialogOpen(true)}>
            Contact Us to Buy
          </Button>
        </div>
      </div>

      <ContactViaWork24Dialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        targetId={material.id}
        targetType="material"
        targetName={material.name}
      />
    </>
  );
}
