import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient, DepartmentRisk } from '@/types/risk';
import PatientsList from './PatientsList';
import DepartmentRisksChart from './DepartmentRisksChart';
import PatientDetail from './PatientDetail';
import RiskDataService from '@/services/riskDataService';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowDown, 
  ArrowUp, 
  ChartBar, 
  Clock, 
  Heart,
  AlertCircle,
  Activity,
  Users,
  Thermometer,
  Hospital,
  Settings,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departmentRisks, setDepartmentRisks] = useState<DepartmentRisk[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [highRiskThreshold, setHighRiskThreshold] = useState<number>(70);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // System metrics
  const [metrics, setMetrics] = useState({
    highSepsisRiskCount: 0,
    avgSepsisRiskScore: 0,
    sepsisRiskTrend: 0
  });
  
  // Load initial data
  useEffect(() => {
    const initialPatients = RiskDataService.getPatients();
    const initialDepartmentRisks = RiskDataService.getDepartmentRisks();
    
    setPatients(initialPatients);
    setDepartmentRisks(initialDepartmentRisks);
    calculateMetrics(initialPatients);
    
    // Set up interval for data updates
    const intervalId = setInterval(() => {
      const updatedData = RiskDataService.simulateDataUpdate();
      setPatients(updatedData.patients);
      setDepartmentRisks(updatedData.departmentRisks);
      calculateMetrics(updatedData.patients, patients);
      setLastUpdated(new Date());
      
      // Show toast for significant sepsis risk changes
      const highSepsisRiskPatients = updatedData.patients.filter(p => p.sepsisRisk >= highRiskThreshold);
      if (highSepsisRiskPatients.length > metrics.highSepsisRiskCount) {
        toast({
          title: "Sepsis Risk Alert",
          description: `Number of high sepsis risk patients increased to ${highSepsisRiskPatients.length}`,
          variant: "destructive"
        });
      }
      
      // Show toast for critical sepsis indicators
      updatedData.patients.forEach(patient => {
        if (patient.sepsisRisk >= highRiskThreshold) {
          const criticalIndicators = patient.sepsisIndicators.filter(i => i.critical);
          
          if (criticalIndicators.length > 0) {
            toast({
              title: `Sepsis Alert: ${patient.name}`,
              description: `${criticalIndicators.length} critical sepsis indicators detected`,
              variant: "destructive"
            });
          }
        }
      });
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate dashboard metrics
  const calculateMetrics = (newPatients: Patient[], previousPatients?: Patient[]) => {
    const highSepsisRiskCount = newPatients.filter(p => p.sepsisRisk >= highRiskThreshold).length;
    const totalScore = newPatients.reduce((sum, p) => sum + p.sepsisRisk, 0);
    const avgSepsisRiskScore = Math.round(totalScore / newPatients.length);
    
    // Calculate trend if we have previous data
    let sepsisRiskTrend = 0;
    if (previousPatients && previousPatients.length > 0) {
      const prevTotalScore = previousPatients.reduce((sum, p) => sum + p.sepsisRisk, 0);
      const prevAvgScore = prevTotalScore / previousPatients.length;
      sepsisRiskTrend = avgSepsisRiskScore - prevAvgScore;
    }
    
    setMetrics({
      highSepsisRiskCount,
      avgSepsisRiskScore,
      sepsisRiskTrend
    });
  };
  
  // Select a patient to view details
  const handlePatientClick = (id: string) => {
    setSelectedPatientId(id);
  };
  
  // Close patient details view
  const handleCloseDetails = () => {
    setSelectedPatientId(null);
  };
  
  // Get the selected patient
  const selectedPatient = selectedPatientId 
    ? patients.find(p => p.id === selectedPatientId)
    : null;
  
  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setHighRiskThreshold(value);
    }
  };
  
  return (
    <div className="h-full flex">
      {/* Main Dashboard - adjusts width when patient detail is open */}
      <div className={`flex-1 transition-all duration-300 ${selectedPatient ? 'w-1/2 opacity-90' : 'w-full'}`}>
        <Tabs defaultValue="sepsis" className="h-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">ICU Sepsis Monitoring Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time sepsis risk prediction and patient monitoring
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </span>
              <TabsList className="ml-4">
                <TabsTrigger value="sepsis">Sepsis Risk</TabsTrigger>
                <TabsTrigger value="patients">All Patients</TabsTrigger>
                <TabsTrigger value="departments">Units</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center pl-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Open settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuLabel className="px-2 py-1.5 text-base font-semibold">Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-2">
                      <div className="flex items-center justify-between space-x-2 mb-3">
                        <Label htmlFor="risk-threshold" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          High Risk Threshold:
                        </Label>
                        <Input 
                          type="number" 
                          id="risk-threshold"
                          value={highRiskThreshold}
                          onChange={handleThresholdChange}
                          min="0"
                          max="100"
                          className="w-20 h-8"
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="night-mode" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          Night Mode
                        </Label>
                        <Switch 
                          id="night-mode"
                          checked={theme === 'dark'}
                          onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <TabsContent value="sepsis" className="h-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                    Average Sepsis Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">{metrics.avgSepsisRiskScore}</div>
                    {metrics.sepsisRiskTrend !== 0 && (
                      <div className={`ml-2 flex items-center text-xs ${
                        metrics.sepsisRiskTrend > 0 ? 'text-critical' : 'text-success'
                      }`}>
                        {metrics.sepsisRiskTrend > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(metrics.sepsisRiskTrend).toFixed(1)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-critical" />
                    High Sepsis Risk Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.highSepsisRiskCount}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Hospital className="h-4 w-4 mr-2 text-muted-foreground" />
                    Total Monitored ICU Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patients.length}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-critical" />
                  High Sepsis Risk Patients
                </CardTitle>
                <CardDescription>
                  Patients with elevated sepsis risk scores requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientsList 
                  patients={patients}
                  onPatientClick={handlePatientClick}
                  filterHighSepsisRiskOnly={true}
                  highRiskThreshold={highRiskThreshold}
                  singleColumn={!!selectedPatient}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  All ICU Patients
                </CardTitle>
                <CardDescription>
                  Complete list of monitored patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientsList 
                  patients={patients}
                  onPatientClick={handlePatientClick}
                  highRiskThreshold={highRiskThreshold}
                  singleColumn={!!selectedPatient}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <ChartBar className="h-5 w-5 mr-2" />
                  ICU Unit Analysis
                </CardTitle>
                <CardDescription>
                  Sepsis risk breakdown by ICU unit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentRisksChart data={departmentRisks} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {departmentRisks.map(dept => (
                    <Card key={dept.department} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{dept.department}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Average Risk:</div>
                          <div className="font-medium text-right">{dept.averageRiskScore}</div>
                          
                          <div className="text-muted-foreground">Patients:</div>
                          <div className="font-medium text-right">{dept.patientsCount}</div>
                          
                          <div className="text-muted-foreground">High Sepsis Risk:</div>
                          <div className="font-medium text-right">{dept.highRiskCount}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Detail Panel - slides in from right without overlay */}
      {selectedPatient && (
        <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-background border-l shadow-lg animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold">{selectedPatient.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseDetails}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PatientDetail patient={selectedPatient} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
