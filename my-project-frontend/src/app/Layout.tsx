import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  History, 
  AlertTriangle, 
  Settings, 
  PlusCircle, 
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { authApi } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sidebarItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'Ingest', path: '/ingest' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: History, label: 'Recent', path: '/recent' },
  { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const onLogout = () => {
    authApi.logout();
    navigate('/login', { replace: true });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-bottom">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Terminal className="w-8 h-8 text-primary" />
              {(isSidebarOpen || !isSidebarOpen) && <span className={cn("transition-opacity", !isSidebarOpen && "lg:hidden")}>LogMonitor</span>}
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className={cn("transition-opacity", !isSidebarOpen && "lg:hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-4 h-4" />
              {isSidebarOpen && <span>Collapse</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold capitalize">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Log Monitor'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild nativeButton>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleThemeChange('light')} onSelect={() => handleThemeChange('light')}>
                  <Sun className="mr-2 h-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('dark')} onSelect={() => handleThemeChange('dark')}>
                  <Moon className="mr-2 h-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('system')} onSelect={() => handleThemeChange('system')}>
                  <Monitor className="mr-2 h-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
