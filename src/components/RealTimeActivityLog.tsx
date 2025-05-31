
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { Activity, Clock, User, Database } from 'lucide-react';

const RealTimeActivityLog = () => {
  const { activityLogs, fetchActivityLogs, subscribeToRealTimeUpdates, unsubscribeFromRealTimeUpdates } = useSupabaseWasteStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchActivityLogs();
    
    // Subscribe to real-time updates
    subscribeToRealTimeUpdates();
    setIsConnected(true);

    return () => {
      unsubscribeFromRealTimeUpdates();
      setIsConnected(false);
    };
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'waste_added':
        return 'bg-blue-500';
      case 'pickup_requested':
        return 'bg-orange-500';
      case 'pickup_completed':
        return 'bg-green-500';
      case 'user_login':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'waste_added':
        return 'Waste Added';
      case 'pickup_requested':
        return 'Pickup Requested';
      case 'pickup_completed':
        return 'Pickup Completed';
      case 'user_login':
        return 'User Login';
      default:
        return action.replace('_', ' ').toUpperCase();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-healthcare-blue" />
            <CardTitle>Real-Time Activity Log</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <CardDescription>
          Live updates of all waste management activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activityLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No activity logs yet</p>
              <p className="text-sm">Activities will appear here in real-time</p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActionColor(log.action)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {getActionLabel(log.action)}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{log.user_name || 'System'}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{log.entity_type}</span>
                    </div>
                    
                    {log.details && (
                      <div className="mt-2 text-xs text-gray-600">
                        {log.details.location && (
                          <div>Location: {log.details.location}</div>
                        )}
                        {log.details.wasteType && (
                          <div>Waste Type: {log.details.wasteType}</div>
                        )}
                        {log.details.quantity && (
                          <div>Quantity: {log.details.quantity} {log.details.unit}</div>
                        )}
                        {log.details.handlerName && (
                          <div>Handler: {log.details.handlerName}</div>
                        )}
                        {log.details.photosCount && (
                          <div>Photos: {log.details.photosCount}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeActivityLog;
