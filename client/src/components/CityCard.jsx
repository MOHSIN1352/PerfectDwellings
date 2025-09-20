import React from 'react';
import { Link } from 'react-router-dom';

export default function CityCard({ name, imageUrl }) {
  return (
    <Link to={`/search?city=${name}`}>
      <div className='relative w-full h-72 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300'>
        <img
          src={imageUrl}
          alt={`View properties in ${name}`}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
        />
        <div className='absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300'></div>
        <div className='absolute bottom-4 left-4'>
          <h3 className='text-white text-2xl font-bold'>{name}</h3>
        </div>
      </div>
    </Link>
  );
}