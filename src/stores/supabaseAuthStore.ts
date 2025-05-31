
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SupabaseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useSupabaseAuthStore = create<SupabaseAuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User authenticated:', data.user);
        
        // Fetch user profile from our profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          return false;
        }

        console.log('Profile fetched:', profile);

        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as any,
          facility: profile.facility
        };

        set({ user, isAuthenticated: true });
        console.log('Login successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      console.log('Logging out user...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('User logged out successfully');
      set({ user: null, isAuthenticated: false });
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  },

  initialize: async () => {
    try {
      console.log('Initializing auth...');
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      if (session?.user) {
        console.log('Session found, fetching profile...');
        
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profile) {
          console.log('Profile loaded:', profile);
          
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as any,
            facility: profile.facility
          };

          set({ user, isAuthenticated: true });
        } else {
          console.error('Profile not found:', profileError);
        }
      } else {
        console.log('No active session found');
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, fetching profile...');
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as any,
            facility: profile.facility
          };
          set({ user, isAuthenticated: true });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        set({ user: null, isAuthenticated: false });
      }
    });
  }
}));
