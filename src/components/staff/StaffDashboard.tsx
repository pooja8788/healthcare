
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, GraduationCap, BarChart3, Trash2 } from 'lucide-react';
import WasteDisposalForm from './WasteDisposalForm';
import EducationQuiz from './EducationQuiz';
import WasteSummary from './WasteSummary';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('disposal');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Medical Staff Portal</h1>
        <p className="text-gray-600">Manage waste disposal and enhance your environmental awareness</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disposal" className="flex items-center space-x-2">
            <Trash2 className="h-4 w-4" />
            <span>Waste Disposal</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Education Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>My Summary</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="disposal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-healthcare-blue" />
                <span>Waste Disposal Form</span>
              </CardTitle>
              <CardDescription>
                Record details of waste disposed in facility bins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WasteDisposalForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-healthcare-green" />
                <span>Environmental Awareness Quiz</span>
              </CardTitle>
              <CardDescription>
                Test your knowledge of proper waste management procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EducationQuiz />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <WasteSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;
