
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockShopProfile } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  const notificationCount = 3; // Demo value
  
  return (
    <header className="dashboard-header border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between w-full animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      
      <div className="hidden md:block max-w-md w-full mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search orders, products..."
            className="pl-10 border-gray-200 focus:border-picknpay-purple"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-picknpay-orange w-5 h-5 p-0 flex items-center justify-center text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-picknpay-purple">
            <AvatarImage src={mockShopProfile.logoUrl} alt={mockShopProfile.name} />
            <AvatarFallback className="bg-picknpay-purple-light text-picknpay-purple">
              {mockShopProfile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium">{mockShopProfile.name}</p>
            <p className="text-xs text-gray-500">{mockShopProfile.ownerName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
