import React, { useEffect, useState } from 'react';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import NeighborhoodRadarChart from '../components/NeighborhoodRadarChart';

export default function Dashboard() {
  const [importanceData, setImportanceData] = useState([]);
  const [neighborhoodData, setNeighborhoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const importanceRes = await fetch('http://127.0.0.1:5000/feature_importance');
        const neighborhoodRes = await fetch('http://127.0.0.1:5000/neighborhood_comparison');

        const importanceJson = await importanceRes.json();
        const neighborhoodJson = await neighborhoodRes.json();

        // Check for errors from the API before processing data
        if (importanceRes.status !== 200) throw new Error(importanceJson.error || 'Failed to fetch feature importance.');
        if (neighborhoodRes.status !== 200) throw new Error(neighborhoodJson.error || 'Failed to fetch neighborhood data.');

        // Sort importance data for the bar chart
        setImportanceData(importanceJson.sort((a, b) => a.importance - b.importance));
        setNeighborhoodData(neighborhoodJson);
        
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className='bg-slate-50 min-h-screen p-3'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7 text-slate-800'>
          AI Insights Dashboard
        </h1>
        <p className='text-center text-gray-600 mb-10'>Visualizing the data that powers our smart real estate platform.</p>
        
        {loading && <p className='text-center text-lg'>Loading visualizations...</p>}
        {error && <p className='text-center text-red-600 bg-red-100 p-4 rounded-lg'>Error: {error}</p>}
        
        {!loading && !error && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <FeatureImportanceChart data={importanceData} />
            <NeighborhoodRadarChart data={neighborhoodData} />
          </div>
        )}
      </div>
    </main>
  );
}