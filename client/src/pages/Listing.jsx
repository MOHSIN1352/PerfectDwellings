import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare, FaUserTie,
  FaChild, FaHeartbeat, FaRoute 
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // --- NEW: State for neighborhood scores ---
  const [scores, setScores] = useState(null);
  const [scoresLoading, setScoresLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // --- IMPROVEMENT: Track if component is mounted ---
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (isMounted) {
          if (data.success === false) {
            setError(true);
          } else {
            setListing(data);
            setError(false);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };
    fetchListing();
    return () => { isMounted = false; }; // Cleanup function
  }, [params.listingId]);

  // --- NEW: useEffect to fetch scores after listing data is available ---
  useEffect(() => {
    const fetchScores = async () => {
      if (listing && listing.address) {
        setScoresLoading(true);
        try {
          // IMPORTANT: This assumes you have set up a proxy for '/api/ai' to 'http://127.0.0.1:5000' in your vite.config.js
          const res = await fetch('http://127.0.0.1:5000/neighborhood_score', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: listing.address }),
          });
          const data = await res.json();
          setScores(data);
        } catch (error) {
          console.error('Could not fetch neighborhood scores', error);
        } finally {
          setScoresLoading(false);
        }   
      }
    };
    fetchScores();
  }, [listing]);


  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare className='text-slate-500' onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} />
          </div>
          {copied && <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-6'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ₹{' '}
              {listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
              {listing.type === 'rent' && ' / month'}
            </p>

            <p className='flex items-center gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>

            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} OFF
                </p>
              )}
            </div>
            
            {listing.listerInfo && (
              <div className='flex items-center gap-2 mt-2'>
                <FaUserTie className='text-slate-500 text-lg' />
                <p className='text-slate-700 font-semibold'>Listed by {listing.listerInfo.name}</p>
              </div>
            )}

            <p className='text-slate-800'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>
            
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap'><FaBed className='text-lg' />{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</li>
              <li className='flex items-center gap-1 whitespace-nowrap'><FaBath className='text-lg' />{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</li>
              <li className='flex items-center gap-1 whitespace-nowrap'><FaParking className='text-lg' />{listing.parking ? 'Parking available' : 'No Parking'}</li>
              <li className='flex items-center gap-1 whitespace-nowrap'><FaChair className='text-lg' />{listing.furnished ? 'Furnished' : 'Unfurnished'}</li>
            </ul>

            {/* --- NEW: AI NEIGHBORHOOD ANALYSIS SECTION --- */}
            {scoresLoading && <p className='text-center text-slate-600'>Loading Neighborhood Scores...</p>}
            {scores && !scores.error && (
              <div className='border-t-2 border-slate-200 pt-4 mt-2'>
                <h2 className='text-2xl font-semibold mb-4'>AI Neighborhood Analysis</h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                  <div className='bg-slate-100 p-4 rounded-lg shadow-sm'>
                    <FaChild className='text-3xl text-blue-500 mx-auto mb-2' />
                    <h3 className='font-bold text-lg'>Family Friendliness</h3>
                    <p className='text-2xl font-bold text-slate-800'>{scores.Family_Score}/10</p>
                  </div>
                  <div className='bg-slate-100 p-4 rounded-lg shadow-sm'>
                    <FaHeartbeat className='text-3xl text-red-500 mx-auto mb-2' />
                    <h3 className='font-bold text-lg'>Health & Wellness</h3>
                    <p className='text-2xl font-bold text-slate-800'>{scores.Health_Score}/10</p>
                  </div>
                  <div className='bg-slate-100 p-4 rounded-lg shadow-sm'>
                    <FaRoute className='text-3xl text-green-500 mx-auto mb-2' />
                    <h3 className='font-bold text-lg'>Connectivity</h3>
                    <p className='text-2xl font-bold text-slate-800'>{scores.Connectivity_Score}/10</p>
                  </div>
                </div>
                {scores.message && <p className='text-xs text-gray-500 text-center mt-2'>{scores.message}</p>}
              </div>
            )}
            
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                Contact Agent
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
