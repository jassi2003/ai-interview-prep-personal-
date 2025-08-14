import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import AddsessionForm from '../components/AddsessionForm';
import SessionModal from '../components/SessionModal';
import { ContextApp } from '../context/UserContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';

const Dashboard = () => {
  const { userToken, backendUrl } = useContext(ContextApp);
  const [openForm, setOpenForm] = useState(false);
  const [storeSessions, setStoreSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch all sessions
  const getAllSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/session/my-sessions`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setStoreSessions(response.data.sessions);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      getAllSessions();
    }
  }, [userToken]);




  // Delete a session
  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      setLoading(true);
      const res = await axios.delete(`${backendUrl}/api/session/${sessionId}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.success) {
        toast.success('Session deleted!');
        setStoreSessions((prev) => prev.filter((s) => s._id !== sessionId));
      } else {
        toast.error(res.data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (!userToken) return null;

  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <div className="pt-16 px-4 sm:px-8">
        {/* Sessions Grid */}
        {storeSessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No sessions created yet. Click on <strong>Add New +</strong> below.
          </div>
        ) : (
          <div className="cursor-pointer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {storeSessions.map((session) => (
              <div
                key={session._id}
                className="relative bg-orange-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3"
                onClick={() => navigate(`/interview-prep/${session._id}`)}
              >
                {/* Trash (delete) icon at top right */}
                <button
                  className="absolute top-2 right-2 z-10 text-gray-400 hover:text-orange-500 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(session._id);
                  }}
                  aria-label="Delete session"
                  title="Delete session"
                >
                  <Trash size={20} />
                </button>

                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 text-white font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full">
                    {session.role ? session.role.slice(0, 2).toUpperCase() : 'NA'}
                  </div>
                  <div>
                    <h2 className="capitalize text-lg font-semibold text-gray-800">{session.role}</h2>
                    <p className="capitalize text-sm text-gray-500">{session.topicsToFocus}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-orange-100 text-gray-700 px-3 py-1 rounded-full">
                    Experience: {session.experience}
                  </span>
                  <span className="text-xs bg-orange-100 text-gray-700 px-3 py-1 rounded-full">
                    {session.questions ? session.questions.length : 0} Q&amp;A
                  </span>
                  <span className="text-xs bg-orange-100 text-gray-700 px-3 py-1 rounded-full">
                    Last Updated:{" "}
                    {session.updatedAt
                      ? new Date(session.updatedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      : "N/A"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">{session.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New + Button */}
      <button
        className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full px-6 py-3 shadow-lg text-base font-bold hover:bg-orange-600 hover:scale-105 transition-all duration-200 z-50 focus:outline-none focus:ring-4 focus:ring-orange-300"
        onClick={() => setOpenForm(true)}
      >
        Add New +
      </button>
      {/* Modal for adding sessions */}
      <SessionModal
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        children={<AddsessionForm onClose={() => setOpenForm(false)} />}
        hideHeader={false}
      />
    </>
  );
};

export default Dashboard;
