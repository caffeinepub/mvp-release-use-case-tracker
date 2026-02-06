import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import UseCasesPage from './pages/UseCasesPage';
import ReleasesPage from './pages/ReleasesPage';
import PhasesPage from './pages/PhasesPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';

type View = 'usecases' | 'releases' | 'phases' | 'admin' | 'dashboard';

const queryClient = new QueryClient();

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('usecases');

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-6">
        {currentView === 'usecases' && <UseCasesPage />}
        {currentView === 'releases' && <ReleasesPage />}
        {currentView === 'phases' && <PhasesPage />}
        {currentView === 'admin' && <AdminPage />}
        {currentView === 'dashboard' && <DashboardPage />}
      </main>
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025. Built with love using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
