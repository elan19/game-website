import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';
import about from '../../images/about-gemenskap.png';

const InventoryView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedGameIndex, setSelectedGameIndex] = useState(0); // Track selected game by index
    const [selectedItem, setSelectedItem] = useState(null);
    
    useEffect(() => {
        if (!userData) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [userData, fetchUserData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData || !userData.games || !userData.inventory) {
        return <div>No inventory found.</div>;
    }

    const games = userData.games;
    const inventory = userData.inventory;

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img src={userData.profilePic || defaultProfilePic} alt="Profile" className={styles.profilePic} />
                <div className={styles.username}>
                    <p>{userData.name || userData.username}</p>
                </div>
            </div>

            {/* Game tabs */}
            <div className={styles.gameTabs}>
                {games.map((game, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedGameIndex(index)}
                        className={`${styles.gameTab} ${selectedGameIndex === index ? styles.activeTab : ''}`}
                    >
                        {game} ({inventory[index] ? inventory[index].length : 0})
                    </button>
                ))}
            </div>

            {/* Inventory grid */}
            {inventory[selectedGameIndex] && inventory[selectedGameIndex].length > 0 ? (
                <div className={styles.inventoryGrid}>
                    {games[selectedGameIndex]}
                    {inventory[selectedGameIndex].map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.inventoryItem} ${selectedItem === item ? styles.selectedItem : ''}`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={defaultProfilePic} alt={item.name} className={styles.itemImage} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>No items found for {games[selectedGameIndex]}!</div>
            )}

            {/* Item details */}
            {selectedItem && (
                <div className={styles.itemDetails}>
                    <img src={defaultProfilePic} alt={selectedItem.name} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem[0]}</div>
                    <div className={styles.itemDescription}>{selectedItem[1]}</div>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
