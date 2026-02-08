import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import { getOnboardingStatus } from './lib/localPreferences';
import AppShell from './components/layout/AppShell';
import Onboarding from './pages/Onboarding';
import HomeServices from './pages/HomeServices';
import ServiceDetail from './pages/ServiceDetail';
import Materials from './pages/Materials';
import Career from './pages/Career';
import Architect from './pages/Architect';
import WorkerSubmission from './pages/WorkerSubmission';
import SellerMaterialSubmission from './pages/SellerMaterialSubmission';
import ContactUs from './pages/ContactUs';

function RootComponent() {
  const { t } = useI18n();
  const isOnboarded = getOnboardingStatus();

  useEffect(() => {
    document.title = t('app.title');
  }, [t]);

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeServices,
});

const serviceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/service/$serviceId',
  component: ServiceDetail,
});

const materialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/materials',
  component: Materials,
});

const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/career',
  component: Career,
});

const architectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/architect',
  component: Architect,
});

const workerSubmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker-submission',
  component: WorkerSubmission,
});

const sellerMaterialSubmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller-submission',
  component: SellerMaterialSubmission,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUs,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  serviceDetailRoute,
  materialsRoute,
  careerRoute,
  architectRoute,
  workerSubmissionRoute,
  sellerMaterialSubmissionRoute,
  contactRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
