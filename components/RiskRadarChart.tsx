
import React, { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { RiskProfileDataPoint } from '../types';

interface RiskRadarChartProps {
  data: RiskProfileDataPoint[];
}

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ data }) => {
  const [seriesVisibility, setSeriesVisibility] = useState({ value: true });
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setShouldRender(true);
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <div ref={containerRef} style={{ width: '100%', height: 300, position: 'relative' }} className="min-w-0">
      {!shouldRender && (
        <div className="absolute inset-0 bg-cyber-surface/10 animate-pulse rounded" />
      )}
      {shouldRender && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
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
      )}
    </div>
  );
};
