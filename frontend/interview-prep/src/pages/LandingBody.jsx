import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { APP_FEATURES } from '../utils/data';
import Login from './Login';
import Signup from './Signup';
import Modal from '../components/Modal';
import { useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import img1 from '../assets/img1.png'


import Navbar from '../components/Navbar';

const LandingBody = () => {
  const navigate = useNavigate();
  const [openAuthModal, setopenAuthModal] = useState(false);
  const [currentPage, setcurrentPage] = useState("login");
    const {userToken,setuserToken}=useContext(ContextApp)
  

  return (
        <>
    <div className="bg-[#FFECD1] min-h-screen font-sans text-[#1A1A1A]">
             
      {/* Hero Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-6 py-16 max-w-7xl mx-auto">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#FF6B35] px-3 py-1 rounded-full w-fit">
            <Sparkles className='neon-textt' size={18} />
            <span className="text-sm font-semibold neon-text">AI Powered</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Ace Interviews with <span className="text-[#FF6B35] ">AI-Powered</span> Learning
          </h2>
          <p className="text-lg text-gray-700">
            Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-[#333] transition"
          >
            Get Started
          </button>
        </div>
        {/* Hero Image */}
        <div className="flex-1">
          <img
            src={img1}
            alt="Hero"
            className="rounded-2xl border-4 border-[#FF6B35] shadow-lg w-full"
          />
        </div>
      </div>
      {/* Features Section */}
      <section className="px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">Features That Make You Shine</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {APP_FEATURES.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className="bg-[#FFECD1] border border-orange-200 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-5xl mx-auto">
          {APP_FEATURES.slice(3).map((feature) => (
            <div
              key={feature.id}
              className="bg-[#FFECD1] border border-orange-200 p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
   </>
  );
};

export default LandingBody;
