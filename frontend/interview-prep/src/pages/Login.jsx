import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import { useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Loader from '../components/Loader';


const Login = ({ setcurrentPage ,onClose}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {userToken,setuserToken}=useContext(ContextApp)
      const [loading,setloading]=useState(false)
  
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
setloading(true)
    try{
 if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    const response=await axios.post(`${backendUrl}/api/auth/login`,{email,password})
    if(response.data.success){
      console.log("response",response)
              toast.success(response.data.message);
      localStorage.setItem('userToken',response.data.token)
      setuserToken(response.data.token)
      onClose()
      navigate('/dashboard')
    }
    else{
      toast.error(response.data.message)
    }

    setError(""); 
    }
      catch (err) {  
      console.error("Login Error:", err); 
  
      if (err.response) {        
        toast.error(err.response.data?.message || "Invalid Credentials");
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
   useEffect(()=>{
 if(userToken){
  navigate('/'); 

}
  },[userToken])


  if(loading) return <Loader/>
  return (
    
   
    <div className="p-6 sm:p-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back 👋</h2>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Email Address</label>
          <input
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Login
        </button>

        <div className="text-sm text-center mt-4">
          <p className="text-gray-600">Don’t have an account?</p>
          <button
            type="button"
            onClick={() => setcurrentPage("signup")}
            className="text-orange-600 font-medium underline hover:text-orange-700 mt-1"
          >
            Sign up here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
