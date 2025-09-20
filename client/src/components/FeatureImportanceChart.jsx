import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FeatureImportanceChart({ data }) {
  return (
    // The main container with a white background and shadow
    <div className='w-full h-[500px] bg-white p-6 rounded-lg shadow-md'>
      <h3 className='text-xl font-semibold text-slate-700 mb-4 text-center'>AI Price Prediction: Key Factors</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical" 
          data={data}
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" />
          {/* Increased width and smaller font size for the labels on the Y-axis */}
          <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend />
          {/* A more vibrant, professional color for the bar */}
          <Bar dataKey="importance" name="Importance" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}