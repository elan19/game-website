import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext'; // Import UserContext
import MongoDbModel from '../../models/mongodb';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import defaultProfilePic from '../../images/login.jpg';
import MoneyModal from './MoneyModal'; // Import the MoneyModal component

const ProfileView = () => {
    const { userData, fetchUserData } = useContext(UserContext); // Use UserContext
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    useEffect(() => {
        if (!userData) {
            fetchUserData();
            console.log(userData);
        } else {
            setLoading(false);
        }
        console.log(userData);
    }, [userData, fetchUserData]);

    const addMoney = async (amount) => {
        try {
            await MongoDbModel.updateUserMoney(userData.username, amount);
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profileDiv}>
            {showModal && (
                <MoneyModal
                    onClose={() => setShowModal(false)}
                    onAddMoney={addMoney}
                />
            )}
            {userData ? (
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileName}>{userData.username}</h1>
                    <Link to="/profile/edit" className={styles.editProfileLink}>
                        Edit Profile
                    </Link>
                    <div className={styles.addMoney}>
                        <button onClick={() => setShowModal(true)} className={styles.addMoneyButton}>
                            Add Money
                        </button>
                    </div>
                    <div className={styles.profileImageContainer}>
                        <img src={`images/profile/`+userData.profilePic || defaultProfilePic} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p>{userData.name}</p>
                        <p className={styles.test}>{userData.desc}</p>
                        <p>{`Money: $${parseFloat(userData.money.toFixed(2))}`}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <h1>Details</h1>
                        <p>{`Number of Games: ${userData.games.length}`}</p>
                        <Link to={`/profile/${userData.username}/inventory`} className={styles.inventoryLink}>
                            Inventory
                        </Link>
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
