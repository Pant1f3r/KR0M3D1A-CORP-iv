import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { RiskProfileDataPoint } from '../types';

interface RiskRadarChartProps {
  data: RiskProfileDataPoint[];
}

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ data }) => {
  const [seriesVisibility, setSeriesVisibility] = useState({ value: true });

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
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#2A3C4D" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#E6F1FF', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                    name="Risk" 
                    dataKey="value" 
                    stroke="#FF4500" 
                    fill="#FF4500" 
                    fillOpacity={0.6}
                    hide={!seriesVisibility.value}
                />
                <Legend onClick={(e) => handleLegendClick(e.dataKey)} formatter={renderLegendText} />
                 <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(10, 25, 47, 0.8)',
                        borderColor: '#FF4500',
                        color: '#E6F1FF',
                    }}
                    itemStyle={{ color: '#E6F1FF' }}
                />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  );
};
