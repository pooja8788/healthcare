
import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'staff@hospital.com',
    role: 'staff',
    facility: 'General Hospital'
  },
  {
    id: '2',
    name: 'Mike Wilson',
    email: 'handler@hospital.com',
    role: 'waste_handler',
    facility: 'General Hospital'
  },
  {
    id: '3',
    name: 'Lisa Chen',
    email: 'regulator@hospital.com',
    role: 'regulator',
    facility: 'General Hospital'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));
