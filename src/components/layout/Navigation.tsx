import { LayoutDashboard, Gamepad2, Users, Target } from 'lucide-react';
import { useStore } from '@/store';
import clsx from 'clsx';

type Tab = 'dashboard' | 'games' | 'influencers' | 'campaigns';

interface TabItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: 'games',
    label: 'Jeux',
    icon: <Gamepad2 className="w-5 h-5" />,
  },
  {
    id: 'influencers',
    label: 'Influenceurs',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'campaigns',
    label: 'Campagnes',
    icon: <Target className="w-5 h-5" />,
  },
];

export function Navigation() {
  const { currentTab, setCurrentTab } = useStore();

  return (
    <nav className="card mx-4 mb-6 animate-slide-down">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
              currentTab === tab.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-text-medium hover:bg-surface-darker hover:text-text-primary'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
