import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import {Toaster} from "react-hot-toast"

import Signup from './pages/Signup'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Interviewprep from './pages/InterviewPrep'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
function App() {
<ToastContainer position="top-right" autoClose={3000} />

  return (
    <>
    <div>
         <ToastContainer />

      <Router>
        <Routes>
          
          <Route path='/' element={<LandingPage/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/interview-prep/:sessionId' element={<Interviewprep/>}></Route>
        </Routes>
      </Router>

      <Toaster
      toastOptions={{
        className:"",
        style:{
        fontSize:"13px",
        },
      }}
      />
    </div>
    </>
  )
}

export default App
