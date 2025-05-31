
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import DailyReports from './DailyReports';
import TotalSummary from './TotalSummary';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';

const RegulatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const { pickupRequests, bins } = useSupabaseWasteStore();

  const pendingRequests = pickupRequests.filter(req => req.status === 'pending').length;
  const overdueRequests = pickupRequests.filter(req => {
    if (req.status !== 'pending') return false;
    const hoursSinceRequest = (Date.now() - new Date(req.requestedAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceRequest > 24; // Consider overdue after 24 hours
  }).length;

  const complianceIssues = bins.filter(bin => bin.status === 'full').length + overdueRequests;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Regulatory Portal</h1>
        <p className="text-gray-600">Monitor compliance and analyze waste management data</p>
      </div>

      {complianceIssues > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">
              {complianceIssues} compliance issue{complianceIssues !== 1 ? 's' : ''} require attention
            </span>
          </div>
          <div className="text-sm text-red-700 mt-2">
            {bins.filter(bin => bin.status === 'full').length > 0 && (
              <p>• {bins.filter(bin => bin.status === 'full').length} bin(s) at capacity</p>
            )}
            {overdueRequests > 0 && (
              <p>• {overdueRequests} overdue pickup request(s)</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bins</CardTitle>
            <BarChart3 className="h-4 w-4 text-healthcare-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bins.length}</div>
            <p className="text-xs text-muted-foreground">
              Across facility locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <AlertTriangle className="h-4 w-4 text-healthcare-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-healthcare-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(0, 100 - (complianceIssues * 10))}%
            </div>
            <p className="text-xs text-muted-foreground">
              Current facility rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
            <FileText className="h-4 w-4 text-healthcare-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pickupRequests.filter(req => req.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed this period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Daily Reports</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Total Summary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-healthcare-blue" />
                <span>Daily Waste Reports</span>
              </CardTitle>
              <CardDescription>
                Auto-generated daily waste management reports and compliance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyReports />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <TotalSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegulatorDashboard;
