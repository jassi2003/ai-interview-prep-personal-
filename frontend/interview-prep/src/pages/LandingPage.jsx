import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LandingBody from './LandingBody';
import { useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import Modal from '../components/Modal';
import Login from './Login';
import Signup from './Signup';

const LandingPage = () => {
    const [openAuthModal, setopenAuthModal] = useState(false);
    const [currentPage, setcurrentPage] = useState("login");
  
 const {userToken}=useContext(ContextApp)



  return (
        <>
     {
      userToken&&(
      <>
        <Navbar/>
        <LandingBody/>
        </>
      )
     }

{
  !userToken &&(
    <>
      {/* <button
          onClick={() => setopenAuthModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-full hover:bg-[#e95a2e] transition"
        >
          Login / Sign Up
        </button> */}
           <div className=" bg-orange-50">
          {/* Header */}
          <header className="w-full bg-white border-b shadow-sm h-14 flex items-center justify-between px-4 md:px-10 fixed top-0 left-0 z-50">
            {/* Left: App Title */}
            <span className="text-lg font-bold text-gray-900">Interview Prep AI</span>

            {/* Right: Profile and Logout */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setopenAuthModal(true)}
                className="ml-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-s font-semibold">
                Login/Signup
              </button>
            </div>
          </header>
        </div>
        <LandingBody/> 
    <Modal
    isOpen={openAuthModal}
    onClose={()=>{setopenAuthModal(false)
      setcurrentPage("login")
    }}
     children={
    currentPage === "login"
      ? <Login setcurrentPage={setcurrentPage} onClose={()=>{setopenAuthModal(false)}}/>
      : <Signup setcurrentPage={setcurrentPage} />
  }
    hideHeader={false}
/>
    </>
  )
}     
   </>
  );
};

export default LandingPage;
