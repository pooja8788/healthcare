
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Recycle, Award, Calendar } from 'lucide-react';

const WasteSummary = () => {
  const { wasteEntries } = useSupabaseWasteStore();
  const { user } = useSupabaseAuthStore();

  const userEntries = wasteEntries.filter(entry => entry.staffId === user?.id);

  // Calculate waste statistics
  const wasteByType = userEntries.reduce((acc, entry) => {
    acc[entry.wasteType] = (acc[entry.wasteType] || 0) + entry.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalWaste = Object.values(wasteByType).reduce((sum, value) => sum + value, 0);

  const chartData = Object.entries(wasteByType).map(([type, quantity]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: quantity,
    percentage: Math.round((quantity / totalWaste) * 100)
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Recent entries for timeline
  const recentEntries = userEntries
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waste Disposed</CardTitle>
            <Recycle className="h-4 w-4 text-healthcare-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWaste.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Across {userEntries.length} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-healthcare-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(wasteByType).length}</div>
            <p className="text-xs text-muted-foreground">
              Different waste types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Award className="h-4 w-4 text-healthcare-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent waste entries
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste Distribution</CardTitle>
            <CardDescription>
              Breakdown of waste types you've disposed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No waste disposal data yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest waste disposal entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={entry.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {entry.wasteType.charAt(0).toUpperCase() + entry.wasteType.slice(1)} Waste
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.quantity} {entry.unit} • {entry.location}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteSummary;
