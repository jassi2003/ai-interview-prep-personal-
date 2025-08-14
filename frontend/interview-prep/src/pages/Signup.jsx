import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import { useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';


const Signup = ({ setcurrentPage }) => {
  const navigate = useNavigate();
  const {userToken,setuserToken}=useContext(ContextApp)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const [profilepic, setprofilepic] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
    const [error, setError] = useState("");
          const [loading,setloading]=useState(false)
    
  

 const handleSignup = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError("Please enter a valid email address");
    return;
  }
  if (!password) {
    setError("Please enter the password");
    return;
  }
  setError("");

  setloading(true)
  try {
    //doubts: formdata append,headers,setusertoken

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profilepic) formData.append('profilePic', profilepic);  // <-- Note exact match

    const response = await axios.post(`${backendUrl}/api/auth/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      localStorage.setItem('userToken', response.data.token);
      setuserToken(response.data.token);
      setcurrentPage("login");
    } else {
      toast.error(response.data.message);
    }

  } catch (err) {
    console.error(err);
    if (err.response) {
      toast.error(err.response.data?.message || JSON.stringify(err.response.data));
    } else if (err.request) {
      toast.error("No response from server. Check your backend.");
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  }
  finally{
    setloading(false)
  }
};

if(loading) return <  Loader/>
  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Your Account 📝</h2>

      <form className="space-y-5" onSubmit={handleSignup}>
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center">
          <label htmlFor="docImg" className="cursor-pointer">
            <img
              src={
                profilepic
                  ? URL.createObjectURL(profilepic)
                  : "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
              }
              className="h-20 w-20 object-cover rounded-full border-2 border-orange-400 shadow-sm"
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setprofilepic(e.target.files[0])}
            type="file"
            id="docImg"
            hidden
          />
          <p className="text-sm text-gray-600 mt-2">Upload Profile Picture</p>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={({ target }) => setname(target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Email Address</label>
          <input
            type="text"
            value={email}
            onChange={({ target }) => setemail(target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setpassword(target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Sign Up
        </button>

{error &&(
  <p className='text-red-700'>{error}</p>
)}

        {/* Switch to Login */}
        <div className="text-sm text-center mt-4">
          <p className="text-gray-600">Already have an account?</p>
          <button
            type="button"
            onClick={() => setcurrentPage("login")}
            className="text-orange-600 font-medium underline hover:text-orange-700 mt-1"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
