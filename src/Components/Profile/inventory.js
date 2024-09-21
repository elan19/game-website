import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import { Link } from 'react-router-dom';
import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const InventoryView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedGameIndex, setSelectedGameIndex] = useState(0); // Track selected game by index
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };

        // Only fetch data if userData is not already loaded
        if (!userData) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [userData, fetchUserData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const games = userData?.games || [];
    const inventory = userData?.inventory || [];

    // Function to handle item selling
    const handleSellItem = (item) => {
        console.log(`Selling item: ${item[0]}`);
        const updatedInventory = inventory[selectedGameIndex].filter(i => i !== item);
        setSelectedItem(null); // Clear selected item after selling
        console.log(updatedInventory); // Replace this with a state update or API call
    };

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img src={userData?.profilePic || defaultProfilePic} alt="Profile" className={styles.profilePic} />
                <div className={styles.username}>
                    <Link to={`/profile/${userData?.username}`} className={styles.editProfileLink}>
                        {userData?.username || 'User'}
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
                    <div>No games found.</div>
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
                    <h2>{games[selectedGameIndex] || 'No Game Selected'}</h2>
                    <p>No items found for {games[selectedGameIndex] || 'this game'}.</p>
                </div>
            )}

            {/* Item details */}
            {selectedItem && (
                <div className={styles.itemDetails}>
                    <img src={defaultProfilePic} alt={selectedItem[0]} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem[0]}</div>
                    <div className={styles.itemDescription}>{selectedItem[1]}</div>        
                    
                    <button className={styles.sellButton} onClick={() => handleSellItem(selectedItem)}>
                        Sell Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
