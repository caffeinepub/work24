import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '../i18n/I18nProvider';
import { useGetAdminMessages } from '../hooks/useQueries';
import { setAdminSession, clearAdminSession, isAdminLoggedIn } from '../lib/adminSession';
import { useQueryClient } from '@tanstack/react-query';
import MaterialsTab from '../components/admin/MaterialsTab';
import WorkersTab from '../components/admin/WorkersTab';
import MessagesTab from '../components/admin/MessagesTab';

export default function Admin() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { error } = useGetAdminMessages();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Trim whitespace from inputs to prevent accidental spaces
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Validate credentials - both username and password should be 'Bharat1213'
    if (trimmedUsername === 'Bharat1213' && trimmedPassword === 'Bharat1213') {
      setAdminSession(trimmedUsername, trimmedPassword);
      setIsLoggedIn(true);
      // Trigger data fetch
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
        queryClient.invalidateQueries({ queryKey: ['materials'] });
        queryClient.invalidateQueries({ queryKey: ['workers'] });
      }, 100);
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    queryClient.clear();
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t('admin.loginTitle')}</CardTitle>
            <CardDescription>{t('admin.loginDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('admin.usernameLabel')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('admin.usernamePlaceholder')}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('admin.passwordLabel')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('admin.passwordPlaceholder')}
                  required
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? t('admin.loggingIn') : t('admin.loginButton')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if unauthorized
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('admin.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>{t('admin.accessDenied')}</AlertTitle>
              <AlertDescription>
                {t('admin.accessDeniedDescription')}
              </AlertDescription>
            </Alert>
            <Button onClick={handleLogout} variant="outline" className="mt-4">
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('admin.title')}</CardTitle>
              <CardDescription>{t('admin.dashboardDescription')}</CardDescription>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">{t('admin.messagesTab')}</TabsTrigger>
              <TabsTrigger value="materials">{t('admin.materialsTab')}</TabsTrigger>
              <TabsTrigger value="workers">{t('admin.workersTab')}</TabsTrigger>
            </TabsList>
            <TabsContent value="messages" className="mt-6">
              <MessagesTab />
            </TabsContent>
            <TabsContent value="materials" className="mt-6">
              <MaterialsTab />
            </TabsContent>
            <TabsContent value="workers" className="mt-6">
              <WorkersTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
