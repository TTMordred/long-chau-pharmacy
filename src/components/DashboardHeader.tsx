
import { useState } from 'react';
import { Search, ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

interface DashboardHeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DashboardHeader = ({ cartItemsCount, onCartClick, searchQuery, onSearchChange }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-mint/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue to-mint rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">LC</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-navy">Long Chau</h1>
              <p className="text-xs text-navy/60 hidden sm:block">Your Health Partner</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy/40 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search medicines, vitamins, baby care..."
              className="pl-10 bg-sage/10 border-mint/40 focus:border-blue/50 rounded-2xl"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative bg-sage/20 hover:bg-sage/30 rounded-2xl p-3"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5 text-navy" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-blue text-white text-xs">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* User Menu or Auth Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="bg-blue/10 hover:bg-blue/20 rounded-2xl p-3">
                    <User className="w-5 h-5 text-navy" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-navy">{user.email}</p>
                    <p className="text-xs text-navy/60">Welcome back!</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue to-navy hover:from-blue/90 hover:to-navy/90 text-white rounded-2xl px-6"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default DashboardHeader;
