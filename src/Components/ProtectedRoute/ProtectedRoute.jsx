import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = sessionStorage.getItem('token'); // Check if token exists
    return token ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
