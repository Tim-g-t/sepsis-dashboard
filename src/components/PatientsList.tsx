import React from 'react';
import { Patient } from '@/types/risk';
import PatientCard from './PatientCard';

interface PatientsListProps {
  patients: Patient[];
  onPatientClick: (patientId: string) => void;
  filterHighSepsisRiskOnly?: boolean;
  highRiskThreshold?: number;
}

const PatientsList: React.FC<PatientsListProps> = ({ 
  patients, 
  onPatientClick,
  filterHighSepsisRiskOnly = false,
  highRiskThreshold = 70
}) => {
  const filteredPatients = filterHighSepsisRiskOnly 
    ? patients.filter(patient => patient.sepsisRisk >= highRiskThreshold)
    : patients;

  return (
    <div className="space-y-4">
      {filteredPatients.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No patients matching the current criteria
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <PatientCard 
            key={patient.id} 
            patient={patient} 
            onClick={() => onPatientClick(patient.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default PatientsList;
