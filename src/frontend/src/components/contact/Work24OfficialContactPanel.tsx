import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useI18n } from '../../i18n/I18nProvider';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_EMAIL, OFFICIAL_PHONE_LINK, OFFICIAL_EMAIL_LINK } from '../../lib/officialContact';

interface Work24OfficialContactPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Work24OfficialContactPanel({
  open,
  onOpenChange,
}: Work24OfficialContactPanelProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('officialContact.title')}</DialogTitle>
          <DialogDescription>{t('officialContact.description')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('officialContact.phone')}</p>
              <a href={OFFICIAL_PHONE_LINK} className="text-sm text-primary hover:underline">
                {OFFICIAL_PHONE_DISPLAY}
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('officialContact.email')}</p>
              <a href={OFFICIAL_EMAIL_LINK} className="text-sm text-primary hover:underline break-all">
                {OFFICIAL_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          {t('officialContact.close')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
