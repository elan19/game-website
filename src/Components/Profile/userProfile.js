import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get the username from the route
import MongoDbModel from '../../models/mongodb';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import defaultProfilePic from '../../images/login.jpg';


const UserProfileView = () => {
    const { username } = useParams(); // Extract the username from the route parameters
    const [user, setUser] = useState(null); // State to hold the user data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (username === localStorage.getItem("username")) {
            navigate("/profile");
        }

        const fetchUser = async () => {
            try {
                const fetchedUser = await MongoDbModel.getUserProfile(username);
                console.log(fetchedUser); // Fetch user data by username
                setUser(fetchedUser);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user profile.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]); // Re-run the effect if the username changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profileDiv}>
            {user ? (
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileName}>{user.username}'s profile</h1>
                    <div className={styles.profileImageContainer}>
                        <img src={user.profilePic || defaultProfilePic} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p className={styles.profileInfoName}>{user.name}</p>
                        <p>{user.desc}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <h1>Details</h1>
                        <p>{`Number of Games: ${user.games.length}`}</p>
                        <Link to={`/profile/${username}/inventory`} className={styles.inventoryLink}>
                            Inventory
                        </Link>
                        <p>{`Number of Friends: ${user.friends.length}`}</p>
                    </div>
                </div>
            ) : (
                <div>No user data found.</div>
            )}
        </div>
    );
};

export default UserProfileView;
