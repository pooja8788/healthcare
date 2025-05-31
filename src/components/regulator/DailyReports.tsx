
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWasteStore } from '@/stores/wasteStore';
import { Download, Calendar, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DailyReports = () => {
  const { wasteEntries, pickupRequests } = useWasteStore();

  // Generate mock daily reports based on actual data
  const generateDailyReports = () => {
    const reports = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const reportDate = new Date(today);
      reportDate.setDate(today.getDate() - i);
      
      // Calculate metrics for this date
      const dayEntries = wasteEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === reportDate.toDateString();
      });
      
      const dayPickups = pickupRequests.filter(pickup => {
        const pickupDate = new Date(pickup.requestedAt);
        return pickupDate.toDateString() === reportDate.toDateString();
      });
      
      const totalWaste = dayEntries.reduce((sum, entry) => sum + entry.quantity, 0);
      const completedPickups = dayPickups.filter(p => p.status === 'completed').length;
      const pendingPickups = dayPickups.filter(p => p.status === 'pending').length;
      
      // Calculate compliance score based on various factors
      let complianceScore = 100;
      if (pendingPickups > 2) complianceScore -= 20;
      if (totalWaste > 100) complianceScore -= 10;
      complianceScore = Math.max(complianceScore, 60); // Minimum score
      
      reports.push({
        id: `report-${i}`,
        date: reportDate,
        totalWaste,
        wasteByType: dayEntries.reduce((acc, entry) => {
          acc[entry.wasteType] = (acc[entry.wasteType] || 0) + entry.quantity;
          return acc;
        }, {} as Record<string, number>),
        completedPickups,
        pendingPickups,
        complianceScore,
        entriesCount: dayEntries.length,
        generatedAt: new Date()
      });
    }
    
    return reports;
  };

  const dailyReports = generateDailyReports();

  const handleDownloadReport = (reportId: string, date: Date) => {
    toast({
      title: 'Report Downloaded',
      description: `Daily report for ${date.toLocaleDateString()} has been downloaded.`,
    });
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      {dailyReports.map((report, index) => {
        const isToday = report.date.toDateString() === new Date().toDateString();
        const previousReport = dailyReports[index + 1];
        const wasteChange = previousReport 
          ? ((report.totalWaste - previousReport.totalWaste) / (previousReport.totalWaste || 1)) * 100
          : 0;

        return (
          <Card key={report.id} className={`${isToday ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>
                      {report.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    {isToday && <Badge variant="default">Today</Badge>}
                  </CardTitle>
                  <CardDescription>
                    Generated at {report.generatedAt.toLocaleTimeString()}
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">Compliance Score</div>
                    <div className={`text-lg font-bold px-2 py-1 rounded text-white ${getComplianceColor(report.complianceScore)}`}>
                      {report.complianceScore}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {getComplianceStatus(report.complianceScore)}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report.id, report.date)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{report.totalWaste.toFixed(1)}</div>
                    {wasteChange !== 0 && (
                      <div className={`flex items-center text-xs ${wasteChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {wasteChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(wasteChange).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Waste (kg)</div>
                  <div className="text-xs text-gray-500">{report.entriesCount} disposal entries</div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{report.completedPickups}</span>
                  </div>
                  <div className="text-sm text-gray-600">Completed Pickups</div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span>{report.pendingPickups}</span>
                  </div>
                  <div className="text-sm text-gray-600">Pending Pickups</div>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold">{Object.keys(report.wasteByType).length}</div>
                  <div className="text-sm text-gray-600">Waste Categories</div>
                  <div className="text-xs text-gray-500">
                    {Object.entries(report.wasteByType).map(([type, amount]: [string, number]) => (
                      <div key={type}>{type}: {amount.toFixed(1)}kg</div>
                    ))}
                  </div>
                </div>
              </div>

              {report.complianceScore < 90 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Compliance Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {report.pendingPickups > 2 && (
                      <li>• High number of pending pickup requests may indicate resource constraints</li>
                    )}
                    {report.totalWaste > 100 && (
                      <li>• Above-average waste volume detected, review disposal procedures</li>
                    )}
                    {report.complianceScore < 75 && (
                      <li>• Multiple compliance issues require immediate attention</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DailyReports;
