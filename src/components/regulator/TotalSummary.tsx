
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Recycle, Award, AlertTriangle, CheckCircle } from 'lucide-react';

const TotalSummary = () => {
  const { wasteEntries, pickupRequests, bins } = useSupabaseWasteStore();

  // Calculate comprehensive statistics
  const totalWaste = wasteEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const completedPickups = pickupRequests.filter(req => req.status === 'completed').length;
  const pendingPickups = pickupRequests.filter(req => req.status === 'pending').length;
  const totalStaff = [...new Set(wasteEntries.map(entry => entry.staffId))].length;

  // Waste by type for pie chart
  const wasteByType = wasteEntries.reduce((acc, entry) => {
    acc[entry.wasteType] = (acc[entry.wasteType] || 0) + entry.quantity;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(wasteByType).map(([type, quantity]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: quantity,
    percentage: Math.round((quantity / totalWaste) * 100)
  }));

  // Waste trend over time (last 30 days)
  const generateWasteTrend = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayWaste = wasteEntries
        .filter(entry => new Date(entry.timestamp).toDateString() === date.toDateString())
        .reduce((sum, entry) => sum + entry.quantity, 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        waste: dayWaste,
        cumulative: days.reduce((sum, day) => sum + day.waste, 0) + dayWaste
      });
    }
    
    return days;
  };

  const trendData = generateWasteTrend();

  // Bin status distribution
  const binStatusData = [
    { name: 'Normal', value: bins.filter(bin => bin.status === 'normal').length, color: '#10b981' },
    { name: 'Warning', value: bins.filter(bin => bin.status === 'warning').length, color: '#f59e0b' },
    { name: 'Full', value: bins.filter(bin => bin.status === 'full').length, color: '#ef4444' },
    { name: 'Pickup Requested', value: bins.filter(bin => bin.status === 'pickup_requested').length, color: '#8b5cf6' }
  ];

  // Performance metrics
  const performanceData = [
    { metric: 'Waste Disposal', value: 95, target: 100 },
    { metric: 'Pickup Efficiency', value: Math.round((completedPickups / (completedPickups + pendingPickups)) * 100) || 0, target: 90 },
    { metric: 'Staff Training', value: 85, target: 85 },
    { metric: 'Bin Utilization', value: Math.round((bins.reduce((sum, bin) => sum + bin.currentLevel, 0) / bins.reduce((sum, bin) => sum + bin.capacity, 0)) * 100) || 0, target: 80 }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Processed</CardTitle>
            <Recycle className="h-4 w-4 text-healthcare-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWaste.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Across {wasteEntries.length} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-healthcare-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Staff members disposing waste
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pickup Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-healthcare-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((completedPickups / (completedPickups + pendingPickups)) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedPickups}/{completedPickups + pendingPickups} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Award className="h-4 w-4 text-healthcare-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Overall facility rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Distribution by Type</CardTitle>
            <CardDescription>
              Breakdown of waste categories processed
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
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg`, 'Quantity']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No waste data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bin Status Distribution</CardTitle>
            <CardDescription>
              Current status of waste bins across facility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={binStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {binStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Volume Trend</CardTitle>
            <CardDescription>
              Daily waste disposal over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="waste" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators vs targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Summary</CardTitle>
          <CardDescription>
            Overall facility compliance status and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-600">
                {bins.filter(bin => bin.status === 'normal').length}
              </div>
              <div className="text-sm text-green-700 font-medium">Bins Operating Normally</div>
              <div className="text-xs text-green-600 mt-1">Within safe capacity limits</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-yellow-600">
                {bins.filter(bin => bin.status === 'warning' || bin.status === 'full').length}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Bins Requiring Attention</div>
              <div className="text-xs text-yellow-600 mt-1">Above normal capacity</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-blue-700 font-medium">Overall Compliance</div>
              <div className="text-xs text-blue-600 mt-1">Meeting regulatory standards</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Regulatory Recommendations:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="font-medium text-blue-600">•</span>
                <span>Continue regular monitoring of bin capacity levels to prevent overflow incidents</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium text-blue-600">•</span>
                <span>Maintain high staff training scores through regular educational programs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium text-blue-600">•</span>
                <span>Implement proactive pickup scheduling to minimize pending requests</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium text-blue-600">•</span>
                <span>Document all disposal activities with photographic evidence for audit trails</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalSummary;
