import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

interface PrivateRouteProps {
    allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({allowedRoles}) => {
    const {isAuthenticated, roles} = useSelector((state: RootState) => state.auth);

    const hasAccess = isAuthenticated && roles.some(role => allowedRoles.includes(role));

    return hasAccess ? <Outlet/> : <Navigate to = "/login" />;
};

export default PrivateRoute;
