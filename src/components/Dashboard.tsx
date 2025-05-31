
import React from 'react';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import StaffDashboard from './staff/StaffDashboard';
import WasteHandlerDashboard from './wasteHandler/WasteHandlerDashboard';
import RegulatorDashboard from './regulator/RegulatorDashboard';
import Navigation from './Navigation';

const Dashboard = () => {
  const { user } = useSupabaseAuthStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'staff':
        return <StaffDashboard />;
      case 'waste_handler':
        return <WasteHandlerDashboard />;
      case 'regulator':
        return <RegulatorDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
