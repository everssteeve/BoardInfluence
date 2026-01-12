import { LayoutDashboard, Gamepad2, Users, Target, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: '/games',
    label: 'Jeux',
    icon: <Gamepad2 className="w-5 h-5" />,
  },
  {
    path: '/influencers',
    label: 'Influenceurs',
    icon: <Users className="w-5 h-5" />,
  },
  {
    path: '/campaigns',
    label: 'Campagnes',
    icon: <Target className="w-5 h-5" />,
  },
  {
    path: '/reports',
    label: 'Rapports',
    icon: <FileText className="w-5 h-5" />,
  },
];

export function Navigation() {
  return (
    <nav className="card mx-4 mb-6 animate-slide-down">
      <div className="flex gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-text-medium hover:bg-surface-darker hover:text-text-primary'
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
