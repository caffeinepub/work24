import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useI18n } from '../i18n/I18nProvider';
import { setAdminSession, clearAdminSession, isAdminLoggedIn } from '../lib/adminSession';
import MessagesTab from '../components/admin/MessagesTab';
import MaterialsTab from '../components/admin/MaterialsTab';
import WorkersTab from '../components/admin/WorkersTab';

const ADMIN_USERNAME = 'Bharat1213';
const ADMIN_PASSWORD = 'Bharat1213';

export default function Admin() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn());

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      setAdminSession(credentials.username, credentials.password);
      setIsLoggedIn(true);
      setError('');
      toast.success('Logged in successfully');
    } else {
      setError('Invalid credentials');
      toast.error('Invalid username or password');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsLoggedIn(false);
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  if (!isLoggedIn) {
    return (
      <div className="container max-w-md py-16 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => {
                setCredentials({ ...credentials, username: e.target.value });
                setError('');
              }}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => {
                setCredentials({ ...credentials, password: e.target.value });
                setError('');
              }}
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage messages, materials, and worker profiles</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="workers">Workers</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsTab />
        </TabsContent>

        <TabsContent value="workers">
          <WorkersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
