import React from 'react';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className='bg-white p-6 rounded-md shadow-md hover:shadow-xl transition-shadow duration-300'>
      <div className='text-4xl text-slate-600 mb-4'>{icon}</div>
      <h3 className='text-xl font-bold text-slate-800 mb-2'>{title}</h3>
      <p className='text-gray-500'>{description}</p>
    </div>
  );
}