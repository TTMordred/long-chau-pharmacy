
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  Upload, 
  ShoppingCart, 
  User, 
  Settings, 
  FileText, 
  BookOpen, 
  Package,
  Users,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useHasRole } from '@/hooks/useUserRoles';
import { cn } from '@/lib/utils';

interface MainNavigationProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const MainNavigation = ({ cartItemsCount, onCartClick }: MainNavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: isAdmin } = useHasRole('admin');
  const { data: isContentManager } = useHasRole('content_manager');
  const { data: isPharmacist } = useHasRole('pharmacist');

  const canAccessCMS = isAdmin || isContentManager || isPharmacist;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      icon: Home,
    },
    {
      title: 'Health & Wellness',
      href: '/health',
      icon: Heart,
    },
  ];

  const userMenuItems = [
    {
      title: 'Upload Prescription',
      href: '/upload-prescription',
      icon: Upload,
      requiresAuth: true,
    },
  ];

  const adminMenuItems = canAccessCMS ? [
    {
      title: 'CMS Dashboard',
      href: '/cms-dashboard',
      icon: Settings,
      subItems: [
        { title: 'Prescriptions', href: '/cms-dashboard?tab=prescriptions', icon: FileText },
        { title: 'Products', href: '/cms-dashboard?tab=products', icon: Package },
        { title: 'Blog Posts', href: '/cms-dashboard?tab=blog', icon: BookOpen },
        { title: 'Health Posts', href: '/cms-dashboard?tab=health', icon: Heart },
        ...(isAdmin ? [{ title: 'Users', href: '/cms-dashboard?tab=users', icon: Users }] : []),
      ],
    },
  ] : [];

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <NavigationMenuLink
      className={cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
        isActiveRoute(href) && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => navigate(href)}
    >
      {children}
    </NavigationMenuLink>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-2">
            {/* Main Navigation Items */}
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavLink href={item.href}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.title}
                </NavLink>
              </NavigationMenuItem>
            ))}

            {/* User Menu Items */}
            {user && userMenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavLink href={item.href}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.title}
                </NavLink>
              </NavigationMenuItem>
            ))}

            {/* Admin/CMS Menu */}
            {canAccessCMS && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  isActiveRoute('/cms-dashboard') && "bg-accent text-accent-foreground"
                )}>
                  <Settings className="w-4 h-4 mr-2" />
                  CMS Dashboard
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-80">
                    <div className="grid gap-1">
                      <h3 className="font-medium leading-none mb-3">Content Management</h3>
                      {adminMenuItems[0]?.subItems?.map((subItem) => (
                        <NavigationMenuLink
                          key={subItem.title}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={() => navigate(subItem.href)}
                        >
                          <div className="flex items-center space-x-2">
                            <subItem.icon className="w-4 h-4" />
                            <div className="text-sm font-medium leading-none">{subItem.title}</div>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Cart Button */}
        <Button
          onClick={onCartClick}
          variant="outline"
          size="sm"
          className="relative"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Button>

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                {user.user_metadata?.full_name || 'User'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">
                  {user.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-gray-500">{user.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/upload-prescription')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Prescription
              </DropdownMenuItem>
              {canAccessCMS && (
                <DropdownMenuItem onClick={() => navigate('/cms-dashboard')}>
                  <Settings className="w-4 h-4 mr-2" />
                  CMS Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <User className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            size="sm"
            className="bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90"
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden flex items-center space-x-2">
        <Button
          onClick={onCartClick}
          variant="outline"
          size="sm"
          className="relative"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-left transition-colors",
                    isActiveRoute(item.href) 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </button>
              ))}

              {user && userMenuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-left transition-colors",
                    isActiveRoute(item.href) 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </button>
              ))}

              {canAccessCMS && (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Content Management</div>
                  {adminMenuItems[0]?.subItems?.map((subItem) => (
                    <button
                      key={subItem.title}
                      onClick={() => {
                        navigate(subItem.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-6 py-2 rounded-md text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span>{subItem.title}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm">
                      <div className="font-medium">{user.user_metadata?.full_name || 'User'}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavigation;
