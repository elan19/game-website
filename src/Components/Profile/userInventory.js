import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import { Link, useParams } from 'react-router-dom'; // Use useParams to fetch the user ID from the URL
import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const OtherUserInventoryView = () => {
    const { fetchOtherUserData } = useContext(UserContext); // Assuming you have a method to fetch another user's data
    const { username } = useParams(); // Get the username or ID from the route parameters
    const [loading, setLoading] = useState(true);
    const [otherUserData, setOtherUserData] = useState(null); // Store the other user's data
    const [selectedGameIndex, setSelectedGameIndex] = useState(0); // Track selected game by index
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    
    // Fetch the other user's data when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await MongoDbModel.getUserProfile(username);
                setOtherUserData(fetchedUser);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user profile.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [username, fetchOtherUserData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const games = otherUserData?.games || [];
    const inventory = otherUserData?.inventory || [];

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img src={otherUserData?.profilePic || defaultProfilePic} alt="Profile" className={styles.profilePic} />
                <div className={styles.username}>
                    <Link to={`/profile/${otherUserData?.username}`} className={styles.editProfileLink}>
                        {otherUserData?.username || 'Unknown User'}
                    </Link>
                </div>
            </div>

            {/* Game tabs */}
            <div className={styles.gameTabs}>
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedGameIndex(index)}
                            className={`${styles.gameTab} ${selectedGameIndex === index ? styles.activeTab : ''}`}
                        >
                            {game} ({inventory[index] ? inventory[index].length : 0})
                        </button>
                    ))
                ) : (
                    <div>No games found for this user.</div>
                )}
            </div>

            {/* Inventory grid */}
            {games.length > 0 && inventory[selectedGameIndex]?.length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{games[selectedGameIndex]}</h1>
                    {inventory[selectedGameIndex].map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.inventoryItem} ${selectedItem === item ? styles.selectedItem : ''}`}
                            style={index === 0 ? { marginLeft: '10px'} : {}}
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={defaultProfilePic} alt={item[0]} className={styles.itemImage} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className={styles.inventoryGrid}>
                    <h2>{games[selectedGameIndex] || 'No Game Selected'}</h2>
                    <p>No items found in this game.</p>
                </div>
                </div>
            )}

            {/* Item details */}
            {selectedItem && (
                <div className={styles.itemDetails}>
                    <img src={defaultProfilePic} alt={selectedItem[0]} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem[0]}</div>
                    <div className={styles.itemDescription}>{selectedItem[1]}</div>
                    {/* No "Sell" button here since it's another user's inventory */}
                </div>
            )}
        </div>
    );
};

export default OtherUserInventoryView;
