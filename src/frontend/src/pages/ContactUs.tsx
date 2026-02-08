import { Phone, Mail, MapPin } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_EMAIL, OFFICIAL_PHONE_LINK, OFFICIAL_EMAIL_LINK } from '../lib/officialContact';

export default function ContactUs() {
  const { t } = useI18n();

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('contactUs.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('contactUs.subtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border shadow-soft hover:shadow-medium transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('contactUs.phoneLabel')}</h3>
              <a 
                href={OFFICIAL_PHONE_LINK} 
                className="text-lg text-primary hover:underline"
              >
                {OFFICIAL_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border shadow-soft hover:shadow-medium transition-shadow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('contactUs.emailLabel')}</h3>
              <a 
                href={OFFICIAL_EMAIL_LINK} 
                className="text-lg text-primary hover:underline break-all"
              >
                {OFFICIAL_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-lg bg-muted/50 border">
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-3">{t('contactUs.servicesTitle')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('contactUs.servicesDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>{t('contactUs.responseTime')}</p>
        </div>
      </div>
    </div>
  );
}
