
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { LogOut, Shield, User, Truck, FileText } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useSupabaseAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'staff':
        return <User className="h-4 w-4" />;
      case 'waste_handler':
        return <Truck className="h-4 w-4" />;
      case 'regulator':
        return <FileText className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'staff':
        return 'Medical Staff';
      case 'waste_handler':
        return 'Waste Handler';
      case 'regulator':
        return 'Regulator';
      default:
        return 'User';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-healthcare-blue" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BioWaste Manager</h1>
              <p className="text-xs text-gray-500">Healthcare Waste Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              {getRoleIcon(user?.role || '')}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{getRoleLabel(user?.role || '')}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
