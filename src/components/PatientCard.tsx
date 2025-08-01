
import React from 'react';
import { Card } from '@/components/ui/card';
import { Patient } from '@/types/risk';
import RiskBadge from './RiskBadge';
import RiskScoreIndicator from './RiskScoreIndicator';
import RiskChart from './RiskChart';
import { formatDistanceToNow } from 'date-fns';
import { Activity, AlertCircle, Thermometer, Heart, User, Bed } from 'lucide-react';

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
  const mediumSepsisRisk = patient.sepsisRisk >= 40 && patient.sepsisRisk < 70;

  const getCardClassName = () => {
    let baseClass = "medical-card relative overflow-hidden transition-all cursor-pointer hover:shadow-xl transform hover:scale-[1.02] duration-300";
    
    if (highSepsisRisk) {
      return `${baseClass} medical-card-critical border-l-4 border-l-red-500`;
    } else if (mediumSepsisRisk) {
      return `${baseClass} medical-card-warning border-l-4 border-l-amber-500`;
    } else {
      return `${baseClass} medical-card-success border-l-4 border-l-emerald-500`;
    }
  };

  return (
    <Card className={getCardClassName()} onClick={onClick}>
      {/* Critical Alert Banner */}
      {(highSepsisRisk || criticalVitals.length > 0) && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          CRITICAL
        </div>
      )}

      <div className="p-5">
        {/* Patient Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2 text-slate-500" />
              <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">
                {patient.name}
              </h3>
            </div>
            
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-1">
              <span className="font-medium">{patient.age}y</span>
              <span className="mx-2">•</span>
              <span>{patient.gender}</span>
              <span className="mx-2">•</span>
              <Bed className="h-3 w-3 mr-1" />
              <span>Room {patient.room}/Bed {patient.bed}</span>
            </div>
            
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md truncate">
              {patient.diagnosis}
            </div>
          </div>
          
          <div className="flex flex-col items-end ml-4">
            <div className="text-xs text-slate-500 mb-2 font-medium">Sepsis Risk</div>
            <RiskScoreIndicator score={patient.sepsisRisk} size="md" />
          </div>
        </div>
        
        {/* Vital Signs Section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Key Vitals
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {patient.vitalSigns.slice(0, 3).map(vital => {
              const isCritical = criticalVitals.includes(vital);
              return (
                <div key={vital.id} className={`p-2 rounded-lg ${
                  isCritical 
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                    : 'bg-slate-50 dark:bg-slate-700'
                }`}>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                    {vital.name}
                  </div>
                  <div className={`text-sm font-bold ${
                    isCritical 
                      ? 'text-red-600 dark:text-red-400 vital-critical' 
                      : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {vital.value} {vital.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Sepsis Indicators */}
        {patient.sepsisIndicators.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sepsis Indicators
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.sepsisIndicators.slice(0, 3).map((indicator, index) => (
                <div 
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full font-medium border ${
                    indicator.critical 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  }`}
                >
                  {indicator.name}
                </div>
              ))}
              {patient.sepsisIndicators.length > 3 && (
                <div className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                  +{patient.sepsisIndicators.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Risk Trend Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                24h Risk Trend
              </span>
            </div>
          </div>
          <div className="chart-container p-2">
            <RiskChart 
              data={patient.historicalData} 
              riskLevel={patient.sepsisRisk >= 70 ? 'high' : patient.sepsisRisk >= 40 ? 'medium' : 'low'}
              height={60}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-600">
          <div className="flex items-center">
            {highSepsisRisk ? (
              <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <AlertCircle className="h-3 w-3 mr-1" />
                HIGH RISK
              </div>
            ) : mediumSepsisRisk ? (
              <div className="flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Thermometer className="h-3 w-3 mr-1" />
                MEDIUM RISK
              </div>
            ) : (
              <div className="flex items-center bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Heart className="h-3 w-3 mr-1" />
                LOW RISK
              </div>
            )}
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
            <div className="status-dot-success mr-1"></div>
            Updated {formatDistanceToNow(new Date(patient.lastUpdated), { addSuffix: true })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientCard;
