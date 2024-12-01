import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import storage from "../commons/storage";

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({allowedRoles}) => {
    const user = storage.getTokenData();
    const hasAccess = user?.isAuthenticated && user.authorities.some(role => allowedRoles.includes(role as string));

    return hasAccess ? <Outlet/> : <Navigate to="/login"/>;
};

export default PrivateRoute;
