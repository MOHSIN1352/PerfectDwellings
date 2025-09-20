import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import ListingItem from '../components/ListingItem';
import CityCard from '../components/CityCard';
import FeatureCard from '../components/FeatureCard';
import { FaAward, FaHeadset, FaSearch } from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay, Pagination]);

   const topCities = [
    { name: 'Mumbai', imageUrl: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcT3D8FVbnHXx3AyXasHIP9kgpttazxT_MnAEQpS2eiPXsFQygyOEclbVDMKjEwiA6KYuhc_jA3hYSwtNWtKz735ez6V6GMxD1sq3uF-VLc' },
    { name: 'Delhi', imageUrl: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Bangalore', imageUrl: 'https://i.ytimg.com/vi/IoElbogbGGc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDtt5Dgb6KblKKQctjQsZzdGkRRjg' },
    { name: 'Pune', imageUrl: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQnvF7CuyPj9vdJQ7u32s5vKSSkfRn848Ff4nj0xLWIaZxtgzFCSsJa19hNhu5RZJQnsQJ15TtkKiDNssFsSH6jNNny7myWfdS38Dhtrw' },
  ];


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const offerRes = await fetch('/api/listing/get?offer=true&limit=5');
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        const rentRes = await fetch('/api/listing/get?type=rent&limit=4');
        const rentData = await rentRes.json();
        setRentListings(rentData);

        const saleRes = await fetch('/api/listing/get?type=sale&limit=4');
        const saleData = await saleRes.json();
        setSaleListings(saleData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className='bg-[#fdf8f5]'>
      {/* HERO SECTION */}
      <div className='flex flex-col gap-6 p-20 px-4 max-w-6xl mx-auto text-center'>
        <h1 className='text-slate-800 font-bold text-4xl lg:text-7xl'>
          Find your next <span className='text-slate-600'>perfect</span>
          <br /> place with ease
        </h1>
        <div className='text-gray-500 text-sm sm:text-base'>
          Perfect Dwellings is your trusted partner in finding a place to call home.
          <br />
          Explore a wide range of curated properties tailored to your lifestyle.
        </div>
        <Link to={'/search'} className='text-sm sm:text-base text-blue-800 font-bold hover:underline self-center'>
          Let's get started...
        </Link>
      </div>

      {/* SWIPER */}
      {offerListings && offerListings.length > 0 && (
        <div className='max-w-7xl mx-auto p-4'>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className='rounded-2xl shadow-lg'
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className='flex h-[550px] w-full'>
                  <div className='w-1/2'>
                    <img src={listing.imageUrls[0]} alt={listing.name} className='w-full h-full object-cover' />
                  </div>
                  <div className='w-1/2 bg-white flex flex-col justify-center items-center p-8 text-center'>
                    <h2 className='text-3xl lg:text-4xl font-bold text-slate-800 mb-4'>{listing.name}</h2>
                    <p className='text-lg text-slate-600 mb-6 line-clamp-3'>{listing.description}</p>
                    <p className='text-2xl font-semibold text-slate-900 mb-6'>
                      ₹ {listing.discountPrice ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
                    </p>
                    <Link to={`/listing/${listing._id}`} className='bg-slate-700 text-white py-3 px-6 rounded-lg uppercase hover:bg-slate-800 transition-colors'>
                      View Property
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      
      {/* --- THIS IS THE CONTAINER FOR ALL THE CONTENT SECTIONS --- */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-12 my-10'>
        
        {/* "WHY CHOOSE US" SECTION */}
        <div>
            <div className='my-3 text-center'>
                <h2 className='text-3xl font-semibold text-slate-700'>Why Choose Perfect Dwellings?</h2>
                <p className='text-sm text-gray-500 mt-2'>We provide the best service in the industry</p>
            </div>
            {/* This grid container correctly lays out the FeatureCard components */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-6'>
                <FeatureCard icon={<FaSearch />} title="AI-Powered Search" description="Our smart chatbot and filters help you find the perfect property in seconds." />
                <FeatureCard icon={<FaAward />} title="Quality Listings" description="Every property is vetted to ensure it meets our high standards of quality and comfort." />
                <FeatureCard icon={<FaHeadset />} title="24/7 Support" description="Our dedicated support team is always here to assist you at every step of your journey." />
            </div>
        </div>

        {/* TOP CITIES SECTION */}
        <div>
          <div className='my-3'>
            <h2 className='text-3xl font-semibold text-slate-700'>Explore Top Cities</h2>
            <p className='text-sm text-gray-500'>Find properties in India's most sought-after locations.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4'>
            {topCities.map((city) => (<CityCard key={city.name} name={city.name} imageUrl={city.imageUrl} />))}
          </div>
        </div>
        
        {/* TESTIMONIALS SECTION */}
        <div className='bg-white p-8 rounded-lg shadow-lg'>
            <div className='my-3 text-center'>
                <h2 className='text-3xl font-semibold text-slate-700'>What Our Clients Say</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
                <div className='p-6 border rounded-lg'>
                    <p className='text-gray-600 italic'>"Perfect Dwellings made finding our dream home in Bangalore an absolute breeze. The AI chatbot was surprisingly helpful!"</p>
                    <p className='text-slate-800 font-bold mt-4'>- The Sharma Family</p>
                </div>
                <div className='p-6 border rounded-lg'>
                    <p className='text-gray-600 italic'>"As an investor, the detailed listings and transparent pricing were exactly what I needed. Highly recommend this platform."</p>
                    <p className='text-slate-800 font-bold mt-4'>- Rohan Gupta</p>
                </div>
            </div>
        </div>

        {/* LISTING RESULTS SECTIONS */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-700'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (<ListingItem listing={listing} key={listing._id} />))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-700'>Recent Places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (<ListingItem listing={listing} key={listing._id} />))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-700'>Recent Places for Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (<ListingItem listing={listing} key={listing._id} />))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
