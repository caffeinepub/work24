import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '../i18n/I18nProvider';
import { useAdminLogin } from '../hooks/useQueries';
import { getAdminSession, setAdminSession, clearAdminSession } from '../lib/adminSession';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import AdminDashboardLayout from '../components/admin/AdminDashboardLayout';
import AdminSummaryCards from '../components/admin/AdminSummaryCards';
import MessagesTab from '../components/admin/MessagesTab';
import MaterialsTab from '../components/admin/MaterialsTab';
import WorkersTab from '../components/admin/WorkersTab';
import { LogOut } from 'lucide-react';

type AdminSection = 'overview' | 'messages' | 'materials' | 'workers';

export default function Admin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAdminSession());
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  
  const loginMutation = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      if (result) {
        setAdminSession(username, password);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      } else {
        alert(t('admin.invalidCredentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(t('admin.loginError'));
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setActiveSection('overview');
    navigate({ to: '/' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background p-4">
        <Card className="w-full max-w-md border-admin-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-admin-foreground">
              {t('admin.title')}
            </CardTitle>
            <CardDescription className="text-admin-muted">
              {t('admin.loginPrompt')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-admin-foreground">
                  {t('admin.username')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                  className="bg-admin-input border-admin-border text-admin-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-admin-foreground">
                  {t('admin.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                  className="bg-admin-input border-admin-border text-admin-foreground"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-admin-primary hover:bg-admin-primary/90 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('admin.loggingIn') : t('admin.login')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-background">
      <AdminDashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-admin-foreground">
                {activeSection === 'overview' && t('admin.dashboard')}
                {activeSection === 'messages' && t('admin.messages')}
                {activeSection === 'materials' && t('admin.materials')}
                {activeSection === 'workers' && t('admin.workers')}
              </h1>
              <p className="text-admin-muted mt-1">
                {activeSection === 'overview' && t('admin.dashboardDescription')}
                {activeSection === 'messages' && t('admin.messagesDescription')}
                {activeSection === 'materials' && t('admin.materialsDescription')}
                {activeSection === 'workers' && t('admin.workersDescription')}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-admin-border text-admin-foreground hover:bg-admin-accent"
            >
              <LogOut className="h-4 w-4" />
              {t('admin.logout')}
            </Button>
          </div>

          {/* Content */}
          {activeSection === 'overview' && <AdminSummaryCards />}
          {activeSection === 'messages' && <MessagesTab />}
          {activeSection === 'materials' && <MaterialsTab />}
          {activeSection === 'workers' && <WorkersTab />}
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
