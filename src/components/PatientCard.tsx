
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
      <div className="p-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{patient.name}</h3>
            <div className="text-xs text-muted-foreground">
              {patient.age}y • {patient.gender} • Room {patient.room}, Bed {patient.bed}
            </div>
            <div className="text-xs font-medium mt-1 text-muted-foreground truncate">
              {patient.diagnosis}
            </div>
          </div>
          <div className="flex flex-col items-end ml-2">
            <div className="text-xs text-muted-foreground mb-1">Risk</div>
            <RiskScoreIndicator score={patient.sepsisRisk} size="sm" />
          </div>
        </div>
        
        <div className="mt-2 mb-2">
          <div className="grid grid-cols-3 gap-2">
            {/* Display key vital signs */}
            {patient.vitalSigns.slice(0, 3).map(vital => (
              <div key={vital.id} className="text-center">
                <div className="text-xs text-muted-foreground truncate">{vital.name}</div>
                <div className={`text-xs font-semibold ${
                  criticalVitals.includes(vital) ? 'text-critical' : ''
                }`}>
                  {vital.value} {vital.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {patient.sepsisIndicators.length > 0 && (
          <div className="mt-2 mb-2">
            <div className="text-xs font-medium mb-1">Key Indicators:</div>
            <div className="flex flex-wrap gap-1">
              {patient.sepsisIndicators.slice(0, 2).map((indicator, index) => (
                <div 
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded text-center ${
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
        
        <div className="mt-2 mb-1">
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">Risk Trend</div>
            <div className="flex items-center">
              <Activity className="h-3 w-3 mr-1 text-muted-foreground" />
            </div>
          </div>
          <RiskChart 
            data={patient.historicalData} 
            riskLevel={patient.sepsisRisk >= 70 ? 'high' : patient.sepsisRisk >= 40 ? 'medium' : 'low'}
            height={60}
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {highSepsisRisk ? (
            <div className="flex items-center bg-critical/10 text-critical border border-critical/30 px-1 py-0.5 rounded text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              High Risk
            </div>
          ) : (
            <RiskBadge level={patient.riskLevel} />
          )}
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(patient.lastUpdated), { addSuffix: true })}
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
