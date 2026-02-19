import { Phone, Mail, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { OFFICIAL_PHONE_DISPLAY, OFFICIAL_PHONE_LINK, OFFICIAL_EMAIL, OFFICIAL_EMAIL_LINK } from '../../lib/officialContact';

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'work24-app');

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={OFFICIAL_PHONE_LINK} className="hover:text-primary transition-colors">
                  {OFFICIAL_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={OFFICIAL_EMAIL_LINK} className="hover:text-primary transition-colors">
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Our Services</h3>
            <p className="text-sm text-muted-foreground">
              Complete turnkey projects for all your home service needs
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/materials" className="hover:text-primary transition-colors">
                Materials
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Work24. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
