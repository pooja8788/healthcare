
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { Calendar, Camera, FileText, MapPin } from 'lucide-react';

const DisposalLog = () => {
  const { pickupRequests } = useSupabaseWasteStore();

  const completedPickups = pickupRequests
    .filter(req => req.status === 'completed')
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="space-y-4">
      {completedPickups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No completed disposals recorded yet</p>
        </div>
      ) : (
        completedPickups.map((pickup) => (
          <Card key={pickup.id} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {pickup.wasteType.charAt(0).toUpperCase() + pickup.wasteType.slice(1)} Waste Disposal
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{pickup.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{pickup.completedAt ? new Date(pickup.completedAt).toLocaleString() : 'N/A'}</span>
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Handler Information</h4>
                    <p className="text-sm text-gray-600">
                      Processed by: {pickup.handlerName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Request ID: {pickup.id}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {pickup.disposalPhotos?.length || 0} disposal photos uploaded
                      </span>
                    </div>
                  </div>
                </div>

                {pickup.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Disposal Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {pickup.notes}
                    </p>
                  </div>
                )}

                {pickup.disposalPhotos && pickup.disposalPhotos.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Disposal Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {pickup.disposalPhotos.map((photo, index) => (
                        <div 
                          key={index}
                          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                        >
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 truncate">
                            {photo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 border-t pt-2">
                  <p>Original request time: {new Date(pickup.requestedAt).toLocaleString()}</p>
                  <p>Processing duration: {
                    pickup.completedAt 
                      ? Math.round((new Date(pickup.completedAt).getTime() - new Date(pickup.requestedAt).getTime()) / (1000 * 60))
                      : 'N/A'
                  } minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default DisposalLog;
