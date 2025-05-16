
export type RiskLevel = 'low' | 'medium' | 'high';

export interface VitalSign {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  criticalRange?: {
    min?: number;
    max?: number;
  };
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdated: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: number;
  endDate?: number;
}

export interface Procedure {
  id: string;
  name: string;
  date: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface HistoricalData {
  timestamp: number;
  score: number;
}

export interface SepsisIndicator {
  name: string;
  value: boolean | number;
  description: string;
  critical: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  room: string;
  bed: string;
  admissionDate: number;
  diagnosis: string;
  attendingPhysician: string;
  currentRiskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  vitalSigns: VitalSign[];
  medications: Medication[];
  procedures: Procedure[];
  sepsisIndicators: SepsisIndicator[];
  sepsisRisk: number; // 0-100 score for sepsis specifically
  historicalData: HistoricalData[];
  lastUpdated: number;
}

export interface DepartmentRisk {
  department: string;
  averageRiskScore: number;
  patientsCount: number;
  highRiskCount: number;
}
