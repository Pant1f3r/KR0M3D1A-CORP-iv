import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ThreatDistributionChartProps {
  data: { subject: string; value: number; }[];
}

const COLORS = ['#FF4500', '#FF8C00', '#FFD700', '#ADFF2F', '#00BFFF', '#BA55D3', '#FF69B4'];

export const ThreatDistributionChart: React.FC<ThreatDistributionChartProps> = ({ data }) => {
    const [activeKeys, setActiveKeys] = useState<string[]>(data.map(d => d.subject));

    const handleLegendClick = (data: any) => {
        const { value } = data; // 'value' here is the subject/name
        const newActiveKeys = activeKeys.includes(value)
            ? activeKeys.filter(key => key !== value)
            : [...activeKeys, value];
        setActiveKeys(newActiveKeys);
    };

    const filteredData = data.filter(d => activeKeys.includes(d.subject));
    
    const renderLegendText = (value: string, entry: any) => {
        const isActive = activeKeys.includes(value);
        const color = isActive ? '#E6F1FF' : '#6C7A89';
        return <span style={{ color, cursor: 'pointer' }}>{value}</span>;
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={filteredData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="subject"
                    >
                        {filteredData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[data.findIndex(d => d.subject === entry.subject) % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(10, 25, 47, 0.8)',
                            borderColor: '#00BFFF',
                            color: '#E6F1FF',
                        }}
                    />
                     <Legend 
                        onClick={handleLegendClick}
                        formatter={renderLegendText}
                        layout="vertical" 
                        align="right" 
                        verticalAlign="middle" 
                        iconSize={10}
                        wrapperStyle={{ fontSize: '12px', color: '#E6F1FF' }}
                     />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
