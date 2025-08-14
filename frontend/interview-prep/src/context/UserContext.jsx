import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ContextApp = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //check token expiry
  const checkTokenExpiry = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000; // true if expired
    } catch {
      return true; // if decoding fails, treat as expired
    }
  };

  const storedToken = localStorage.getItem("userToken");
  //this is checking if the token is available in local storage and is not expired,it not it will return storedtoken otherwise false
  const initialToken =
    storedToken && !checkTokenExpiry(storedToken) ? storedToken : false;

  const [userToken, setuserToken] = useState(initialToken);
  const [userdata, setuserdata] = useState({});

  //this will check if there is a token and its expired, it will remove from localstorage
  useEffect(() => {
    if (storedToken && checkTokenExpiry(storedToken)) {
      localStorage.removeItem("userToken");
      setuserToken(false);
    }
  }, []);

  const profilePicUrl = userdata.profilePic
    ? `${backendUrl}/${userdata.profilePic.replace(/\\/g, "/")}`
    : "https://dummyimage.com/100x100/eee/aaa";

  const getDataHandler = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setuserdata(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("userToken");
          setuserToken(false);
        }
        toast.error(err.response.data?.message || "Invalid Credentials");
      } else if (err.request) {
        toast.error("No response from server. Check your backend.");
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  const value = {
    userToken,
    setuserToken,
    userdata,
    setuserdata,
    profilePicUrl,
    getDataHandler,
    backendUrl,
  };

  return (
    <ContextApp.Provider value={value}>{props.children}</ContextApp.Provider>
  );
};

export default AppContextProvider;
