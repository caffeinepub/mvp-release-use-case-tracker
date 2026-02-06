import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Settings, BarChart3, FolderKanban, Layers } from 'lucide-react';
import { useAdminSession } from '../lib/adminSession';

type View = 'usecases' | 'releases' | 'phases' | 'admin' | 'dashboard';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const { isAdminSession } = useAdminSession();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tight">MVP Release Use Case Tracker</h1>
            {isAdminSession && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Admin Session Active
              </Badge>
            )}
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'usecases' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('usecases')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Use Cases
            </Button>
            <Button
              variant={currentView === 'phases' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('phases')}
            >
              <Layers className="h-4 w-4 mr-2" />
              Phases
            </Button>
            <Button
              variant={currentView === 'releases' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('releases')}
            >
              <FolderKanban className="h-4 w-4 mr-2" />
              Releases
            </Button>
            <Button
              variant={currentView === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('admin')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
