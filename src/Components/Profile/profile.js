import React, { useState, useEffect } from 'react';
import MongoDbModel from '../../models/mongodb';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './Profile.module.css'; // Assuming you have a CSS file for styling

import defaultProfilePic from '../../images/login.jpg';

const ProfileView = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await MongoDbModel.getOneUser(localStorage.getItem('username'));
                if (data) {
                    setUserData(data);
                } else {
                    setError('Failed to fetch user data.');
                }
            } catch (err) {
                setError('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profileDiv}>
            {userData ? (
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileName}>{userData.username}</h1>
                        <Link to="/profile/edit" className={styles.editProfileLink}>
                            Edit Profile
                        </Link>
                    <div className={styles.profileImageContainer}>
                        <img src={userData.profilePic || defaultProfilePic} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p>{userData.name}Test Testing</p>
                        <p className={styles.test}>{userData.desc}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <h1>Details</h1>
                        <p>{`Number of Games: ${userData.games.length}`}</p>
                        <p>Inventory</p>
                        <p>{`Number of Friends: ${userData.friends.length}`}</p>
                    </div>
                    
                </div>
            ) : (
                <div>No user data found.</div>
            )}
        </div>
    );
};

export default ProfileView;
