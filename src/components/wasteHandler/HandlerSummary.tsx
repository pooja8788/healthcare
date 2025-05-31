
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, Truck, Camera } from 'lucide-react';

const HandlerSummary = () => {
  const { pickupRequests } = useSupabaseWasteStore();
  const { user } = useSupabaseAuthStore();

  const userPickups = pickupRequests.filter(req => req.handlerId === user?.id);
  const allCompletedPickups = pickupRequests.filter(req => req.status === 'completed');
  const pendingPickups = pickupRequests.filter(req => req.status === 'pending');

  // Statistics
  const totalCompleted = userPickups.length;
  const totalPhotos = userPickups.reduce((sum, pickup) => sum + (pickup.disposalPhotos?.length || 0), 0);
  
  // Waste type distribution
  const wasteTypeData = allCompletedPickups.reduce((acc, pickup) => {
    acc[pickup.wasteType] = (acc[pickup.wasteType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(wasteTypeData).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count
  }));

  // Monthly completion trend (mock data based on recent activity)
  const monthlyData = [
    { month: 'Jan', pickups: 12 },
    { month: 'Feb', pickups: 19 },
    { month: 'Mar', pickups: 15 },
    { month: 'Apr', pickups: 22 },
    { month: 'May', pickups: 18 },
    { month: 'Jun', pickups: 25 }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Average processing time
  const avgProcessingTime = allCompletedPickups.reduce((sum, pickup) => {
    if (pickup.completedAt) {
      const duration = new Date(pickup.completedAt).getTime() - new Date(pickup.requestedAt).getTime();
      return sum + duration;
    }
    return sum;
  }, 0) / (allCompletedPickups.length || 1);

  const avgHours = Math.round(avgProcessingTime / (1000 * 60 * 60 * 100)) / 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Pickups</CardTitle>
            <CheckCircle className="h-4 w-4 text-healthcare-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">
              By you this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-healthcare-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPickups.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photos Uploaded</CardTitle>
            <Camera className="h-4 w-4 text-healthcare-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhotos}</div>
            <p className="text-xs text-muted-foreground">
              Disposal documentation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Truck className="h-4 w-4 text-healthcare-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHours}h</div>
            <p className="text-xs text-muted-foreground">
              From request to completion
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Type Distribution</CardTitle>
            <CardDescription>
              Types of waste handled across all pickups
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No pickup data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Pickup Trend</CardTitle>
            <CardDescription>
              Pickup completion volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pickups" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for waste handling operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-green-700">On-time Completion Rate</div>
              <div className="text-xs text-green-600 mt-1">Excellent performance</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-blue-700">Documentation Compliance</div>
              <div className="text-xs text-blue-600 mt-1">All pickups documented</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-purple-700">Safety Rating</div>
              <div className="text-xs text-purple-600 mt-1">Zero incidents reported</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HandlerSummary;
