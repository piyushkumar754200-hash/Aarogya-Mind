import { Patient, Ambulance } from './types';
import React from 'react';

export const GRID_SIZE = 100; // 100x100km grid
export const USER_LOCATION = { x: 50, y: 50 }; // User is in the center

export const MOCK_PATIENTS: Record<string, Patient> = {
  'ABHA1234': {
    abhaId: 'ABHA1234',
    name: 'Piyush Kumar',
    age: 24,
    gender: 'Male',
    bloodGroup: 'O+',
    emergencyContact: '+91 98765 43210',
    allergies: ['Penicillin'],
    chronicConditions: ['None'],
    vitals: {
      heartRate: '72 bpm',
      bloodPressure: '120/80',
      weight: '70 kg',
      height: '175 cm',
      lastCheckup: '15 Oct 2023'
    },
    records: [
      {
        id: 'REC-001',
        type: 'Diagnosis',
        date: '2023-10-15',
        doctor: 'Dr. Sharma',
        hospital: 'City General Hospital',
        summary: 'Viral Fever - Prescribed Antipyretics',
        status: 'Info'
      },
      {
        id: 'REC-002',
        type: 'Lab Report',
        date: '2023-10-15',
        doctor: 'Lab Technician',
        hospital: 'City General Hospital',
        summary: 'CBC - Platelet count normal',
        status: 'Normal'
      },
      {
        id: 'REC-003',
        type: 'Prescription',
        date: '2023-08-01',
        doctor: 'Dr. Gupta',
        hospital: 'Apollo Clinic',
        summary: 'Multivitamins and Calcium supplements',
        status: 'Info'
      }
    ]
  },
  'ABHA5678': {
    abhaId: 'ABHA5678',
    name: 'Abhishek Kumar Gupta',
    age: 28,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '+91 99999 88888',
    allergies: ['Peanuts', 'Dust'],
    chronicConditions: ['Asthma'],
    vitals: {
      heartRate: '88 bpm',
      bloodPressure: '135/90',
      weight: '82 kg',
      height: '180 cm',
      lastCheckup: '20 Nov 2023'
    },
    records: [
      {
        id: 'REC-101',
        type: 'Diagnosis',
        date: '2023-11-20',
        doctor: 'Dr. Reddy',
        hospital: 'Max Healthcare',
        summary: 'Acute Asthma Attack - Nebulization administered',
        status: 'Critical'
      },
      {
        id: 'REC-102',
        type: 'Prescription',
        date: '2023-11-20',
        doctor: 'Dr. Reddy',
        hospital: 'Max Healthcare',
        summary: 'Inhaler refill (Salbutamol)',
        status: 'Attention'
      }
    ]
  }
};

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: 'AMB-01', driverName: 'Ramesh Singh', plateNumber: 'RJ-14-GA-1234', location: { x: 10, y: 10 }, status: 'Available', type: 'BLS' },
  { id: 'AMB-02', driverName: 'Suresh Patel', plateNumber: 'RJ-14-GA-5678', location: { x: 45, y: 55 }, status: 'Available', type: 'ALS' },
  { id: 'AMB-03', driverName: 'Mahesh Verma', plateNumber: 'RJ-14-GA-9012', location: { x: 80, y: 20 }, status: 'Available', type: 'BLS' },
  { id: 'AMB-04', driverName: 'Dinesh Kumar', plateNumber: 'RJ-14-GA-3456', location: { x: 60, y: 80 }, status: 'Busy', type: 'ALS' },
  { id: 'AMB-05', driverName: 'Rajesh Koothrappali', plateNumber: 'RJ-14-GA-7890', location: { x: 48, y: 52 }, status: 'Available', type: 'ALS' }, // Very close
];
