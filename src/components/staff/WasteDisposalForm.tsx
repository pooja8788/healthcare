
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseWasteStore } from '@/stores/supabaseWasteStore';
import { useSupabaseAuthStore } from '@/stores/supabaseAuthStore';
import { toast } from '@/hooks/use-toast';

const WasteDisposalForm = () => {
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    unit: '',
    binId: '',
    location: '',
    description: ''
  });

  const { addWasteEntry, bins, fetchBins, loading } = useSupabaseWasteStore();
  const { user } = useSupabaseAuthStore();

  // Fetch bins when component mounts
  useEffect(() => {
    console.log('Component mounted, fetching bins...');
    fetchBins();
  }, [fetchBins]);

  useEffect(() => {
    console.log('Bins updated:', bins);
  }, [bins]);

  const wasteTypes = [
    { value: 'infectious', label: 'Infectious Waste' },
    { value: 'pathological', label: 'Pathological Waste' },
    { value: 'pharmaceutical', label: 'Pharmaceutical Waste' },
    { value: 'sharps', label: 'Sharps' },
    { value: 'chemotherapy', label: 'Chemotherapy Waste' }
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'liters', label: 'Liters (L)' },
    { value: 'pieces', label: 'Pieces' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    console.log('Current user:', user);
    
    if (!user) {
      console.error('No user found');
      toast({
        title: 'Authentication Required',
        description: 'Please log in to record waste disposal.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.wasteType || !formData.quantity || !formData.unit || !formData.binId) {
      console.error('Missing required fields:', {
        wasteType: formData.wasteType,
        quantity: formData.quantity,
        unit: formData.unit,
        binId: formData.binId
      });
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a valid quantity greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Calling addWasteEntry...');
      await addWasteEntry({
        staffId: user.id,
        staffName: user.name,
        wasteType: formData.wasteType as any,
        quantity: quantity,
        unit: formData.unit as any,
        binId: formData.binId,
        location: formData.location,
        description: formData.description || undefined
      });

      console.log('Waste entry added successfully');
      
      // Reset form
      setFormData({
        wasteType: '',
        quantity: '',
        unit: '',
        binId: '',
        location: '',
        description: ''
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error toast is already shown in the store
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBinSelection = (value: string) => {
    console.log('Bin selected:', value);
    const selectedBin = bins.find(bin => bin.id === value);
    console.log('Selected bin details:', selectedBin);
    handleInputChange('binId', value);
    if (selectedBin) {
      handleInputChange('location', selectedBin.location);
    }
  };

  // Filter bins by waste type if selected
  const availableBins = formData.wasteType 
    ? bins.filter(bin => 
        bin.wasteType === formData.wasteType && 
        bin.status !== 'full' &&
        bin.currentLevel < bin.capacity
      )
    : bins.filter(bin => 
        bin.status !== 'full' &&
        bin.currentLevel < bin.capacity
      );

  console.log('Available bins for waste type:', formData.wasteType, availableBins);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wasteType">Waste Type *</Label>
            <Select value={formData.wasteType} onValueChange={(value) => {
              handleInputChange('wasteType', value);
              // Reset bin selection when waste type changes
              handleInputChange('binId', '');
              handleInputChange('location', '');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                {wasteTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="binId">Bin Location *</Label>
            <Select 
              value={formData.binId} 
              onValueChange={handleBinSelection}
              disabled={!formData.wasteType || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.wasteType 
                    ? "Select waste type first" 
                    : availableBins.length === 0 
                      ? "No available bins for this waste type"
                      : "Select bin"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableBins.map((bin) => (
                  <SelectItem key={bin.id} value={bin.id}>
                    {bin.location} - {bin.wasteType} ({bin.currentLevel}/{bin.capacity} {bin.unit || 'kg'}) - {bin.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.wasteType && availableBins.length === 0 && (
              <p className="text-sm text-red-600">
                No available bins for {formData.wasteType} waste type. All bins may be full or at capacity.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Additional Notes</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Any additional information about the waste disposal..."
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-healthcare-blue hover:bg-healthcare-blue/90"
          disabled={!formData.wasteType || !formData.quantity || !formData.unit || !formData.binId || loading}
        >
          {loading ? 'Recording...' : 'Record Waste Disposal'}
        </Button>
      </form>
    </div>
  );
};

export default WasteDisposalForm;
