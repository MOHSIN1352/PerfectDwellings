import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function NeighborhoodRadarChart({ data }) {

  const chartData = [
    { subject: 'Family', ...data.reduce((obj, item) => ({ ...obj, [item.locality]: item.Family_Score }), {}) },
    { subject: 'Health', ...data.reduce((obj, item) => ({ ...obj, [item.locality]: item.Health_Score }), {}) },
    { subject: 'Connectivity', ...data.reduce((obj, item) => ({ ...obj, [item.locality]: item.Connectivity_Score }), {}) },
  ];

  // Generate a color palette for the localities
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <div className='w-full h-[500px] bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-semibold text-slate-700 text-center'>AI Neighborhood Analysis: Lifestyle Scores</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Tooltip />
          <Legend />
          {/* Dynamically create a <Radar /> for each locality */}
          {data.map((entry, index) => (
            <Radar
              key={entry.locality}
              name={entry.locality}
              dataKey={entry.locality}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}