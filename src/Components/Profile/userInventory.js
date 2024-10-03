import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import { Link, useParams } from 'react-router-dom';
import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const OtherUserInventoryView = () => {
    const { fetchOtherUserData } = useContext(UserContext);
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [otherUserData, setOtherUserData] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 450);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const inventory = otherUserData?.inventory || [];
    const gamesFromInventory = [...new Set(inventory.map(item => item.gameName))];

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img 
                    src={otherUserData.profilePic ? `/images/profile/${otherUserData.profilePic}` : defaultProfilePic} 
                    alt="Profile" 
                    className={styles.profilePic} 
                />
                
                <div className={styles.username}>
                    <Link to={`/profile/${otherUserData?.username}`} className={styles.editProfileLink}>
                        {otherUserData?.username || 'Unknown User'}
                    </Link>
                </div>
            </div>

            {/* Game tabs */}
            <div className={styles.gameTabs}>
                {gamesFromInventory.length > 0 ? (
                    gamesFromInventory.map((game, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedGame(game)}
                            className={`${styles.gameTab} ${selectedGame === game ? styles.activeTab : ''}`}
                        >
                            {game}
                        </button>
                    ))
                ) : (
                    <div>No games found for this user.</div>
                )}
            </div>

            {/* Inventory grid */}
            {selectedGame && inventory.find(item => item.gameName === selectedGame)?.cards.length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{selectedGame}</h1>
                    {inventory.find(item => item.gameName === selectedGame).cards.map((card, index) => (
                        <div
                            key={index}
                            className={styles.inventoryItem}
                            onClick={() => setSelectedItem(card)}
                        >
                            <img src={`/images/inventory/${card.cardPic}`} alt={card.cardName} className={styles.itemImage} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.inventoryGrid}>
                    <h2 className={styles.noGameSelectedH2}>{selectedGame || 'No Game Selected'}</h2>
                </div>
            )}

            {/* Modal for the selected item - Only show on mobile */}
            {selectedItem && isMobile && (
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={() => setSelectedItem(null)}>X</button>
                    <div className={styles.itemDetails}>
                        <img src={`/images/inventory/${selectedItem.cardPic}`} alt={selectedItem.cardPic} className={styles.itemDetailImage} />
                        <div className={styles.itemName}>{selectedItem.cardName}</div>
                        <div className={styles.itemDescription}>{selectedItem.cardDesc}</div>
                    </div>
                </div>
            )}

            {/* Item details for desktop view */}
            {selectedItem && !isMobile && (
                <div className={styles.itemDetails}>
                    <img src={`/images/inventory/${selectedItem.cardPic}`} alt={selectedItem.cardPic} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem.cardName}</div>
                    <div className={styles.itemDescription}>{selectedItem.cardDesc}</div>
                </div>
            )}
        </div>
    );
};

export default OtherUserInventoryView;
