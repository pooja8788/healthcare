
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';

const Index = () => {
  const { isAuthenticated, loading, initialize } = useSupabaseAuthStore();
  const { 
    fetchBins, 
    fetchPickupRequests, 
    fetchWasteEntries, 
    fetchActivityLogs,
    subscribeToRealTimeUpdates,
    unsubscribeFromRealTimeUpdates
  } = useSupabaseWasteStore();

  useEffect(() => {
    // Initialize auth
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Fetch initial data and setup real-time updates when authenticated
    if (isAuthenticated) {
      console.log('User authenticated, fetching initial data...');
      
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchBins(),
            fetchPickupRequests(),
            fetchWasteEntries(),
            fetchActivityLogs()
          ]);
          console.log('Initial data fetch completed');
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };

      fetchData();
      subscribeToRealTimeUpdates();
    } else {
      console.log('User not authenticated, unsubscribing from updates');
      unsubscribeFromRealTimeUpdates();
    }

    // Cleanup on unmount
    return () => {
      unsubscribeFromRealTimeUpdates();
    };
  }, [isAuthenticated, fetchBins, fetchPickupRequests, fetchWasteEntries, fetchActivityLogs, subscribeToRealTimeUpdates, unsubscribeFromRealTimeUpdates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-blue to-healthcare-lightBlue flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

export default Index;
