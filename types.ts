export interface Coordinate {
  x: number;
  y: number;
}

export interface MedicalRecord {
  id: string;
  type: 'Lab Report' | 'Prescription' | 'Diagnosis' | 'Test Result';
  date: string;
  doctor: string;
  hospital: string;
  summary: string;
  status: 'Normal' | 'Critical' | 'Attention' | 'Info';
}

export interface Vitals {
  heartRate: string;
  bloodPressure: string;
  weight: string;
  height: string;
  lastCheckup: string;
}

export interface Patient {
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  emergencyContact: string;
  allergies: string[];
  chronicConditions: string[];
  records: MedicalRecord[];
  vitals?: Vitals; // New field for dashboard
}

export interface Ambulance {
  id: string;
  driverName: string;
  plateNumber: string;
  location: Coordinate;
  status: 'Available' | 'Busy' | 'Dispatched';
  type: 'ALS' | 'BLS'; // Advanced Life Support / Basic
  eta?: number; // Estimated time in minutes
  distance?: number; // Distance in km units
}

export type ViewState = 'DASHBOARD' | 'RECORDS' | 'EMERGENCY';
