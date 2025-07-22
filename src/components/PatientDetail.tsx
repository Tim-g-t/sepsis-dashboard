
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient, SepsisIndicator } from '@/types/risk';
import RiskScoreIndicator from './RiskScoreIndicator';
import RiskChart from './RiskChart';
import RiskFactorList from './RiskFactorList';
import VitalSignsList from './VitalSignsList';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  ArrowLeft, 
  Clock, 
  Activity, 
  User,
  Heart,
  AlertCircle,
  CalendarClock,
  Thermometer,
  Syringe,
  FileText,
  Hospital,
  Bed
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onClose }) => {
  // Find critical vitals
  const criticalVitals = patient.vitalSigns.filter(vital => {
    if (!vital.criticalRange) return false;
    if (vital.criticalRange.min !== undefined && vital.value < vital.criticalRange.min) return true;
    if (vital.criticalRange.max !== undefined && vital.value > vital.criticalRange.max) return true;
    return false;
  });

  const SepsisIndicatorsList = ({ indicators }: { indicators: SepsisIndicator[] }) => (
    <div className="space-y-4">
      {indicators.map((indicator, index) => (
        <div key={index} className="border rounded-md p-3">
          <div className="flex justify-between items-start">
            <div className="font-medium text-sm">{indicator.name}</div>
            <div className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              indicator.critical 
                ? "bg-critical-light/20 text-critical-dark border border-critical/30" 
                : "bg-success-light/20 text-success-dark border border-success/30"
            )}>
              {typeof indicator.value === 'boolean' 
                ? (indicator.value ? 'Positive' : 'Negative')
                : indicator.value}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{indicator.description}</div>
        </div>
      ))}
    </div>
  );

  const MedicationsList = () => (
    <div className="space-y-2">
      {patient.medications.map(med => (
        <div key={med.id} className="border rounded-md p-3">
          <div className="font-medium text-sm">{med.name}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
            <div className="text-xs text-muted-foreground">Dosage:</div>
            <div className="text-xs">{med.dosage}</div>
            <div className="text-xs text-muted-foreground">Route:</div>
            <div className="text-xs">{med.route}</div>
            <div className="text-xs text-muted-foreground">Frequency:</div>
            <div className="text-xs">{med.frequency}</div>
            <div className="text-xs text-muted-foreground">Started:</div>
            <div className="text-xs">{format(new Date(med.startDate), 'MMM d, yyyy')}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProceduresList = () => (
    <div className="space-y-2">
      {patient.procedures.map(procedure => (
        <div key={procedure.id} className="border rounded-md p-3">
          <div className="flex justify-between">
            <div className="font-medium text-sm">{procedure.name}</div>
            <div className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              procedure.status === 'completed' 
                ? "bg-success-light/20 text-success-dark border border-success/30"
                : procedure.status === 'in-progress'
                  ? "bg-warning-light/20 text-warning-dark border border-warning/30"
                  : "bg-muted/20 text-muted-foreground border border-muted/30"
            )}>
              {procedure.status.charAt(0).toUpperCase() + procedure.status.slice(1)}
            </div>
          </div>
          <div className="text-xs mt-1">{format(new Date(procedure.date), 'MMM d, yyyy')}</div>
          {procedure.notes && (
            <div className="text-xs text-muted-foreground mt-1">{procedure.notes}</div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Compact patient info bar */}
        <div className="bg-muted/30 rounded-lg p-3 border">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Patient demographics and diagnosis */}
            <div className="flex-1">
              <div className="flex items-center gap-6 text-sm">
                <div className="font-medium">{patient.diagnosis}</div>
                <div className="text-muted-foreground">Dr. {patient.attendingPhysician}</div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{patient.age}y {patient.gender}</span>
                <span>•</span>
                <span>Rm {patient.room}/Bed {patient.bed}</span>
                <span>•</span>
                <span>Admitted {format(new Date(patient.admissionDate), 'MMM dd')}</span>
                <span>•</span>
                <span className="text-xs">Updated {formatDistanceToNow(new Date(patient.lastUpdated), { addSuffix: true })}</span>
              </div>
            </div>
            
            {/* Right: Risk score and alerts */}
            <div className="flex items-center gap-3">
              {criticalVitals.length > 0 && (
                <div className="flex items-center text-critical text-sm">
                  <Thermometer className="h-4 w-4 mr-1" />
                  <span className="font-medium">{criticalVitals.length} Critical</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-muted-foreground">Sepsis Risk</div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mt-1",
                    patient.sepsisRisk >= 70 ? "bg-critical text-white" :
                    patient.sepsisRisk >= 40 ? "bg-warning text-white" :
                    "bg-success text-white"
                  )}>
                    {patient.sepsisRisk}
                  </div>
                </div>
                {patient.sepsisRisk >= 70 && (
                  <AlertCircle className="h-5 w-5 text-critical" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Card>
          <Tabs defaultValue="sepsis">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Patient Monitoring</CardTitle>
                  <CardDescription>
                    Sepsis risk assessment and vital signs
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="sepsis">Sepsis Analysis</TabsTrigger>
                  <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                  <TabsTrigger value="meds">Medications</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="sepsis" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                    Sepsis Risk Indicators
                  </h3>
                  <SepsisIndicatorsList indicators={patient.sepsisIndicators} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                    Contributing Risk Factors
                  </h3>
                  <RiskFactorList factors={patient.riskFactors.filter(f => 
                    ['infection_risk', 'hemodynamic_instability', 'organ_failure'].includes(f.id)
                  )} />
                </div>
              </TabsContent>
              
              <TabsContent value="vitals" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-muted-foreground" />
                    Current Vital Signs
                  </h3>
                  <VitalSignsList vitals={patient.vitalSigns} />
                </div>
              </TabsContent>
              
              <TabsContent value="meds" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Syringe className="h-4 w-4 mr-1 text-muted-foreground" />
                    Current Medications
                  </h3>
                  <MedicationsList />
                </div>
              </TabsContent>
              
              <TabsContent value="procedures" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                    Procedures
                  </h3>
                  <ProceduresList />
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <CalendarClock className="h-4 w-4 mr-1 text-muted-foreground" />
                    Sepsis Risk Trend (24 Hours)
                  </h3>
                  <RiskChart 
                    data={patient.historicalData} 
                    riskLevel={patient.riskLevel} 
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Risk Factors</h3>
                  <RiskFactorList 
                    factors={patient.riskFactors.slice(0, 3)} 
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetail;
