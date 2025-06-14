
import { useState } from 'react';
import { Search, ShoppingCart, User, Upload, FileText, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useHasRole } from '@/hooks/useUserRoles';

interface DashboardHeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DashboardHeader = ({ cartItemsCount, onCartClick, searchQuery, onSearchChange }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { data: isAdmin } = useHasRole('admin');
  const { data: isContentManager } = useHasRole('content_manager');
  const { data: isPharmacist } = useHasRole('pharmacist');

  const canAccessCMS = isAdmin || isContentManager || isPharmacist;

  const handleUploadClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/upload-prescription');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue to-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <span className="text-xl font-bold text-navy">Long Chau</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search medicines, health products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:ring-2 focus:ring-blue/20 focus:border-blue"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Upload Prescription Button */}
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-blue text-blue hover:bg-blue hover:text-white"
            >
              <Upload className="w-4 h-4" />
              Upload Prescription
            </Button>

            {/* Mobile Upload Button */}
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              className="sm:hidden"
            >
              <Upload className="w-4 h-4" />
            </Button>

            {/* Cart */}
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
              <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">
                      {user.user_metadata?.full_name || 'User'}
                    </div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleUploadClick}>
                    <FileText className="w-4 h-4 mr-2" />
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
                    <LogOut className="w-4 h-4 mr-2" />
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
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
