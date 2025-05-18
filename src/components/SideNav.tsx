
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Package,
  ShoppingCart,
  Settings,
  Home,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface SideNavProps {
  className?: string;
}

const SideNav = ({ className }: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Profile', path: '/profile', icon: <Settings size={20} /> },
  ];
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  // Mobile menu button shown in small screens
  const mobileMenuButton = (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleMobileMenu} 
      className="lg:hidden fixed top-4 left-4 z-50"
    >
      {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );
  
  return (
    <>
      {mobileMenuButton}
      
      <aside 
        className={cn(
          "dashboard-sidebar bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "fixed lg:relative z-40",
          className
        )}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="bg-picknpay-purple text-white font-bold rounded-md p-1 text-sm">P&P</span>
              <span className="font-semibold">Pick-n-Pay</span>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex" 
            onClick={toggleCollapse}
          >
            <Menu size={20} />
          </Button>
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.path ? 
                      "bg-picknpay-purple-light text-picknpay-purple-dark" : 
                      "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom section with logout */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full text-gray-700 hover:bg-gray-50 transition-colors",
              isCollapsed && "justify-center p-2"
            )}
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>
      
      {/* Backdrop for mobile menu */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden" 
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default SideNav;
