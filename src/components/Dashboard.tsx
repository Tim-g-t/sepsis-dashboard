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
  X,
  Shield,
  Zap,
  TrendingUp
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
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

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
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {selectedPatient ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Main Dashboard Panel */}
          <ResizablePanel 
            defaultSize={50} 
            minSize={25} 
            maxSize={75}
            className="overflow-y-auto medical-scroll"
          >
            <div className="p-6">
              {/* Enhanced Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="/predicaid_logo.png" 
                      alt="PredicAid" 
                      className="h-12 w-auto"
                    />
                    <div>
                      <h1 className="text-3xl font-bold medical-title">
                        ICU Sepsis Monitoring
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 flex items-center mt-1">
                        <Shield className="h-4 w-4 mr-2 text-blue-500" />
                        Real-time sepsis risk prediction and patient monitoring
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Bar */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center glass-card px-4 py-2 rounded-lg">
                      <div className="status-dot-success"></div>
                      <span className="text-sm font-medium">System Online</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center justify-between">
                  <Tabs defaultValue="sepsis" className="w-full">
                    <div className="flex items-center justify-between">
                      <TabsList className="glass-card">
                        <TabsTrigger value="sepsis" className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Sepsis Risk
                        </TabsTrigger>
                        <TabsTrigger value="patients" className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          All Patients
                        </TabsTrigger>
                        <TabsTrigger value="departments" className="flex items-center">
                          <Hospital className="h-4 w-4 mr-2" />
                          Units
                        </TabsTrigger>
                      </TabsList>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="glass-card">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Open settings</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 glass-card">
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
                    
                    <TabsContent value="sepsis" className="mt-6 space-y-6">
                      {/* Enhanced Metrics Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="medical-card medical-card-success">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-emerald-500" />
                              Average Sepsis Risk Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-3xl font-bold text-emerald-600">
                                {metrics.avgSepsisRiskScore}
                              </div>
                              {metrics.sepsisRiskTrend !== 0 && (
                                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  metrics.sepsisRiskTrend > 0 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
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
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                              Population average
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="medical-card medical-card-critical">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                              High Sepsis Risk Patients
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-3xl font-bold text-red-600">
                                {metrics.highSepsisRiskCount}
                              </div>
                              <div className="flex items-center">
                                <Zap className="h-5 w-5 text-red-500" />
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                              Requiring immediate attention
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="medical-card">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Hospital className="h-5 w-5 mr-2 text-blue-500" />
                              Total Monitored ICU Patients
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="text-3xl font-bold text-blue-600">
                                {patients.length}
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                              Active monitoring
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Enhanced Patient List Card */}
                      <Card className="medical-card">
                        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center">
                            <AlertCircle className="h-6 w-6 mr-3 text-red-500" />
                            High Sepsis Risk Patients
                            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                              {metrics.highSepsisRiskCount}
                            </span>
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-300">
                            Patients with elevated sepsis risk scores requiring immediate attention
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <PatientsList 
                            patients={patients}
                            onPatientClick={handlePatientClick}
                            filterHighSepsisRiskOnly={true}
                            highRiskThreshold={highRiskThreshold}
                            singleColumn={true}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="patients" className="mt-6 space-y-6">
                      <Card className="medical-card">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center">
                            <Users className="h-6 w-6 mr-3 text-blue-500" />
                            All ICU Patients
                            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              {patients.length}
                            </span>
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-300">
                            Complete list of monitored patients
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <PatientsList 
                            patients={patients}
                            onPatientClick={handlePatientClick}
                            highRiskThreshold={highRiskThreshold}
                            singleColumn={true}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="departments" className="mt-6 space-y-6">
                      <Card className="medical-card">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
                          <CardTitle className="text-lg flex items-center">
                            <ChartBar className="h-6 w-6 mr-3 text-purple-500" />
                            ICU Unit Analysis
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-300">
                            Sepsis risk breakdown by ICU unit
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="chart-container">
                            <DepartmentRisksChart data={departmentRisks} />
                          </div>
                          
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {departmentRisks.map(dept => (
                              <Card key={dept.department} className="medical-card">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center">
                                    <Hospital className="h-4 w-4 mr-2 text-slate-500" />
                                    {dept.department}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                      <div className="text-slate-600 dark:text-slate-400">Average Risk:</div>
                                      <div className="text-slate-600 dark:text-slate-400">Patients:</div>
                                      <div className="text-slate-600 dark:text-slate-400">High Risk:</div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                      <div className="font-bold text-lg">{dept.averageRiskScore}</div>
                                      <div className="font-semibold">{dept.patientsCount}</div>
                                      <div className="font-semibold text-red-600">{dept.highRiskCount}</div>
                                    </div>
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
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle className="bg-slate-200 dark:bg-slate-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors" />

          {/* Patient Detail Panel */}
          <ResizablePanel 
            defaultSize={50} 
            minSize={25} 
            maxSize={75}
            className="bg-white dark:bg-slate-800 shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                <Heart className="h-5 w-5 mr-3 text-red-500" />
                {selectedPatient.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDetails}
                className="h-10 w-10 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 medical-scroll">
              <PatientDetail patient={selectedPatient} onClose={handleCloseDetails} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        // When no patient is selected, show full width dashboard
        <div className="h-full overflow-y-auto medical-scroll">
          <div className="p-6">
            {/* Enhanced Header for full width */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="/predicaid_logo.png" 
                    alt="PredicAid" 
                    className="h-16 w-auto"
                  />
                  <div>
                    <h1 className="text-4xl font-bold medical-title">
                      ICU Sepsis Monitoring Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center mt-2">
                      <Shield className="h-5 w-5 mr-2 text-blue-500" />
                      Real-time sepsis risk prediction and patient monitoring powered by AI
                    </p>
                  </div>
                </div>
                
                {/* Status Bar */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center glass-card px-4 py-2 rounded-lg">
                    <div className="status-dot-success"></div>
                    <span className="text-sm font-medium">System Online</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="glass-card">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Open settings</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 glass-card">
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

            <Tabs defaultValue="sepsis" className="h-full">
              <TabsList className="glass-card mb-6">
                <TabsTrigger value="sepsis" className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Sepsis Risk
                </TabsTrigger>
                <TabsTrigger value="patients" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  All Patients
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center">
                  <Hospital className="h-4 w-4 mr-2" />
                  Units
                </TabsTrigger>
              </TabsList>
              
              {/* Rest of the content remains the same but with enhanced styling... */}
              <TabsContent value="sepsis" className="space-y-6">
                {/* Enhanced Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="medical-card medical-card-success">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-emerald-500" />
                        Average Sepsis Risk Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-emerald-600">
                          {metrics.avgSepsisRiskScore}
                        </div>
                        {metrics.sepsisRiskTrend !== 0 && (
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            metrics.sepsisRiskTrend > 0 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
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
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        Population average
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="medical-card medical-card-critical">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                        High Sepsis Risk Patients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-red-600">
                          {metrics.highSepsisRiskCount}
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        Requiring immediate attention
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="medical-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Hospital className="h-5 w-5 mr-2 text-blue-500" />
                        Total Monitored ICU Patients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-blue-600">
                          {patients.length}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        Active monitoring
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="medical-card">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="h-6 w-6 mr-3 text-red-500" />
                      High Sepsis Risk Patients
                      <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {metrics.highSepsisRiskCount}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">
                      Patients with elevated sepsis risk scores requiring immediate attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PatientsList 
                      patients={patients}
                      onPatientClick={handlePatientClick}
                      filterHighSepsisRiskOnly={true}
                      highRiskThreshold={highRiskThreshold}
                      singleColumn={false}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="patients" className="space-y-6">
                <Card className="medical-card">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-6 w-6 mr-3 text-blue-500" />
                      All ICU Patients
                      <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        {patients.length}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">
                      Complete list of monitored patients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PatientsList 
                      patients={patients}
                      onPatientClick={handlePatientClick}
                      highRiskThreshold={highRiskThreshold}
                      singleColumn={false}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="departments" className="space-y-6">
                <Card className="medical-card">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-t-lg">
                    <CardTitle className="text-lg flex items-center">
                      <ChartBar className="h-6 w-6 mr-3 text-purple-500" />
                      ICU Unit Analysis
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-300">
                      Sepsis risk breakdown by ICU unit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="chart-container">
                      <DepartmentRisksChart data={departmentRisks} />
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {departmentRisks.map(dept => (
                        <Card key={dept.department} className="medical-card">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center">
                              <Hospital className="h-4 w-4 mr-2 text-slate-500" />
                              {dept.department}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="text-slate-600 dark:text-slate-400">Average Risk:</div>
                                <div className="text-slate-600 dark:text-slate-400">Patients:</div>
                                <div className="text-slate-600 dark:text-slate-400">High Risk:</div>
                              </div>
                              <div className="space-y-2 text-right">
                                <div className="font-bold text-lg">{dept.averageRiskScore}</div>
                                <div className="font-semibold">{dept.patientsCount}</div>
                                <div className="font-semibold text-red-600">{dept.highRiskCount}</div>
                              </div>
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
        </div>
      )}
    </div>
  );
};

export default Dashboard;
