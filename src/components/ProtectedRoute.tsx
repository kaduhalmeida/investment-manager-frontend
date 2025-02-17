import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;  
  }

  return element; 
};

export default ProtectedRoute;
