import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import Work24Card from '../components/common/Work24Card';
import { useI18n } from '../i18n/I18nProvider';
import { services } from '../lib/servicesCatalog';

export default function HomeServices() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                {t('home.hero.title')}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                {t('home.hero.subtitle')}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('home.hero.description')}
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-medium">
              <img
                src="/assets/generated/work24-hero-illustration.dim_1600x900.png"
                alt="Work24 Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t('home.services.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('home.services.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Work24Card
              key={service.id}
              onClick={() => navigate({ to: '/service/$serviceId', params: { serviceId: service.id } })}
            >
              <div className="p-6 space-y-4 text-center">
                <div className="text-6xl">{service.icon}</div>
                <h3 className="text-xl font-semibold">{t(service.nameKey)}</h3>
                <Button variant="outline" className="w-full">
                  {t('services.viewWorkers')}
                </Button>
              </div>
            </Work24Card>
          ))}
        </div>
      </section>
    </div>
  );
}
