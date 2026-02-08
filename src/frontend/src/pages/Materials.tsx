import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { getMaterials } from '../lib/materialsStorage';
import MaterialCard from '../components/materials/MaterialCard';
import Work24OfficialContactPanel from '../components/contact/Work24OfficialContactPanel';

export default function Materials() {
  const { t } = useI18n();
  const materials = getMaterials();
  const [contactPanelOpen, setContactPanelOpen] = useState(false);

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">{t('materials.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('materials.subtitle')}</p>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">{t('materials.noMaterials')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onContact={() => setContactPanelOpen(true)}
            />
          ))}
        </div>
      )}

      <Work24OfficialContactPanel
        open={contactPanelOpen}
        onOpenChange={setContactPanelOpen}
      />
    </div>
  );
}
