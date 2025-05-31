
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { Clock, MapPin, Trash2, CheckCircle, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PickupRequests = () => {
  const { pickupRequests, completePickupRequest, fetchPickupRequests } = useSupabaseWasteStore();
  const { user } = useSupabaseAuthStore();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [photoCount, setPhotoCount] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPickupRequests();
  }, [fetchPickupRequests]);

  const handleCompletePickup = async (requestId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to complete pickup requests.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate photo uploads
      const mockPhotos = Array.from({ length: photoCount }, (_, i) => 
        `disposal-photo-${requestId}-${i + 1}.jpg`
      );

      await completePickupRequest(requestId, user.id, user.name, mockPhotos, notes);

      setSelectedRequest(null);
      setNotes('');
      setPhotoCount(1);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error completing pickup:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const sortedRequests = pickupRequests.sort((a, b) => {
    // Pending requests first, then by request time
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedRequests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No pickup requests at this time</p>
        </div>
      ) : (
        sortedRequests.map((request) => (
          <Card key={request.id} className={`border-l-4 ${
            request.status === 'pending' ? 'border-l-red-500' : 
            request.status === 'completed' ? 'border-l-green-500' : 
            'border-l-yellow-500'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {request.wasteType.charAt(0).toUpperCase() + request.wasteType.slice(1)} Waste Collection
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(request.requestedAt).toLocaleString()}</span>
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(request.status)}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  {request.status === 'completed' && (
                    <div className="text-sm text-gray-600">
                      <p>Completed by: {request.handlerName}</p>
                      <p>Completed at: {request.completedAt ? new Date(request.completedAt).toLocaleString() : 'N/A'}</p>
                      {request.disposalPhotos && (
                        <p>Photos uploaded: {request.disposalPhotos.length}</p>
                      )}
                      {request.notes && (
                        <p>Notes: {request.notes}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {request.status === 'pending' && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-healthcare-blue hover:bg-healthcare-blue/90"
                        onClick={() => setSelectedRequest(request.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Process Pickup
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Complete Waste Pickup</DialogTitle>
                        <DialogDescription>
                          Record waste separation and disposal details for {request.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="photos">Number of Disposal Photos</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPhotoCount(Math.max(1, photoCount - 1))}
                              disabled={photoCount <= 1}
                            >
                              -
                            </Button>
                            <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                              {photoCount}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPhotoCount(Math.min(10, photoCount + 1))}
                              disabled={photoCount >= 10}
                            >
                              +
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Simulate taking {photoCount} photo{photoCount !== 1 ? 's' : ''} of waste disposal
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Disposal Notes</Label>
                          <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter any additional notes about the waste separation and disposal process..."
                            rows={3}
                          />
                        </div>

                        <Button
                          onClick={() => selectedRequest && handleCompletePickup(selectedRequest)}
                          className="w-full bg-healthcare-green hover:bg-healthcare-green/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Pickup
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PickupRequests;
