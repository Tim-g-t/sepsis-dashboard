
import React from 'react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/risk';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  
  const levelClasses = {
    high: "bg-critical-light/20 text-critical-dark border border-critical/30",
    medium: "bg-warning-light/20 text-warning-dark border border-warning/30",
    low: "bg-success-light/20 text-success-dark border border-success/30"
  };
  
  const levelLabels = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk"
  };
  
  return (
    <span className={cn(baseClasses, levelClasses[level], className)}>
      {levelLabels[level]}
    </span>
  );
};

export default RiskBadge;
