
import React from 'react';
import { Card } from '@/components/ui/card';
import { Patient } from '@/types/risk';
import RiskBadge from './RiskBadge';
import RiskScoreIndicator from './RiskScoreIndicator';
import RiskChart from './RiskChart';
import { formatDistanceToNow } from 'date-fns';
import { Activity, AlertCircle, Thermometer } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  // Find critical vitals
  const criticalVitals = patient.vitalSigns.filter(vital => {
    if (!vital.criticalRange) return false;
    if (vital.criticalRange.min !== undefined && vital.value < vital.criticalRange.min) return true;
    if (vital.criticalRange.max !== undefined && vital.value > vital.criticalRange.max) return true;
    return false;
  });

  // Count critical sepsis indicators
  const criticalSepsisIndicators = patient.sepsisIndicators.filter(indicator => indicator.critical).length;
  const highSepsisRisk = patient.sepsisRisk >= 70;

  return (
    <Card 
      className={`relative overflow-hidden transition-all cursor-pointer hover:shadow-md ${
        highSepsisRisk ? 'border-critical/50' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-base">{patient.name}</h3>
            <div className="text-xs text-muted-foreground">
              {patient.age} years • {patient.gender} • Room {patient.room}, Bed {patient.bed}
            </div>
            <div className="text-xs font-medium mt-1 text-muted-foreground">
              {patient.diagnosis}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-muted-foreground mb-1">Sepsis Risk</div>
            <RiskScoreIndicator score={patient.sepsisRisk} size="sm" />
          </div>
        </div>
        
        <div className="mt-3 mb-3">
          <div className="flex items-center space-x-4">
            {/* Display key vital signs */}
            {patient.vitalSigns.slice(0, 3).map(vital => (
              <div key={vital.id} className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{vital.name}</div>
                <div className={`text-sm font-semibold ${
                  criticalVitals.includes(vital) ? 'text-critical' : ''
                }`}>
                  {vital.value} {vital.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {patient.sepsisIndicators.length > 0 && (
          <div className="mt-3 mb-3">
            <div className="text-xs font-medium mb-1">Key Sepsis Indicators:</div>
            <div className="flex flex-wrap gap-1">
              {patient.sepsisIndicators.slice(0, 3).map((indicator, index) => (
                <div 
                  key={index}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    indicator.critical 
                      ? 'bg-critical-light/20 text-critical-dark border border-critical/30' 
                      : 'bg-muted/20 text-muted-foreground'
                  }`}
                >
                  {indicator.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 mb-2">
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">Sepsis Risk Trend</div>
            <div className="flex items-center">
              <Activity className="h-3 w-3 mr-1 text-muted-foreground" />
            </div>
          </div>
          <RiskChart 
            data={patient.historicalData} 
            riskLevel={patient.sepsisRisk >= 70 ? 'high' : patient.sepsisRisk >= 40 ? 'medium' : 'low'}
            height={80}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {highSepsisRisk ? (
            <div className="flex items-center bg-critical/10 text-critical border border-critical/30 px-2 py-0.5 rounded-full text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              High Sepsis Risk
            </div>
          ) : (
            <RiskBadge level={patient.riskLevel} />
          )}
          <div className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(patient.lastUpdated), { addSuffix: true })}
          </div>
        </div>
        
        {(highSepsisRisk || criticalVitals.length > 0) && (
          <div className="absolute top-0 right-0 p-1">
            <AlertCircle className="h-5 w-5 text-critical" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PatientCard;
