
import React from 'react';
import { Entity } from '@/types/risk';
import EntityCard from './EntityCard';

interface EntitiesListProps {
  entities: Entity[];
  onEntityClick: (entityId: string) => void;
}

const EntitiesList: React.FC<EntitiesListProps> = ({ entities, onEntityClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entities.map(entity => (
        <EntityCard 
          key={entity.id} 
          entity={entity} 
          onClick={() => onEntityClick(entity.id)} 
        />
      ))}
    </div>
  );
};

export default EntitiesList;
