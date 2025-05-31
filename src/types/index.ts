
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'waste_handler' | 'regulator';
  facility: string;
}

export interface WasteEntry {
  id: string;
  staffId: string;
  staffName: string;
  wasteType: 'infectious' | 'pathological' | 'pharmaceutical' | 'sharps' | 'chemotherapy';
  quantity: number;
  unit: 'kg' | 'liters' | 'pieces';
  binId: string;
  location: string;
  timestamp: Date;
  description?: string;
}

export interface Bin {
  id: string;
  location: string;
  wasteType: string;
  capacity: number;
  currentLevel: number;
  status: 'normal' | 'warning' | 'full' | 'pickup_requested';
  lastUpdated: Date;
  threshold: number;
}

export interface PickupRequest {
  id: string;
  binId: string;
  location: string;
  wasteType: string;
  requestedAt: Date;
  status: 'pending' | 'in_progress' | 'completed';
  handlerId?: string;
  handlerName?: string;
  completedAt?: Date;
  disposalPhotos?: string[];
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  staffId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  answers: number[];
}

export interface DailyReport {
  id: string;
  date: Date;
  totalWaste: number;
  wasteByType: Record<string, number>;
  completedPickups: number;
  pendingPickups: number;
  complianceScore: number;
  generatedAt: Date;
}
