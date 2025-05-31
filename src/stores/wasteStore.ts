
import { create } from 'zustand';
import { WasteEntry, Bin, PickupRequest } from '@/types';

interface WasteState {
  wasteEntries: WasteEntry[];
  bins: Bin[];
  pickupRequests: PickupRequest[];
  addWasteEntry: (entry: Omit<WasteEntry, 'id' | 'timestamp'>) => void;
  updateBinLevel: (binId: string, addedQuantity: number) => void;
  createPickupRequest: (binId: string) => void;
  completePickupRequest: (requestId: string, handlerId: string, handlerName: string, photos: string[], notes?: string) => void;
}

// Mock initial data
const initialBins: Bin[] = [
  {
    id: 'bin-1',
    location: 'Emergency Room',
    wasteType: 'infectious',
    capacity: 50,
    currentLevel: 35,
    status: 'warning',
    lastUpdated: new Date(),
    threshold: 40
  },
  {
    id: 'bin-2',
    location: 'Surgery Department',
    wasteType: 'sharps',
    capacity: 20,
    currentLevel: 8,
    status: 'normal',
    lastUpdated: new Date(),
    threshold: 16
  },
  {
    id: 'bin-3',
    location: 'Oncology Ward',
    wasteType: 'chemotherapy',
    capacity: 30,
    currentLevel: 28,
    status: 'full',
    lastUpdated: new Date(),
    threshold: 24
  }
];

export const useWasteStore = create<WasteState>((set, get) => ({
  wasteEntries: [],
  bins: initialBins,
  pickupRequests: [
    {
      id: 'req-1',
      binId: 'bin-3',
      location: 'Oncology Ward',
      wasteType: 'chemotherapy',
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending'
    }
  ],
  
  addWasteEntry: (entry) => {
    const newEntry: WasteEntry = {
      ...entry,
      id: `waste-${Date.now()}`,
      timestamp: new Date()
    };
    
    set((state) => ({
      wasteEntries: [...state.wasteEntries, newEntry]
    }));
    
    // Update bin level
    get().updateBinLevel(entry.binId, entry.quantity);
  },
  
  updateBinLevel: (binId, addedQuantity) => {
    set((state) => ({
      bins: state.bins.map(bin => {
        if (bin.id === binId) {
          const newLevel = bin.currentLevel + addedQuantity;
          let newStatus = bin.status;
          
          if (newLevel >= bin.capacity) {
            newStatus = 'full';
          } else if (newLevel >= bin.threshold) {
            newStatus = 'warning';
          } else {
            newStatus = 'normal';
          }
          
          // Auto-create pickup request if bin is full
          if (newLevel >= bin.threshold && bin.status !== 'pickup_requested') {
            setTimeout(() => get().createPickupRequest(binId), 100);
          }
          
          return {
            ...bin,
            currentLevel: Math.min(newLevel, bin.capacity),
            status: newStatus,
            lastUpdated: new Date()
          };
        }
        return bin;
      })
    }));
  },
  
  createPickupRequest: (binId) => {
    const bin = get().bins.find(b => b.id === binId);
    if (!bin) return;
    
    const newRequest: PickupRequest = {
      id: `req-${Date.now()}`,
      binId,
      location: bin.location,
      wasteType: bin.wasteType,
      requestedAt: new Date(),
      status: 'pending'
    };
    
    set((state) => ({
      pickupRequests: [...state.pickupRequests, newRequest],
      bins: state.bins.map(b => 
        b.id === binId ? { ...b, status: 'pickup_requested' as const } : b
      )
    }));
  },
  
  completePickupRequest: (requestId, handlerId, handlerName, photos, notes) => {
    set((state) => ({
      pickupRequests: state.pickupRequests.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: 'completed' as const,
              handlerId,
              handlerName,
              completedAt: new Date(),
              disposalPhotos: photos,
              notes
            }
          : req
      ),
      bins: state.bins.map(bin => {
        const request = state.pickupRequests.find(r => r.id === requestId);
        if (request && bin.id === request.binId) {
          return {
            ...bin,
            currentLevel: 0,
            status: 'normal' as const,
            lastUpdated: new Date()
          };
        }
        return bin;
      })
    }));
  }
}));
