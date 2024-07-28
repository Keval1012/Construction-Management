import React, { createContext, useEffect, useState } from 'react';
import { getRoleByUserId, getUserDataById } from '../API/Api';
import { useDispatch } from 'react-redux';
import { setCurrentUserData, setCurrentUserRole } from '../redux/features/userDataSlice';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState('');
    const [currUserData, setCurrUserData] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userCompanyList, setUserCompanyList] = useState([]);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [permissions, setPermissions] = useState([]);

    const checkAndSetAllValues = () => {
        if (localStorage.getItem('token')) {
            setUser(localStorage.getItem('token'));
            setUserId(localStorage.getItem('userId'));
            setIsLoading(false);
            fetchUserName();
            getCurrentRole();
        } else {
            // message.error('Session is expired - Please make a new login request');
            setTimeout(() => {
                setUser(null);
                setUserId('');
                setIsLoading(false);
                setPermissions([]);
            }, 500);
        }
    };

    const fetchUserName = async () => {
        if (userId) {
            const res = await getUserDataById(userId);
            if (res?.data?.data[0]) {
                setCurrUserData(res?.data?.data[0]);
                dispatch(setCurrentUserData(res?.data?.data[0]));
            }
        }
    };
    
    const getCurrentRole = async () => {
        if (userId) {
            const res = await getRoleByUserId({ userId: userId });
            if (res?.data?.role) {
                setCurrentRole(res.data?.role);
                dispatch(setCurrentUserRole(res.data?.role));
            }
        }
    };

    useEffect(() => {
        const ac = new AbortController();
        checkAndSetAllValues();
        return () => ac.abort();
    }, [isAuth]);

    useEffect(() => {
        checkAndSetAllValues();
    }, []);

    useEffect(() => {
        fetchUserName();
        getCurrentRole();
    }, [userId]);

    if (isLoading) {
        return "Loading";
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                userId,
                setUserId,
                isAuth,
                setIsAuth,
                userCompanyList,
                setUserCompanyList,
                currentCompany,
                setCurrentCompany,
                permissions,
                setPermissions,
                currUserData,
                setCurrUserData,
                currentRole,
                setCurrentRole
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;