
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalData, RiskLevel } from '@/types/risk';
import { useTheme } from "next-themes";

interface RiskChartProps {
  data: HistoricalData[];
  riskLevel: RiskLevel;
  className?: string;
  height?: number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded shadow-lg p-2 text-xs">
        <p className="font-semibold">{format(new Date(label), 'MMM d, h:mm a')}</p>
        <p>Risk Score: <span className="font-semibold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const RiskChart: React.FC<RiskChartProps> = ({ data, riskLevel, className, height = 200 }) => {
  const { theme } = useTheme();
  
  // Process data for the chart
  const chartData = data.map(item => ({
    timestamp: item.timestamp,
    score: item.score
  }));
  
  // Set color based on risk level
  const colors = {
    high: '#DC2626',
    medium: '#F59E0B',
    low: '#059669'
  };
  
  const color = colors[riskLevel];
  
  // Theme-aware colors
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const axisColor = isDark ? '#6B7280' : '#9CA3AF';
  const textColor = isDark ? '#F9FAFB' : '#374151';
  
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`riskGradient-${riskLevel}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor} 
            vertical={false} 
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => format(new Date(value), 'h:mm a')}
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: textColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#riskGradient-${riskLevel})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskChart;
