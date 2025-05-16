
import React from 'react';
import { VitalSign } from '@/types/risk';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface VitalSignsListProps {
  vitals: VitalSign[];
}

const VitalSignsList: React.FC<VitalSignsListProps> = ({ vitals }) => {
  
  const getVitalStatus = (vital: VitalSign): 'normal' | 'warning' | 'critical' => {
    // Check if value is outside normal range
    if (vital.value < vital.normalRange.min || vital.value > vital.normalRange.max) {
      // Check if value is in critical range
      if (vital.criticalRange) {
        if ((vital.criticalRange.min !== undefined && vital.value < vital.criticalRange.min) ||
            (vital.criticalRange.max !== undefined && vital.value > vital.criticalRange.max)) {
          return 'critical';
        }
      }
      return 'warning';
    }
    return 'normal';
  };
  
  const getTrendIcon = (trend: 'stable' | 'increasing' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return <ArrowUp className="h-3 w-3" />;
      case 'decreasing':
        return <ArrowDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };
  
  const getProgressValue = (vital: VitalSign): number => {
    // Calculate where the current value falls within the range
    const min = Math.min(vital.normalRange.min * 0.5, vital.criticalRange?.min || vital.normalRange.min * 0.5);
    const max = Math.max(vital.normalRange.max * 1.5, vital.criticalRange?.max || vital.normalRange.max * 1.5);
    const range = max - min;
    
    return ((vital.value - min) / range) * 100;
  };
  
  const sortedVitals = [...vitals].sort((a, b) => {
    // Sort critical first, then warning, then normal
    const statusA = getVitalStatus(a);
    const statusB = getVitalStatus(b);
    
    if (statusA === 'critical' && statusB !== 'critical') return -1;
    if (statusA !== 'critical' && statusB === 'critical') return 1;
    if (statusA === 'warning' && statusB === 'normal') return -1;
    if (statusA === 'normal' && statusB === 'warning') return 1;
    
    return 0;
  });
  
  return (
    <div className="relative overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vital Sign</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Normal Range</TableHead>
            <TableHead>Trend</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVitals.map(vital => {
            const status = getVitalStatus(vital);
            const progressValue = getProgressValue(vital);
            const trendIcon = getTrendIcon(vital.trend);
            
            return (
              <TableRow key={vital.id}>
                <TableCell className="font-medium">{vital.name}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${
                    status === 'critical' ? 'text-critical' : 
                    status === 'warning' ? 'text-warning' : ''
                  }`}>
                    {vital.value} {vital.unit}
                  </span>
                </TableCell>
                <TableCell>{vital.normalRange.min} - {vital.normalRange.max} {vital.unit}</TableCell>
                <TableCell>
                  <div className={`flex items-center ${
                    vital.trend === 'increasing' ? 'text-warning' : 
                    vital.trend === 'decreasing' ? 'text-success' : ''
                  }`}>
                    {trendIcon}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={progressValue}
                      className="h-2"
                      // Apply different colors based on status
                      data-status={status}
                    />
                    <span className={`text-xs ${
                      status === 'critical' ? 'text-critical' : 
                      status === 'warning' ? 'text-warning' : 
                      'text-success'
                    }`}>
                      {status === 'critical' ? 'Critical' : 
                       status === 'warning' ? 'Abnormal' : 'Normal'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VitalSignsList;
