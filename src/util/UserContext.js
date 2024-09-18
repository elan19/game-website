import React, { createContext, useState, useEffect } from 'react';
import MongoDbModel from '../models/mongodb'; // Adjust the path as needed

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const username = localStorage.getItem('username');
            const id = localStorage.getItem('loginId');
            const data = await MongoDbModel.getOneUser(username, id);
            if (data) {
                setUserData(data);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const deleteUserData = async () => {
        try {
            setUserData(null); // Reset user data in context
        } catch (error) {
            console.error('Failed to delete user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUserData, deleteUserData }}>
            {children}
        </UserContext.Provider>
    );
};
