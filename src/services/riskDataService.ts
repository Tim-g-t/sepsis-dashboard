
import { Patient, RiskLevel, RiskFactor, HistoricalData, DepartmentRisk, VitalSign, Medication, Procedure, SepsisIndicator } from '../types/risk';

// Mock data for our patients
const mockPatientNames = [
  'John Smith', 'Emma Johnson', 'Michael Williams', 'Sophia Brown', 'James Jones',
  'Olivia Davis', 'Robert Miller', 'Ava Wilson', 'William Moore', 'Isabella Taylor',
  'David Anderson', 'Mia Thomas'
];

const diagnoses = [
  'Acute Respiratory Distress', 'Post-Surgical Infection', 'Pneumonia', 
  'Urinary Tract Infection', 'Cellulitis', 'Post-Surgical Monitoring', 
  'Multiple Trauma', 'Stroke', 'Diabetic Ketoacidosis', 'Acute Renal Failure'
];

const physicians = [
  'Dr. Roberts', 'Dr. Chen', 'Dr. Patel', 'Dr. Nguyen', 'Dr. Garcia', 
  'Dr. Williams', 'Dr. Johnson', 'Dr. Lee', 'Dr. Smith', 'Dr. Kim'
];

const ICUUnits = ['Medical ICU', 'Surgical ICU', 'Cardiac ICU', 'Neuro ICU'];

const vitalSignTemplates: Omit<VitalSign, 'value' | 'trend' | 'lastUpdated'>[] = [
  {
    id: 'heart_rate',
    name: 'Heart Rate',
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    criticalRange: { min: 40, max: 130 }
  },
  {
    id: 'blood_pressure_systolic',
    name: 'Blood Pressure (Systolic)',
    unit: 'mmHg',
    normalRange: { min: 90, max: 120 },
    criticalRange: { min: 70, max: 160 }
  },
  {
    id: 'blood_pressure_diastolic',
    name: 'Blood Pressure (Diastolic)',
    unit: 'mmHg',
    normalRange: { min: 60, max: 80 },
    criticalRange: { min: 40, max: 100 }
  },
  {
    id: 'respiratory_rate',
    name: 'Respiratory Rate',
    unit: 'bpm',
    normalRange: { min: 12, max: 20 },
    criticalRange: { min: 8, max: 30 }
  },
  {
    id: 'oxygen_saturation',
    name: 'Oxygen Saturation',
    unit: '%',
    normalRange: { min: 95, max: 100 },
    criticalRange: { min: 90 }
  },
  {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    normalRange: { min: 36.5, max: 37.5 },
    criticalRange: { min: 35, max: 39 }
  },
  {
    id: 'gcs',
    name: 'Glasgow Coma Scale',
    unit: '',
    normalRange: { min: 15, max: 15 },
    criticalRange: { min: 8 }
  },
  {
    id: 'wbc_count',
    name: 'WBC Count',
    unit: 'x10⁹/L',
    normalRange: { min: 4, max: 11 },
    criticalRange: { min: 2, max: 20 }
  },
  {
    id: 'lactate',
    name: 'Lactate',
    unit: 'mmol/L',
    normalRange: { min: 0.5, max: 2.0 },
    criticalRange: { max: 4.0 }
  }
];

const riskFactorTemplates: Omit<RiskFactor, 'score'>[] = [
  {
    id: 'hemodynamic_instability',
    name: 'Hemodynamic Instability',
    weight: 0.25,
    description: 'Abnormal blood pressure, heart rate, or cardiac output'
  },
  {
    id: 'respiratory_failure',
    name: 'Respiratory Compromise',
    weight: 0.2,
    description: 'Decreased oxygen levels or increased respiratory effort'
  },
  {
    id: 'infection_risk',
    name: 'Infection Risk',
    weight: 0.25,
    description: 'Elevated infection markers or signs of sepsis'
  },
  {
    id: 'neurological_status',
    name: 'Neurological Status',
    weight: 0.15,
    description: 'Changes in consciousness, GCS, or pupillary response'
  },
  {
    id: 'organ_failure',
    name: 'Organ Failure',
    weight: 0.1,
    description: 'Signs of compromised organ function'
  },
  {
    id: 'medication_response',
    name: 'Medication Response',
    weight: 0.05,
    description: 'Response to current medication protocols'
  }
];

const medicationTemplates = [
  {
    name: 'Vancomycin',
    dosage: ['500mg', '1g', '1.5g'],
    frequency: ['Q8H', 'Q12H', 'Q24H'],
    route: 'IV'
  },
  {
    name: 'Piperacillin/Tazobactam',
    dosage: ['3.375g', '4.5g'],
    frequency: ['Q6H', 'Q8H'],
    route: 'IV'
  },
  {
    name: 'Ceftriaxone',
    dosage: ['1g', '2g'],
    frequency: ['Q12H', 'Q24H'],
    route: 'IV'
  },
  {
    name: 'Norepinephrine',
    dosage: ['0.1-0.5 mcg/kg/min', '0.5-1 mcg/kg/min'],
    frequency: ['Continuous'],
    route: 'IV'
  },
  {
    name: 'Propofol',
    dosage: ['25-75 mcg/kg/min'],
    frequency: ['Continuous'],
    route: 'IV'
  },
  {
    name: 'Fentanyl',
    dosage: ['25-100 mcg/hr'],
    frequency: ['Continuous'],
    route: 'IV'
  },
  {
    name: 'Insulin',
    dosage: ['Variable'],
    frequency: ['Continuous', 'Sliding Scale'],
    route: 'IV'
  }
];

const procedureTemplates = [
  'Central Line Placement',
  'Endotracheal Intubation',
  'Mechanical Ventilation',
  'Arterial Line Placement',
  'Bronchoscopy',
  'Paracentesis',
  'Thoracentesis',
  'Lumbar Puncture',
  'Hemodialysis',
  'ECMO Initiation'
];

const sepsisIndicatorTemplates = [
  {
    name: 'Fever > 38.3°C',
    description: 'Elevated body temperature indicating infection'
  },
  {
    name: 'Hypothermia < 36°C',
    description: 'Low body temperature can indicate severe infection'
  },
  {
    name: 'Tachycardia > 90 bpm',
    description: 'Elevated heart rate is a common response to infection'
  },
  {
    name: 'Tachypnea > 20 breaths/min',
    description: 'Increased respiratory rate can be due to sepsis'
  },
  {
    name: 'Altered Mental Status',
    description: 'Changes in consciousness can indicate sepsis'
  },
  {
    name: 'Hyperglycemia > 140 mg/dL',
    description: 'Elevated blood glucose without diabetes'
  },
  {
    name: 'Leukocytosis > 12,000/μL',
    description: 'Elevated white blood cell count'
  },
  {
    name: 'Leukopenia < 4,000/μL',
    description: 'Decreased white blood cell count'
  },
  {
    name: 'Hypotension < 90 mmHg',
    description: 'Low blood pressure can indicate septic shock'
  },
  {
    name: 'Lactate > 2 mmol/L',
    description: 'Elevated lactate is associated with tissue hypoperfusion'
  },
  {
    name: 'Oliguria < 0.5 mL/kg/hr',
    description: 'Decreased urine output can indicate kidney injury'
  },
  {
    name: 'Thrombocytopenia < 100,000/μL',
    description: 'Low platelet count can be due to sepsis'
  },
  {
    name: 'Coagulopathy',
    description: 'Abnormal blood clotting is common in sepsis'
  }
];

// Helper functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getTrendFromValues(current: number, previous: number): 'stable' | 'increasing' | 'decreasing' {
  const difference = current - previous;
  if (Math.abs(difference) < 0.05 * previous) return 'stable';
  return difference > 0 ? 'increasing' : 'decreasing';
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate initial mock patients
function generateMockPatients(): Patient[] {
  return mockPatientNames.map((name, index) => {
    // Generate random vital signs
    const vitalSigns = vitalSignTemplates.map(template => {
      const value = getRandomArbitrary(
        template.normalRange.min * 0.7,
        template.normalRange.max * 1.2
      );
      
      return {
        ...template,
        value: Math.round(value * 10) / 10, // Round to 1 decimal place
        trend: Math.random() > 0.5 ? 'stable' : (Math.random() > 0.5 ? 'increasing' : 'decreasing') as 'stable' | 'increasing' | 'decreasing',
        lastUpdated: Date.now() - getRandomInt(0, 15) * 60000 // 0-15 minutes ago
      };
    });
    
    // Generate random risk factors
    const riskFactors = riskFactorTemplates.map(template => ({
      ...template,
      score: getRandomInt(10, 100)
    }));
    
    // Calculate the weighted risk score
    const weightedSum = riskFactors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);
    const totalWeight = riskFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const riskScore = Math.round(weightedSum / totalWeight);
    
    // Generate a sepsis risk score - for some patients make it higher than general risk
    const sepsisRisk = Math.random() < 0.3 
      ? Math.min(100, riskScore + getRandomInt(15, 30)) 
      : Math.max(0, riskScore + getRandomInt(-15, 15));
    
    // Generate random medications (1-4 medications per patient)
    const medications: Medication[] = [];
    const medCount = getRandomInt(1, 4);
    const now = Date.now();
    
    for (let i = 0; i < medCount; i++) {
      const medTemplate = getRandomItem(medicationTemplates);
      
      medications.push({
        id: `med-${index}-${i}`,
        name: medTemplate.name,
        dosage: getRandomItem(medTemplate.dosage),
        frequency: getRandomItem(medTemplate.frequency),
        route: medTemplate.route,
        startDate: now - getRandomInt(1, 7) * 86400000 // 1-7 days ago
      });
    }
    
    // Generate random procedures (0-3 procedures per patient)
    const procedures: Procedure[] = [];
    const procCount = getRandomInt(0, 3);
    
    for (let i = 0; i < procCount; i++) {
      const procName = getRandomItem(procedureTemplates);
      const procDate = now - getRandomInt(0, 10) * 86400000; // 0-10 days ago
      const procStatus = Math.random() < 0.7 ? 'completed' : (Math.random() < 0.5 ? 'in-progress' : 'scheduled');
      
      procedures.push({
        id: `proc-${index}-${i}`,
        name: procName,
        date: procDate,
        status: procStatus as 'completed' | 'in-progress' | 'scheduled',
        notes: Math.random() < 0.5 ? `Notes for ${procName}` : undefined
      });
    }
    
    // Generate sepsis indicators (more likely to be present and critical if sepsis risk is high)
    const sepsisIndicators: SepsisIndicator[] = [];
    const indicatorCount = getRandomInt(3, 7);
    const shuffledIndicators = [...sepsisIndicatorTemplates].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < indicatorCount; i++) {
      const template = shuffledIndicators[i];
      const isCritical = sepsisRisk >= 70 ? Math.random() < 0.7 : Math.random() < 0.2;
      
      sepsisIndicators.push({
        name: template.name,
        value: Math.random() < 0.8 ? true : false,
        description: template.description,
        critical: isCritical
      });
    }
    
    // Generate historical data (last 24 hours, hourly)
    const historicalData: HistoricalData[] = [];
    for (let i = 24; i >= 0; i--) {
      historicalData.push({
        timestamp: now - (i * 3600000), // i hours ago
        score: getRandomInt(Math.max(sepsisRisk - 20, 0), Math.min(sepsisRisk + 20, 100))
      });
    }
    
    const age = getRandomInt(18, 90);
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const roomNumber = getRandomInt(1, 20);
    const admissionDate = now - getRandomInt(1, 14) * 86400000; // 1-14 days ago
    
    return {
      id: `patient-${index + 1}`,
      name,
      age,
      gender,
      room: `${Math.floor(roomNumber / 4) + 1}${String.fromCharCode(65 + (roomNumber % 4))}`,
      bed: `${getRandomInt(1, 4)}`,
      admissionDate,
      diagnosis: diagnoses[getRandomInt(0, diagnoses.length - 1)],
      attendingPhysician: physicians[getRandomInt(0, physicians.length - 1)],
      currentRiskScore: riskScore,
      riskLevel: getRiskLevel(riskScore),
      sepsisRisk,
      riskFactors,
      vitalSigns,
      medications,
      procedures,
      sepsisIndicators,
      historicalData,
      lastUpdated: now
    };
  });
}

// Calculate department risk metrics
function calculateDepartmentRisks(patients: Patient[]): DepartmentRisk[] {
  const departmentMap = new Map<string, {
    totalScore: number;
    count: number;
    highRiskCount: number;
  }>();
  
  // Randomly assign patients to ICU departments
  const patientDepartments = patients.map(patient => {
    return {
      patient,
      department: ICUUnits[getRandomInt(0, ICUUnits.length - 1)]
    };
  });
  
  patientDepartments.forEach(({ patient, department }) => {
    const current = departmentMap.get(department) || { totalScore: 0, count: 0, highRiskCount: 0 };
    
    departmentMap.set(department, {
      totalScore: current.totalScore + patient.sepsisRisk,
      count: current.count + 1,
      highRiskCount: current.highRiskCount + (patient.sepsisRisk >= 70 ? 1 : 0)
    });
  });
  
  return Array.from(departmentMap.entries()).map(([department, data]) => ({
    department,
    averageRiskScore: Math.round(data.totalScore / data.count),
    patientsCount: data.count,
    highRiskCount: data.highRiskCount
  }));
}

// Initial data generation
let mockPatients = generateMockPatients();
let departmentRisks = calculateDepartmentRisks(mockPatients);

// Simulate changes to vital signs and risk factors
function updatePatientData(patient: Patient): Patient {
  // Update vital signs
  const updatedVitals = patient.vitalSigns.map(vital => {
    // 40% chance of changing a vital sign
    if (Math.random() < 0.4) {
      const previousValue = vital.value;
      const maxChange = vital.normalRange.max * 0.05; // 5% of max normal value
      const direction = Math.random() < 0.5 ? 1 : -1;
      const change = getRandomArbitrary(0, maxChange) * direction;
      const newValue = Math.round((previousValue + change) * 10) / 10;
      
      return {
        ...vital,
        value: newValue,
        trend: getTrendFromValues(newValue, previousValue),
        lastUpdated: Date.now()
      };
    }
    return vital;
  });
  
  // Update risk factors based on new vital signs
  const updatedFactors = patient.riskFactors.map(factor => {
    // 30% chance of changing a factor score
    if (Math.random() < 0.3) {
      const direction = Math.random() < 0.5 ? 1 : -1;
      const change = getRandomInt(1, 5) * direction;
      return {
        ...factor,
        score: Math.max(0, Math.min(100, factor.score + change))
      };
    }
    return factor;
  });
  
  // Recalculate the weighted risk score
  const weightedSum = updatedFactors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);
  const totalWeight = updatedFactors.reduce((sum, factor) => sum + factor.weight, 0);
  const newRiskScore = Math.round(weightedSum / totalWeight);
  
  // Update sepsis indicators (occasionally)
  const updatedSepsisIndicators = patient.sepsisIndicators.map(indicator => {
    if (Math.random() < 0.2) {
      return {
        ...indicator,
        critical: Math.random() < 0.5
      };
    }
    return indicator;
  });
  
  // Update sepsis risk based on factors and indicators
  let newSepsisRisk = patient.sepsisRisk;
  
  // Sepsis risk is influenced by infection risk factor
  const infectionRiskFactor = updatedFactors.find(f => f.id === 'infection_risk');
  if (infectionRiskFactor) {
    const infectionRiskChange = infectionRiskFactor.score - patient.riskFactors.find(f => f.id === 'infection_risk')!.score;
    newSepsisRisk += infectionRiskChange * 0.5;
  }
  
  // Sepsis risk is influenced by the number of critical indicators
  const criticalIndicatorsCount = updatedSepsisIndicators.filter(i => i.critical).length;
  const previousCriticalCount = patient.sepsisIndicators.filter(i => i.critical).length;
  newSepsisRisk += (criticalIndicatorsCount - previousCriticalCount) * 5;
  
  // Ensure sepsis risk stays within 0-100
  newSepsisRisk = Math.max(0, Math.min(100, newSepsisRisk));
  
  // Add the new score to historical data
  const now = Date.now();
  const updatedHistoricalData = [...patient.historicalData, { timestamp: now, score: newSepsisRisk }];
  
  // Limit historical data to the most recent 25 points
  if (updatedHistoricalData.length > 25) {
    updatedHistoricalData.shift();
  }
  
  return {
    ...patient,
    currentRiskScore: newRiskScore,
    riskLevel: getRiskLevel(newRiskScore),
    sepsisRisk: newSepsisRisk,
    riskFactors: updatedFactors,
    vitalSigns: updatedVitals,
    sepsisIndicators: updatedSepsisIndicators,
    historicalData: updatedHistoricalData,
    lastUpdated: now
  };
}

// Main service functions
export const RiskDataService = {
  getPatients: (): Patient[] => {
    return [...mockPatients];
  },
  
  getDepartmentRisks: (): DepartmentRisk[] => {
    return [...departmentRisks];
  },
  
  getPatient: (id: string): Patient | undefined => {
    return mockPatients.find(patient => patient.id === id);
  },
  
  // Function to simulate real-time updates
  simulateDataUpdate: () => {
    // Update random patients (50% chance per patient)
    mockPatients = mockPatients.map(patient => {
      if (Math.random() < 0.5) {
        return updatePatientData(patient);
      }
      return patient;
    });
    
    // Recalculate department risks
    departmentRisks = calculateDepartmentRisks(mockPatients);
    
    // Return the updated data
    return {
      patients: [...mockPatients],
      departmentRisks: [...departmentRisks]
    };
  }
};

export default RiskDataService;
