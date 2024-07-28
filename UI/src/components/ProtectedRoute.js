import { message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { checkModulePermission } from '../helper';

const ProtectedRoute = ({ user, module, children }) => {
    const { setIsAuth } = useContext(AuthContext)??{};
    const [isModuleGranted, setIsModuleGranted] = useState(true);
    const token = localStorage.getItem('token');
    const getPermissions = useSelector((state) => state?.userData?.permissions);

    useEffect(() => {
        const getData = async () => {
            if (token && module) {
                const checkPermission = await checkModulePermission(getPermissions, module);
                if (!checkPermission?.isRead) setIsModuleGranted(false);
            }
        }
        getData();
    }, [token, module]);

    if (!token) {
        setIsAuth(false);
        window.location.href = '/login';
        message.error('Session Expired, Please Login Again.');
    }
    
    if (!isModuleGranted) {
        return <Navigate to='/unauthorized' />
    }

    return token && user ?
    // return localStorage.getItem('token') ?
        children
        : 
        <Navigate to='/login' />
}

export default ProtectedRoute;