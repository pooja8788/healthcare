
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { WasteEntry, Bin, PickupRequest } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SupabaseWasteState {
  wasteEntries: WasteEntry[];
  bins: Bin[];
  pickupRequests: PickupRequest[];
  activityLogs: any[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBins: () => Promise<void>;
  fetchPickupRequests: () => Promise<void>;
  fetchWasteEntries: () => Promise<void>;
  fetchActivityLogs: () => Promise<void>;
  addWasteEntry: (entry: Omit<WasteEntry, 'id' | 'timestamp'>) => Promise<void>;
  updateBinLevel: (binId: string, addedQuantity: number) => Promise<void>;
  createPickupRequest: (binId: string) => Promise<void>;
  completePickupRequest: (requestId: string, handlerId: string, handlerName: string, photos: string[], notes?: string) => Promise<void>;
  logActivity: (action: string, entityType: string, entityId?: string, details?: any) => Promise<void>;
  
  // Real-time subscriptions
  subscribeToRealTimeUpdates: () => void;
  unsubscribeFromRealTimeUpdates: () => void;
}

let realtimeChannel: any = null;

export const useSupabaseWasteStore = create<SupabaseWasteState>((set, get) => ({
  wasteEntries: [],
  bins: [],
  pickupRequests: [],
  activityLogs: [],
  loading: false,
  error: null,

  fetchBins: async () => {
    try {
      console.log('Fetching bins from database...');
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bins:', error);
        throw error;
      }

      console.log('Raw bins data:', data);

      const formattedBins: Bin[] = (data || []).map(bin => ({
        id: bin.id,
        location: bin.location,
        wasteType: bin.waste_type,
        capacity: bin.capacity,
        currentLevel: bin.current_level,
        status: bin.status as any,
        lastUpdated: new Date(bin.last_updated),
        threshold: bin.threshold
      }));

      console.log('Formatted bins:', formattedBins);
      set({ bins: formattedBins, loading: false });
    } catch (error) {
      console.error('Error in fetchBins:', error);
      set({ error: 'Failed to fetch bins', loading: false, bins: [] });
      toast({
        title: 'Error',
        description: 'Failed to load bins. Please refresh the page.',
        variant: 'destructive',
      });
    }
  },

  fetchPickupRequests: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('pickup_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: PickupRequest[] = (data || []).map(req => ({
        id: req.id,
        binId: req.bin_id,
        location: req.location,
        wasteType: req.waste_type,
        requestedAt: new Date(req.requested_at),
        status: req.status as any,
        handlerId: req.handler_id,
        handlerName: req.handler_name,
        completedAt: req.completed_at ? new Date(req.completed_at) : undefined,
        disposalPhotos: req.disposal_photos,
        notes: req.notes
      }));

      set({ pickupRequests: formattedRequests, loading: false });
    } catch (error) {
      console.error('Error fetching pickup requests:', error);
      set({ error: 'Failed to fetch pickup requests', loading: false, pickupRequests: [] });
    }
  },

  fetchWasteEntries: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('waste_entries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const formattedEntries: WasteEntry[] = (data || []).map(entry => ({
        id: entry.id,
        staffId: entry.staff_id,
        staffName: entry.staff_name,
        wasteType: entry.waste_type as any,
        quantity: parseFloat(entry.quantity.toString()),
        unit: entry.unit as any,
        binId: entry.bin_id,
        location: entry.location,
        timestamp: new Date(entry.timestamp),
        description: entry.description
      }));

      set({ wasteEntries: formattedEntries, loading: false });
    } catch (error) {
      console.error('Error fetching waste entries:', error);
      set({ error: 'Failed to fetch waste entries', loading: false, wasteEntries: [] });
    }
  },

  fetchActivityLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      set({ activityLogs: data || [] });
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      set({ activityLogs: [] });
    }
  },

  addWasteEntry: async (entry) => {
    try {
      console.log('Adding waste entry:', entry);
      set({ loading: true });
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated');
      }

      console.log('Authenticated user:', user.user);

      // Insert waste entry
      const { data: wasteData, error: wasteError } = await supabase
        .from('waste_entries')
        .insert({
          staff_id: user.user.id,
          staff_name: entry.staffName,
          waste_type: entry.wasteType,
          quantity: entry.quantity,
          unit: entry.unit,
          bin_id: entry.binId,
          location: entry.location,
          description: entry.description
        })
        .select()
        .single();

      if (wasteError) {
        console.error('Error inserting waste entry:', wasteError);
        throw wasteError;
      }

      console.log('Waste entry inserted successfully:', wasteData);

      // Update bin level
      console.log('Updating bin level...');
      await get().updateBinLevel(entry.binId, entry.quantity);
      
      // Log activity
      console.log('Logging activity...');
      await get().logActivity('waste_added', 'waste_entry', entry.binId, {
        wasteType: entry.wasteType,
        quantity: entry.quantity,
        unit: entry.unit,
        location: entry.location
      });

      // Refresh data
      console.log('Refreshing data...');
      await Promise.all([
        get().fetchWasteEntries(),
        get().fetchBins(),
        get().fetchPickupRequests()
      ]);
      
      set({ loading: false });
      
      toast({
        title: 'Waste Entry Added',
        description: 'Waste entry has been successfully recorded.',
      });
    } catch (error) {
      console.error('Error adding waste entry:', error);
      set({ loading: false });
      toast({
        title: 'Error',
        description: 'Failed to add waste entry. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  updateBinLevel: async (binId, addedQuantity) => {
    try {
      console.log(`Updating bin ${binId} with quantity ${addedQuantity}`);
      
      // Get current bin data
      const { data: bin, error: fetchError } = await supabase
        .from('bins')
        .select('*')
        .eq('id', binId)
        .single();

      if (fetchError) {
        console.error('Error fetching bin:', fetchError);
        throw fetchError;
      }

      console.log('Current bin data:', bin);

      const newLevel = Math.min(bin.current_level + addedQuantity, bin.capacity);
      let newStatus = bin.status;

      // Update status based on levels
      if (newLevel >= bin.capacity) {
        newStatus = 'full';
      } else if (newLevel >= bin.threshold) {
        newStatus = 'warning';
      } else {
        newStatus = 'normal';
      }

      console.log(`Updating bin: new level = ${newLevel}, new status = ${newStatus}`);

      // Update bin
      const { error: updateError } = await supabase
        .from('bins')
        .update({
          current_level: newLevel,
          status: newStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', binId);

      if (updateError) {
        console.error('Error updating bin:', updateError);
        throw updateError;
      }

      console.log('Bin updated successfully');

      // Auto-create pickup request if bin reaches threshold and not already requested
      if (newLevel >= bin.threshold && bin.status !== 'pickup_requested' && newStatus !== 'pickup_requested') {
        console.log('Creating pickup request for bin at threshold');
        await get().createPickupRequest(binId);
      }
    } catch (error) {
      console.error('Error updating bin level:', error);
      throw error;
    }
  },

  createPickupRequest: async (binId) => {
    try {
      console.log('Creating pickup request for bin:', binId);
      
      const { data: bin, error: binError } = await supabase
        .from('bins')
        .select('*')
        .eq('id', binId)
        .single();

      if (binError) throw binError;

      // Check if pickup request already exists
      const { data: existingRequest } = await supabase
        .from('pickup_requests')
        .select('id')
        .eq('bin_id', binId)
        .eq('status', 'pending')
        .single();

      if (existingRequest) {
        console.log('Pickup request already exists for this bin');
        return;
      }

      const { error } = await supabase
        .from('pickup_requests')
        .insert({
          bin_id: binId,
          location: bin.location,
          waste_type: bin.waste_type,
          status: 'pending'
        });

      if (error) throw error;

      // Update bin status
      await supabase
        .from('bins')
        .update({ status: 'pickup_requested' })
        .eq('id', binId);

      // Log activity
      await get().logActivity('pickup_requested', 'pickup_request', binId, {
        location: bin.location,
        wasteType: bin.waste_type
      });

      // Refresh data
      await get().fetchPickupRequests();
      await get().fetchBins();

      toast({
        title: 'Pickup Request Created',
        description: `Pickup request created for ${bin.location}`,
      });
    } catch (error) {
      console.error('Error creating pickup request:', error);
    }
  },

  completePickupRequest: async (requestId, handlerId, handlerName, photos, notes) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Update pickup request
      const { error: requestError } = await supabase
        .from('pickup_requests')
        .update({
          status: 'completed',
          handler_id: handlerId,
          handler_name: handlerName,
          completed_at: new Date().toISOString(),
          disposal_photos: photos,
          notes: notes
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Get request data to find bin
      const { data: request, error: fetchError } = await supabase
        .from('pickup_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError) throw fetchError;

      // Reset bin level and status
      await supabase
        .from('bins')
        .update({
          current_level: 0,
          status: 'normal',
          last_updated: new Date().toISOString()
        })
        .eq('id', request.bin_id);

      // Log activity
      await get().logActivity('pickup_completed', 'pickup_request', requestId, {
        location: request.location,
        wasteType: request.waste_type,
        handlerName,
        photosCount: photos.length,
        notes
      });

      // Refresh data
      await Promise.all([
        get().fetchPickupRequests(),
        get().fetchBins(),
        get().fetchActivityLogs()
      ]);

      toast({
        title: 'Pickup Completed',
        description: 'Waste pickup has been successfully processed and logged.',
      });
    } catch (error) {
      console.error('Error completing pickup request:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete pickup request.',
        variant: 'destructive',
      });
    }
  },

  logActivity: async (action, entityType, entityId, details) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase.rpc('log_activity', {
        p_user_id: user.user?.id || null,
        p_user_name: user.user?.email || 'System',
        p_action: action,
        p_entity_type: entityType,
        p_entity_id: entityId || null,
        p_details: details || null
      });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  },

  subscribeToRealTimeUpdates: () => {
    if (realtimeChannel) return;

    realtimeChannel = supabase
      .channel('waste-management-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bins' 
      }, () => {
        get().fetchBins();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'pickup_requests' 
      }, () => {
        get().fetchPickupRequests();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'waste_entries' 
      }, () => {
        get().fetchWasteEntries();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activity_logs' 
      }, () => {
        get().fetchActivityLogs();
      })
      .subscribe();

    console.log('Subscribed to real-time updates');
  },

  unsubscribeFromRealTimeUpdates: () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
      console.log('Unsubscribed from real-time updates');
    }
  }
}));
