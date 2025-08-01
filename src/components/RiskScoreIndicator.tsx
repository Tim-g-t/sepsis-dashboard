
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
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg'
  };
  
  const levelStyles = {
    high: {
      gradient: 'bg-gradient-to-br from-red-500 to-red-600',
      shadow: 'shadow-lg shadow-red-500/30',
      ring: 'ring-2 ring-red-200 dark:ring-red-800',
      text: 'text-white font-bold'
    },
    medium: {
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
      shadow: 'shadow-lg shadow-amber-500/30',
      ring: 'ring-2 ring-amber-200 dark:ring-amber-800',
      text: 'text-white font-bold'
    },
    low: {
      gradient: 'bg-gradient-to-br from-emerald-500 to-green-500',
      shadow: 'shadow-lg shadow-emerald-500/30',
      ring: 'ring-2 ring-emerald-200 dark:ring-emerald-800',
      text: 'text-white font-bold'
    }
  };
  
  const animationClass = animate ? `risk-indicator risk-${riskLevel}` : '';
  const currentStyle = levelStyles[riskLevel];
  
  return (
    <div className={cn(
      "flex flex-col items-center gap-2",
      className
    )}>
      <div className={cn(
        sizeClasses[size],
        currentStyle.gradient,
        currentStyle.shadow,
        currentStyle.ring,
        currentStyle.text,
        "rounded-full flex items-center justify-center",
        "transform transition-all duration-300 hover:scale-110",
        animationClass
      )}>
        {showValue && (
          <div className="flex flex-col items-center">
            <span className="font-bold">{score}</span>
            {size === 'lg' && (
              <span className="text-xs opacity-90">RISK</span>
            )}
          </div>
        )}
      </div>
      
      {size === 'lg' && (
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sepsis Risk Score
          </div>
          <div className={`text-sm font-bold mt-1 ${
            riskLevel === 'high' ? 'text-red-600 dark:text-red-400' :
            riskLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' :
            'text-emerald-600 dark:text-emerald-400'
          }`}>
            {riskLevel.toUpperCase()} RISK
          </div>
        </div>
      )}
      
      {size === 'md' && (
        <div className={`text-xs font-semibold ${
          riskLevel === 'high' ? 'text-red-600 dark:text-red-400' :
          riskLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' :
          'text-emerald-600 dark:text-emerald-400'
        }`}>
          {riskLevel.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default RiskScoreIndicator;
