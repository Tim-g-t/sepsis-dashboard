
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Entity } from '@/types/risk';
import RiskScoreIndicator from './RiskScoreIndicator';
import RiskChart from './RiskChart';
import RiskFactorList from './RiskFactorList';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Clock, Info, Settings } from 'lucide-react';

interface EntityDetailProps {
  entity: Entity;
  onClose: () => void;
}

const EntityDetail: React.FC<EntityDetailProps> = ({ entity, onClose }) => {
  return (
    <div className="h-full space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{entity.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <RiskScoreIndicator 
                score={entity.currentRiskScore} 
                size="lg" 
                showValue={true} 
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="font-medium">{entity.department}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">{entity.role}</div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Updated {formatDistanceToNow(new Date(entity.lastUpdated), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <Tabs defaultValue="overview">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Risk Analysis</CardTitle>
                  <CardDescription>
                    Detailed risk assessment and historical trends
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Risk Score Trend (24 Hours)</h3>
                  <RiskChart 
                    data={entity.historicalData} 
                    riskLevel={entity.riskLevel} 
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Risk Factors</h3>
                  <RiskFactorList 
                    factors={entity.riskFactors.slice(0, 3)} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="factors">
                <div>
                  <h3 className="text-sm font-medium mb-4">All Risk Factors</h3>
                  <RiskFactorList factors={entity.riskFactors} />
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <Settings className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-sm font-medium">Risk Assessment Settings</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Configure alerts, thresholds, and monitoring parameters
                    </p>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default EntityDetail;
