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
    {
      title: 'Blog Posts',
      href: '/blog',
      icon: BookOpen,
    },
    {
      title: 'Upload Prescription',
      href: '/upload-prescription',
      icon: Upload,
    },
  ];

  const adminMenuItems = isAdmin ? [
    {
      title: 'CMS Dashboard',
      href: '/cms-dashboard',
      icon: Settings,
      subItems: [
        { title: 'Prescriptions', href: '/cms-dashboard?tab=prescriptions', icon: FileText },
        { title: 'Products', href: '/cms-dashboard?tab=products', icon: Package },
        { title: 'Blog Posts', href: '/cms-dashboard?tab=blog', icon: BookOpen },
        { title: 'Health Posts', href: '/cms-dashboard?tab=health', icon: Heart },
        { title: 'Users', href: '/cms-dashboard?tab=users', icon: Users },
      ],
    },
  ] : [];

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <NavigationMenuLink
      className={cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:bg-accent/80 hover:text-accent-foreground hover:scale-105 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 relative overflow-hidden",
        isActiveRoute(href) && "bg-accent text-accent-foreground shadow-sm",
        className
      )}
      onClick={() => navigate(href)}
    >
      <span className="relative z-10 flex items-center">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </NavigationMenuLink>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-2">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-1">
            {/* Main Navigation Items */}
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavLink href={item.href}>
                  <item.icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                  {item.title}
                </NavLink>
              </NavigationMenuItem>
            ))}

            {/* Admin/CMS Menu - Only show for admin users */}
            {isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "rounded-lg bg-transparent hover:bg-accent/80 hover:scale-105 transition-all duration-300 ease-out relative overflow-hidden group",
                    isActiveRoute('/cms-dashboard') && "bg-accent text-accent-foreground shadow-sm"
                  )}
                >
                  <div className="relative z-10 flex items-center">
                    <Settings className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                    CMS Dashboard
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-300">
                  <div className="grid gap-2 p-6 w-80 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl">
                    <div className="grid gap-1">
                      <h3 className="font-semibold leading-none mb-4 text-navy">Content Management</h3>
                      {adminMenuItems[0]?.subItems?.map((subItem) => (
                        <NavigationMenuLink
                          key={subItem.title}
                          className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] relative overflow-hidden group"
                          onClick={() => navigate(subItem.href)}
                        >
                          <div className="flex items-center space-x-3 relative z-10">
                            <subItem.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                            <div className="text-sm font-medium leading-none">{subItem.title}</div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
          className="relative ml-4 rounded-lg border-gray-200 hover:border-blue hover:bg-blue/5 hover:scale-105 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
        >
          <ShoppingCart className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
              {cartItemsCount}
            </span>
          )}
        </Button>

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="ml-2 rounded-lg border-gray-200 hover:border-blue hover:bg-blue/5 hover:scale-105 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
              >
                <User className="w-4 h-4 mr-2 transition-transform duration-200 hover:scale-110" />
                {user.user_metadata?.full_name || 'User'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-300"
            >
              <div className="px-3 py-2 text-sm">
                <div className="font-semibold text-navy">
                  {user.user_metadata?.full_name || 'User'}
                </div>
                <div className="text-gray-500 text-xs">{user.email}</div>
              </div>
              <DropdownMenuSeparator className="bg-gray-200/50" />
              {isAdmin && (
                <DropdownMenuItem 
                  onClick={() => navigate('/cms-dashboard')}
                  className="rounded-lg mx-1 transition-all duration-200 hover:bg-accent/50 hover:scale-[1.02] cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  CMS Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-200/50" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="rounded-lg mx-1 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-[1.02] cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            size="sm"
            className="ml-2 bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
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
          className="relative rounded-lg border-gray-200 hover:border-blue hover:bg-blue/5 transition-all duration-300 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cartItemsCount}
            </span>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg border-gray-200 hover:border-blue hover:bg-blue/5 transition-all duration-300 shadow-sm"
        >
          {isMobileMenuOpen ? 
            <X className="w-4 h-4 transition-transform duration-200" /> : 
            <Menu className="w-4 h-4 transition-transform duration-200" />
          }
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-xl z-50 animate-in fade-in-0 slide-in-from-top-4 duration-300">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] relative overflow-hidden group",
                    isActiveRoute(item.href) 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">{item.title}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              ))}

              {isAdmin && (
                <div className="space-y-2 border-t border-gray-200/50 pt-3 mt-3">
                  <div className="px-4 py-2 text-sm font-semibold text-navy">Content Management</div>
                  {adminMenuItems[0]?.subItems?.map((subItem) => (
                    <button
                      key={subItem.title}
                      onClick={() => {
                        navigate(subItem.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-6 py-3 rounded-lg text-left transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground hover:scale-[1.02] relative overflow-hidden group"
                    >
                      <subItem.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{subItem.title}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200/50 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm">
                      <div className="font-semibold text-navy">{user.user_metadata?.full_name || 'User'}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-[1.02] relative overflow-hidden group"
                    >
                      <User className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
