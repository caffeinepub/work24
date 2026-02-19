import { useI18n } from '../i18n/I18nProvider';
import { useGetAllMaterials } from '../hooks/useQueries';
import MaterialCard from '../components/materials/MaterialCard';

export default function Materials() {
  const { t } = useI18n();
  const { data: materials, isLoading } = useGetAllMaterials();

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Materials for Sale</h1>
        <p className="text-muted-foreground">Browse available construction materials</p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading materials...</p>
        </div>
      ) : materials && materials.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <MaterialCard key={material.id.toString()} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No materials available yet.</p>
        </div>
      )}
    </div>
  );
}
