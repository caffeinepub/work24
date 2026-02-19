import React, { ReactNode, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { LayoutDashboard, MessageSquare, Package, Users, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

type AdminSection = 'overview' | 'messages' | 'materials' | 'workers';

interface AdminDashboardLayoutProps {
  children: ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

const navigationItems = [
  { id: 'overview' as AdminSection, icon: LayoutDashboard, labelKey: 'admin.dashboard' },
  { id: 'messages' as AdminSection, icon: MessageSquare, labelKey: 'admin.messages' },
  { id: 'materials' as AdminSection, icon: Package, labelKey: 'admin.materials' },
  { id: 'workers' as AdminSection, icon: Users, labelKey: 'admin.workers' },
];

export default function AdminDashboardLayout({
  children,
  activeSection,
  onSectionChange,
}: AdminDashboardLayoutProps) {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-admin-sidebar border-r border-admin-border">
      <div className="p-6 border-b border-admin-border">
        <h2 className="text-xl font-bold text-admin-foreground">Work24 Admin</h2>
        <p className="text-sm text-admin-muted mt-1">{t('admin.dashboardSubtitle')}</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-left',
                isActive
                  ? 'bg-admin-accent text-admin-accent-foreground'
                  : 'text-admin-muted hover:bg-admin-accent/50 hover:text-admin-foreground'
              )}
              onClick={() => {
                onSectionChange(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <Icon className="h-5 w-5" />
              {t(item.labelKey)}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="bg-admin-background border-admin-border">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
