
import React from 'react';
import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/risk';

interface RiskScoreIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

const RiskScoreIndicator: React.FC<RiskScoreIndicatorProps> = ({
  score,
  size = 'md',
  showValue = true,
  animate = true,
  className
}) => {
  const getRiskLevel = (score: number): RiskLevel => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };
  
  const riskLevel = getRiskLevel(score);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base'
  };
  
  const levelColors = {
    high: 'bg-critical text-white',
    medium: 'bg-warning text-white',
    low: 'bg-success text-white'
  };
  
  const animationClass = animate ? `risk-indicator risk-${riskLevel}` : '';
  
  return (
    <div className={cn(
      "flex flex-col items-center gap-1",
      className
    )}>
      <div className={cn(
        sizeClasses[size],
        levelColors[riskLevel],
        "rounded-full flex items-center justify-center font-bold",
        animationClass
      )}>
        {showValue && score}
      </div>
      {size === 'lg' && (
        <span className="text-xs text-muted-foreground mt-1">
          Risk Score
        </span>
      )}
    </div>
  );
};

export default RiskScoreIndicator;
