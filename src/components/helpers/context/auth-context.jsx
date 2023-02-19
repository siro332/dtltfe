import React, { createContext, useState } from "react";
import axios from "axios";
import { PATH } from "../../../constants/API";
const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const login = (userInfo) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", userInfo.token)
    localStorage.setItem("email", userInfo.user.email)
    localStorage.setItem("firstname", userInfo.user.firstname)
    localStorage.setItem("lastname", userInfo.user.lastname)
  };
  const logout = () => {
    console.log("logout")
    setIsAuthenticated(false);
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("firstname")
    localStorage.removeItem("lastname")
  }

  const isTokenExpired = async () => {
    if (localStorage.getItem("token")) {
      const isTokenExpired = await axios.get(PATH.API_ROOT_URL + PATH.API_AUTH_LOGIN + "/check-token-expired",{
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    });
      if (isTokenExpired.data === true){
        (logout)()
      }
    }
  }
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    setInterval(isTokenExpired, 4000);
    return token ? true : false;
  };
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  

  const value = { isAuthenticated, login, logout }
  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}
export { AuthContext, AuthContextProvider }