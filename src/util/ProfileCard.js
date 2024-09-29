import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import MongoDbModel from '../models/mongodb';
import styles from './ProfileCard.module.css'; // Create a corresponding CSS module for styling

const ProfileCard = ({ username }) => {
    const [hovering, setHovering] = useState(false);
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await MongoDbModel.getUserProfile(username); // Assuming this method fetches the profile data
                console.log(username);
                setUserData(data);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
            }
            console.log(userData);
        };
        fetchUserData();
    }, [username, hovering]);

    return (
        <div> 
            <div className={styles.profileCard}>
                <img src={`/images/profile/${userData.profilePic}`} alt={`${userData.username}'s profile`} />
                <h4>{userData.username}</h4>
                <p>Status: {userData.status}</p>
                <p>Games: {userData.games.length}</p>
                <p>Friends: {userData.friends.length}</p>
            </div>
        </div>
    );
};

export default ProfileCard;
