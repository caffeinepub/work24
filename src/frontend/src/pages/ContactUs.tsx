import { Phone, Mail } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_PHONE_LINK, OFFICIAL_EMAIL, OFFICIAL_EMAIL_LINK } from '../lib/officialContact';

export default function ContactUs() {
  const { t } = useI18n();

  return (
    <div className="container max-w-4xl py-8 space-y-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Contact Work24</h1>
        <p className="text-muted-foreground">Get in touch with us</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-lg shadow-medium space-y-6">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Phone</p>
                <a href={OFFICIAL_PHONE_LINK} className="text-primary hover:underline">
                  {OFFICIAL_PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <a href={OFFICIAL_EMAIL_LINK} className="text-primary hover:underline">
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-medium space-y-6">
          <h2 className="text-2xl font-semibold">Our Services</h2>
          <p className="text-muted-foreground">
            We provide complete turnkey projects for all your home service needs. From planning to execution, we handle everything.
          </p>
          
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Response Time</h3>
            <p className="text-muted-foreground">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
