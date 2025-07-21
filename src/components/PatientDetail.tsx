
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
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-muted-foreground">
            {patient.diagnosis} • Attending: {patient.attendingPhysician}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {patient.sepsisRisk >= 70 && (
            <div className="flex items-center bg-critical/10 text-critical border border-critical/30 px-3 py-1 rounded-full">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">High Sepsis Risk</span>
            </div>
          )}
          {criticalVitals.length > 0 && (
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-critical mr-1" />
              <span className="text-critical font-medium">Critical Vitals</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Sepsis Risk</div>
                <RiskScoreIndicator 
                  score={patient.sepsisRisk} 
                  size="md" 
                  showValue={true} 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Age</div>
                <div className="font-medium">{patient.age} years</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Gender</div>
                <div className="font-medium">{patient.gender}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">Room {patient.room}, Bed {patient.bed}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Admitted</div>
                <div className="font-medium">{format(new Date(patient.admissionDate), 'MMM dd, yyyy')}</div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Updated {formatDistanceToNow(new Date(patient.lastUpdated), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        </Card>
        
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
