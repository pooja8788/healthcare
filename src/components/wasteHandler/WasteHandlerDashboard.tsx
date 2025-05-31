
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, ClipboardList, BarChart3, AlertTriangle } from 'lucide-react';
import PickupRequests from './PickupRequests';
import DisposalLog from './DisposalLog';
import HandlerSummary from './HandlerSummary';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';

const WasteHandlerDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const { pickupRequests } = useSupabaseWasteStore();

  const pendingRequests = pickupRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Waste Handler Portal</h1>
        <p className="text-gray-600">Manage waste pickup requests and disposal operations</p>
      </div>

      {pendingRequests > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800">
              {pendingRequests} pending pickup request{pendingRequests !== 1 ? 's' : ''} require attention
            </span>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Pickup Requests</span>
            {pendingRequests > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                {pendingRequests}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="log" className="flex items-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span>Disposal Log</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Summary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-healthcare-blue" />
                <span>Pickup Requests</span>
              </CardTitle>
              <CardDescription>
                Manage waste pickup requests from facility bins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PickupRequests />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-healthcare-green" />
                <span>Waste Disposal Log</span>
              </CardTitle>
              <CardDescription>
                Record waste separation and disposal with photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisposalLog />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <HandlerSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteHandlerDashboard;
