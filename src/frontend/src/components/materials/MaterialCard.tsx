import { Material } from '../../types/materials';
import Work24Card from '../common/Work24Card';
import { Button } from '@/components/ui/button';
import { useI18n } from '../../i18n/I18nProvider';
import { sanitizeMaterialData } from '../../lib/safety/noDirectContact';

interface MaterialCardProps {
  material: Material;
  onContact: () => void;
}

export default function MaterialCard({ material, onContact }: MaterialCardProps) {
  const { t } = useI18n();
  const safeMaterial = sanitizeMaterialData(material);

  return (
    <Work24Card className="h-full">
      <div className="aspect-video overflow-hidden">
        <img
          src={safeMaterial.images[0]}
          alt={safeMaterial.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{safeMaterial.name}</h3>
          <p className="text-sm text-muted-foreground">
            {t('materials.category')}: {safeMaterial.category}
          </p>
        </div>
        <p className="text-sm line-clamp-2">{safeMaterial.description}</p>
        <Button
          onClick={onContact}
          className="w-full bg-accent hover:bg-accent/90"
        >
          {t('materials.contactButton')}
        </Button>
      </div>
    </Work24Card>
  );
}
