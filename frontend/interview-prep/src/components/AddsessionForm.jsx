import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ContextApp } from '../context/UserContext';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';



const AddsessionForm = ({ onClose }) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topicsToFocus, setTopics] = useState("");
  const [description, setDescription] = useState("");
  const [loader,setloader]=useState(false);

  const navigate=useNavigate()

  const {userToken}=useContext(ContextApp) 
      const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // Handles submission
  const createSession = async (e) => {
    e.preventDefault();
    setloader(true)
    try {
        const aiData={ role,experience,topicsToFocus,numberOfQuestions:5}
    const aiResponse= await axios.post(`${backendUrl}/api/ai/generate-questions`,aiData,{ headers: { Authorization: `Bearer ${userToken}`}})
    const generateQuestions=aiResponse.data


      const data = { role, experience, topicsToFocus, description,questions:generateQuestions};
      const response = await axios.post(`${backendUrl}/api/session/create`,data,{ headers: { Authorization: `Bearer ${userToken}`}});
      if (response.data.success) {
        toast.success(response.data.message);
        onClose && onClose();
        navigate(`/interview-prep/${response.data.createSession._id}`)
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
        setloader(false)
    }
  };



  return (
    <>
    {loader?(
            <Loader/>
        ):(
    
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Fill out a few details and unlock your personalized set of interview questions
      </h2>
      <form className="space-y-5" onSubmit={createSession}>
        {/* Role */}
        <div>
          <label htmlFor="role" className="block mb-1 font-semibold text-gray-700">Role</label>
          <input
            id="role"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            type="text"
            placeholder="Frontend Developer, Data Scientist, etc."
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block mb-1 font-semibold text-gray-700">Experience</label>
          <input
            id="experience"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={experience}
            onChange={e => setExperience(e.target.value)}
            required
            type="text"
            placeholder="2 years, Fresher, etc."
          />
        </div>

        {/* Topics */}
        <div>
          <label htmlFor="topics" className="block mb-1 font-semibold text-gray-700">Topics</label>
          <input
            id="topics"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={topicsToFocus}
            onChange={e => setTopics(e.target.value)}
            required
            type="text"
            placeholder="React, Data Structures, Algorithms..."
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-orange-300"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Anything specific you'd like to add?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white rounded-lg py-2 font-bold text-lg mt-2 shadow hover:bg-orange-600 transition"
        >
          Create Session
        </button>
      </form>
    </div>
        )}

    </>
  );

};

export default AddsessionForm;
