import { Link, useNavigate } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useI18n } from '../../i18n/I18nProvider';
import { isAdminLoggedIn } from '../../lib/adminSession';
import LanguageSwitcher from '../settings/LanguageSwitcher';

export default function AppHeader() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const showAdmin = isAdminLoggedIn();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Materials', path: '/materials' },
    { label: 'Career', path: '/career' },
    { label: 'Architect', path: '/architect' },
    { label: 'Register Worker', path: '/worker-submission' },
    { label: 'Sell Material', path: '/seller-submission' },
    { label: 'Contact', path: '/contact' },
  ];

  if (showAdmin) {
    navItems.push({ label: 'Admin', path: '/admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/assets/generated/work24-logo.dim_512x512.png" 
            alt="Work24" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: item.path })}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Button>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-2 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => navigate({ to: item.path })}
                    className="justify-start text-base"
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
