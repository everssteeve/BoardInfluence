import { Header } from './Header';
import { Navigation } from './Navigation';
import { useStore } from '@/store';
import { Alert } from '@/components/common/Alert';
import { useEffect } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { alert, clearAlert } = useStore();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      {alert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-left">
          <Alert variant={alert.type} onClose={clearAlert}>
            {alert.message}
          </Alert>
        </div>
      )}

      <main className="container mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
}
