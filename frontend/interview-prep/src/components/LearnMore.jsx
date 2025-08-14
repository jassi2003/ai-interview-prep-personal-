import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Loader';


const LearnMore = ({ onClose, question, userToken }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [resData, setResData] = useState(null);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const generateResponse = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${backendUrl}/api/ai/generate-explanation`,
          { question },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        if (response.data.success) {
          setResData(response.data.data);
        } else {
          toast.error(response.data.error);
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
      } finally {
        setLoading(false);
      }
    };
    if (question && userToken) generateResponse();
  }, [question, userToken, backendUrl]);

  return (
    
    <div className="
      mx-auto
      mt-6 sm:mt-10 md:mt-[80px]
      border border-gray-300 rounded-lg
      shadow-lg
      bg-white
      w-full
      max-w-[95vw]
      sm:w-[420px]
      md:w-[500px]
      h-[540px] sm:h-[620px] md:h-[700px]
      max-h-[85vh]   /* You can increase vh if you want */
      flex flex-col
    ">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 text-lg">Learn More</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      {/* Loader or content */}
      {Loading ? (
        <div className='mt-[-200px]'> 
        <Loader />
            
            </div>
      ) : resData ? (
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-bold text-blue-700 text-lg mb-2">{resData.title}</h3>
          <div className="text-gray-700 whitespace-pre-line">{resData.explanation}</div>
        </div>
      ) : (
        <div className="flex-1 p-4 text-gray-600 italic">
          No explanation available for this question.
        </div>
      )}
    </div>
  );
};

export default LearnMore;
