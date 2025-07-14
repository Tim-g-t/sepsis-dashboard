
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps,
  Cell
} from 'recharts';
import { DepartmentRisk } from '@/types/risk';
import { useTheme } from "next-themes";

interface DepartmentRisksChartProps {
  data: DepartmentRisk[];
  className?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DepartmentRisk;
    
    return (
      <div className="bg-background border border-border rounded shadow-lg p-2 text-xs">
        <p className="font-semibold mb-1">{data.department}</p>
        <p>Average Risk: <span className="font-semibold">{data.averageRiskScore}</span></p>
        <p>High Risk Entities: <span className="font-semibold">{data.highRiskCount}</span></p>
        <p>Total Patients: <span className="font-semibold">{data.patientsCount}</span></p>
      </div>
    );
  }
  return null;
};

const DepartmentRisksChart: React.FC<DepartmentRisksChartProps> = ({ data, className }) => {
  const { theme } = useTheme();
  
  // Helper function to determine bar color based on risk score
  const getBarColor = (score: number) => {
    if (score >= 70) return '#DC2626'; // High risk - red
    if (score >= 40) return '#F59E0B'; // Medium risk - orange
    return '#059669'; // Low risk - green
  };
  
  // Theme-aware colors
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#6B7280' : '#9CA3AF';
  const textColor = isDark ? '#F9FAFB' : '#374151';
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={gridColor} 
          />
          <XAxis 
            dataKey="department" 
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="averageRiskScore" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={50}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.averageRiskScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentRisksChart;
