import React, { createContext, useState, useEffect } from 'react';
import MongoDbModel from '../models/mongodb'; // Adjust the path as needed

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const username = localStorage.getItem('username');
            const data = await MongoDbModel.getOneUser(username);
            if (data) {
                setUserData(data);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
};
