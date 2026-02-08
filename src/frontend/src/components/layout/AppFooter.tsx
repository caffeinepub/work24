import { Heart, Phone, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useI18n } from '../../i18n/I18nProvider';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_EMAIL, OFFICIAL_PHONE_LINK, OFFICIAL_EMAIL_LINK } from '../../lib/officialContact';

export default function AppFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t bg-muted/30 py-12 mt-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contactTitle')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href={OFFICIAL_PHONE_LINK} className="hover:text-primary hover:underline">
                  {OFFICIAL_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a href={OFFICIAL_EMAIL_LINK} className="hover:text-primary hover:underline break-all">
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.servicesTitle')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.servicesDescription')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinksTitle')}</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm hover:text-primary hover:underline">
                {t('footer.contactUsLink')}
              </Link>
              <Link to="/career" className="block text-sm hover:text-primary hover:underline">
                {t('nav.career')}
              </Link>
              <Link to="/materials" className="block text-sm hover:text-primary hover:underline">
                {t('nav.materials')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}{' '}
              <Heart className="inline h-4 w-4 text-destructive fill-destructive" />{' '}
              {t('footer.using')}{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {t('footer.caffeine')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
