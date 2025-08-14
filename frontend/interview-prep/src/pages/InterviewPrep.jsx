import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ContextApp } from '../context/UserContext';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import LearnMore from '../components/LearnMore';
import Navbar from '../components/Navbar';
import { ChevronDown } from 'lucide-react';
import LoadMore from '../components/LoadMore';


const Interviewprep = () => {
  const { userToken } = useContext(ContextApp);
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAnswers, setOpenAnswers] = useState({});
  const [pinned, setPinned] = useState([]);
  const [learnMore, setlearnMore] = useState(null);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);


  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch session data
  const getSession = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setSession(response.data.getSession);
      } else {
        toast.error('No session found');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) getSession();
  }, [userToken]);

  // Load pinned from localStorage
  useEffect(() => {
    const savedPinned = localStorage.getItem('pinnedQuestions');
    if (savedPinned) setPinned(JSON.parse(savedPinned));
  }, []);

  // Save pinned to localStorage
  useEffect(() => {
    localStorage.setItem('pinnedQuestions', JSON.stringify(pinned));
  }, [pinned]);

  const togglePin = (id) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  if (loading) return <Loader />;

  const sortedQuestions = session?.questions
    ? [
      ...session.questions.filter((q) => pinned.includes(q._id)),
      ...session.questions.filter((q) => !pinned.includes(q._id)),
    ]
    : [];



  //LOAD MORE QUESTONS API
  const loadMoreQuestions = async (e) => {
    e.preventDefault();
    setLoadMoreLoading(true);
    try {
      const aiData = {
        role: session.role,
        experience: session.experience,
        topicsToFocus: session.topicsToFocus,
        numberOfQuestions: 5
      };

      const aiResponse = await axios.post(`${backendUrl}/api/ai/generate-questions`,
        aiData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const generateQuestions = aiResponse.data;


      const data = { questions: generateQuestions, sessionId }
      const response = await axios.post(
        `${backendUrl}/api/questions/add`, data, { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log("loadmore", response)

      if (response.data.success) {
        toast.success("Added more Q&A!!");
        getSession();
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
      setLoadMoreLoading(false);
    }
  };




  return (
    <>
      <div>
        <div>
          <Navbar />

        </div>

        <div className="mt-15 max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
          {/* Main section */}
          <div className="flex-1">
            {session && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold text-gray-800 capitalize">{session.role}</h1>
                  <p className="capitalize text-gray-600 mt-1 italic">{session.topicsToFocus}</p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-700">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Experience: {session.experience}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">{session.questions?.length || 0} Q&A</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                    Last Updated:{' '}
                    {session.updatedAt
                      ? new Date(session.updatedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      : 'N/A'}
                  </span>
                </div>

                {/* Q&A Blocks: horizontal scroll on mobile */}
                <div className='mt-[-15px]'>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Interview Q & A</h2>
                </div>
                <div
                  className="
                  flex flex-col md:flex-col gap-4
                  overflow-x-auto md:overflow-x-visible
                  pb-3 w-full mt-[-10px]
                  "
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9',
                  }}
                >
                  <AnimatePresence initial={false}>
                    {sortedQuestions.length > 0 ? (
                      sortedQuestions.map((qna) => (
                        <motion.div
                          key={qna._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="
                          min-w-[320px] w-[90vw] sm:w-[400px] max-w-[95vw]
                          md:min-w-0 md:w-auto
                          flex-shrink-0
                          border rounded-lg shadow-sm bg-white
                        "
                        >
                          <div className="flex items-center p-4 gap-4 hover:bg-gray-50">
                            {/* Pin */}
                            <div className="w-8 flex justify-center">
                              <button
                                onClick={() => togglePin(qna._id)}
                                className={`cursor-pointer text-gray-500 hover:text-blue-600 transition-transform duration-200 ${pinned.includes(qna._id) ? 'rotate-12' : ''
                                  }`}
                              >
                                {pinned.includes(qna._id) ? '📍' : '📌'}
                              </button>
                            </div>
                            {/* Question */}
                            <div
                              className="flex-1 font-medium text-gray-800 cursor-pointer"
                              onClick={() =>
                                setOpenAnswers((prev) => ({
                                  ...prev,
                                  [qna._id]: !prev[qna._id],
                                }))
                              }
                            >
                              Q: {qna.question}
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-3">
                              <button
                                className="text-blue-500 text-sm hover:underline whitespace-nowrap"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setlearnMore(qna);
                                }}
                              >
                                ✨ Learn More
                              </button>
                              <button
                                onClick={() =>
                                  setOpenAnswers((prev) => ({
                                    ...prev,
                                    [qna._id]: !prev[qna._id],
                                  }))
                                }
                                className="cursor-pointer text-xl font-bold text-gray-700 transform transition-transform duration-300"
                              >
                                {openAnswers[qna._id] ? '⌃' : '⌄'}
                              </button>
                            </div>
                          </div>
                          {/* Answer */}
                          <motion.div
                            initial={false}
                            animate={{
                              height: openAnswers[qna._id] ? 'auto' : 0,
                              opacity: openAnswers[qna._id] ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-gray-50 text-gray-700"
                          >
                            {openAnswers[qna._id] && (
                              <div className="p-4">
                                <strong>Ans:</strong> {qna.answer}
                              </div>
                            )}
                          </motion.div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-600 italic">No questions available</p>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Sidebar/Learn More: modal on mobile, sticky on md+ */}
          <div className="md:w-1/3 w-full mt-6 md:mt-0">
            {learnMore && (
              <>
                {/* Mobile Modal */}
                <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center md:hidden" onClick={() => setlearnMore(null)}>
                  <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
                    <LearnMore onClose={() => setlearnMore(null)}
                      question={learnMore.question}
                      userToken={userToken} />
                  </div>
                </div>
                {/* Sticky sidebar on desktop */}
                <div className="hidden md:block sticky top-4 z-30">
                  <LearnMore onClose={() => setlearnMore(null)}
                    question={learnMore.question}
                    userToken={userToken} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 mb-4">
        <button
          type="button"
          className="
      flex items-center justify-center gap-2
      w-full max-w-[180px] sm:max-w-[160px] h-10 sm:h-9
      bg-black text-white text-sm font-medium rounded
      border border-black shadow
      hover:bg-gray-900 hover:scale-105 transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-black/30
      disabled:opacity-70
    "
          onClick={loadMoreQuestions}
          disabled={loadMoreLoading}
        >
          <span>Load More</span>
          {loadMoreLoading ? (
            <LoadMore size={18} color="white" />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>
    </>
  );
};

export default Interviewprep;
