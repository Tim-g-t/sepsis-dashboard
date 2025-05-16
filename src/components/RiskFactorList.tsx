
import React from 'react';
import { RiskFactor } from '@/types/risk';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RiskFactorListProps {
  factors: RiskFactor[];
}

const RiskFactorList: React.FC<RiskFactorListProps> = ({ factors }) => {
  // Sort factors by weight (highest first)
  const sortedFactors = [...factors].sort((a, b) => b.weight - a.weight);
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-critical';
    if (score >= 40) return 'bg-warning';
    return 'bg-success';
  };
  
  return (
    <div className="space-y-4">
      {sortedFactors.map(factor => (
        <div key={factor.id} className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="font-medium text-sm">{factor.name}</div>
            <div className="text-sm font-semibold">{factor.score}</div>
          </div>
          <Progress 
            value={factor.score} 
            className={cn("h-2", `[&>div]:${getScoreColor(factor.score)}`)}
          />
          <div className="text-xs text-muted-foreground">{factor.description}</div>
        </div>
      ))}
    </div>
  );
};

export default RiskFactorList;
