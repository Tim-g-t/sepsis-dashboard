
import React from 'react';
import { Card } from '@/components/ui/card';
import { Entity } from '@/types/risk';
import RiskBadge from './RiskBadge';
import RiskScoreIndicator from './RiskScoreIndicator';
import RiskChart from './RiskChart';
import { formatDistanceToNow } from 'date-fns';

interface EntityCardProps {
  entity: Entity;
  onClick?: () => void;
}

const EntityCard: React.FC<EntityCardProps> = ({ entity, onClick }) => {
  return (
    <Card 
      className="relative overflow-hidden transition-all cursor-pointer hover:shadow-md"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-base">{entity.name}</h3>
            <div className="text-xs text-muted-foreground">
              {entity.role} • {entity.department}
            </div>
          </div>
          <RiskScoreIndicator score={entity.currentRiskScore} size="sm" />
        </div>
        
        <div className="mt-2 mb-4">
          <RiskChart 
            data={entity.historicalData} 
            riskLevel={entity.riskLevel} 
          />
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <RiskBadge level={entity.riskLevel} />
          <div className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(entity.lastUpdated), { addSuffix: true })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EntityCard;
