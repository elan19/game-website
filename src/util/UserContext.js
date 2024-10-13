import React, { createContext, useState, useEffect } from 'react';
import MongoDbModel from '../models/mongodb'; // Adjust the path as needed

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    async function fetchUserData() {
        try {
            const username = localStorage.getItem('username');
            const id = localStorage.getItem('loginId');
            const data = await MongoDbModel.getOneUser(username, id);
    
            if (data) {
                setUserData(data);
            }
    
            const ipAddress = await fetchIPAddress();
            await MongoDbModel.checkRateLimit(ipAddress);  // Send IP
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    }

    const deleteUserData = async () => {
        try {
            setUserData(null); // Reset user data in context
        } catch (error) {
            console.error('Failed to delete user data:', error);
        }
    };

    // Function to get the client's IP address
    async function fetchIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json'); // Get public IP address
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Error fetching IP address:", error);
            return null;
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUserData, deleteUserData }}>
            {children}
        </UserContext.Provider>
    );
};
