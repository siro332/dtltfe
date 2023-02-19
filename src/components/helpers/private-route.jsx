import { Navigate } from 'react-router-dom';
import React, { useContext } from "react";
import { AuthContext } from './context/auth-context';
const PrivateRoute = ({ children }) => {

 const { isAuthenticated } = useContext(AuthContext);

 return isAuthenticated ? children : <Navigate to={{ pathname: '/', }} />
};

export default PrivateRoute;
