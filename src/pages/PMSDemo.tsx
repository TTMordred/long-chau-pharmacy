import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { PMSApp } from '@/com/longchau/pms/main/PMSApp';

const PMSDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        cartItemsCount={0} 
        onCartClick={() => {}} 
        searchQuery="" 
        onSearchChange={() => {}} 
      />
      <PMSApp />
    </div>
  );
};

export default PMSDemo;
