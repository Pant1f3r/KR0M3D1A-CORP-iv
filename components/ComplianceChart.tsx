import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ComplianceDataPoint } from '../types';

interface ComplianceChartProps {
  data: ComplianceDataPoint[];
}

export const ComplianceChart: React.FC<ComplianceChartProps> = ({ data }) => {
  const [seriesVisibility, setSeriesVisibility] = useState({ score: true });

  const handleLegendClick = (dataKey: string) => {
    setSeriesVisibility(prevState => ({
      ...prevState,
      [dataKey]: !prevState[dataKey as keyof typeof prevState],
    }));
  };

  const renderLegendText = (value: string, entry: any) => {
    const { dataKey } = entry;
    const isVisible = seriesVisibility[dataKey as keyof typeof seriesVisibility];
    const color = isVisible ? '#E6F1FF' : '#6C7A89';
    return <span style={{ color, cursor: 'pointer' }}>{value}</span>;
  };

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid stroke="#2A3C4D" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#6C7A89" tick={{ fill: '#6C7A89', fontSize: 12 }} />
          <YAxis stroke="#6C7A89" domain={[0, 100]} unit="%" tick={{ fill: '#6C7A89', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 25, 47, 0.8)',
              borderColor: '#32CD32',
              color: '#E6F1FF',
            }}
            itemStyle={{ color: '#E6F1FF' }}
             cursor={{ fill: 'rgba(50, 205, 50, 0.2)' }}
          />
          <Legend onClick={(e) => handleLegendClick(e.dataKey)} formatter={renderLegendText} />
          <Bar 
            dataKey="score" 
            name="Compliance Score" 
            fill="#32CD32"
            hide={!seriesVisibility.score}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
