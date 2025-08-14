import React, { useEffect, useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



const Navbar = () => {
  const { userToken, userdata, profilePicUrl, getDataHandler ,setuserToken} = useContext(ContextApp);
const navigate=useNavigate()


  useEffect(() => {
    if (userToken) {
      getDataHandler();
    }
  }, [userToken]);

const handleClick=()=>{
  navigate("/")
}

const handleLogout=()=>{
    toast.success("user logged out successfully")
    localStorage.removeItem('userToken')
    setuserToken(false)
    navigate('/')
}

  return (
    <>
    
      
        <div className="bg-orange-50">
          {/* Header */}
          <header className="w-full bg-white border-b shadow-sm h-14 flex items-center justify-between px-4 md:px-10 fixed top-0 left-0 z-50">
            {/* Left: App Title */}
            <div className='curor-pointer'>
            <span className="text-lg font-bold text-gray-900 cursor-pointer" onClick={handleClick}>SkillEdge AI</span>
            </div>

            {/* Right: Profile and Logout */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 font-semibold hidden sm:block">{userdata.name}</span>
              <img
                src={profilePicUrl}
                alt={userdata.name || "Profile"}
                className="h-13 w-13 rounded-full object-cover border-2 border-orange-400"
              />
              <button
                className="ml-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-s font-semibold"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>
        </div>

    </>
  );
};

export default Navbar;
